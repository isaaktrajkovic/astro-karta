import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Printer, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { getReferralOrders, getReferrals, Referral, ReferralOrder } from '@/lib/api';
import { formatPrice } from '@/lib/utils';

const ReferralPrint = () => {
  const { referralId } = useParams();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [referral, setReferral] = useState<Referral | null>(null);
  const [orders, setOrders] = useState<ReferralOrder[]>([]);
  const [printedAt, setPrintedAt] = useState<Date | null>(null);

  useEffect(() => {
    document.body.classList.add('print-report');
    return () => document.body.classList.remove('print-report');
  }, []);

  const fetchData = useCallback(async () => {
    const id = Number(referralId);
    if (!Number.isFinite(id)) {
      setError(language === 'sr' ? 'Nevažeći referal.' : 'Invalid referral.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const [referralsResponse, ordersResponse] = await Promise.all([
        getReferrals(),
        getReferralOrders(id),
      ]);
      const matched = referralsResponse.referrals.find((item) => item.id === id) || null;
      setReferral(matched);
      setOrders(ordersResponse.orders || []);
      setPrintedAt(new Date());
    } catch (fetchError) {
      console.error('Failed to load referral print data:', fetchError);
      setError(language === 'sr'
        ? 'Nije moguće učitati izveštaj.'
        : 'Could not load the report.');
    } finally {
      setLoading(false);
    }
  }, [language, referralId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatPercentBreakdown = (valueMap: Map<number, number>) => {
    if (!valueMap.size) return '0%';
    const entries = Array.from(valueMap.entries()).sort((a, b) => a[0] - b[0]);
    if (entries.length === 1) {
      return `${entries[0][0]}%`;
    }
    return entries.map(([value, count]) => `${value}% (${count})`).join(', ');
  };

  const summaryRows = useMemo(() => {
    const summaryMap = new Map<string, {
      product_name: string;
      order_count: number;
      total_revenue_cents: number;
      total_commission_cents: number;
      paid_cents: number;
      discount_percent_map: Map<number, number>;
      commission_percent_map: Map<number, number>;
    }>();

    orders.forEach((order) => {
      const existing = summaryMap.get(order.product_name) || {
        product_name: order.product_name,
        order_count: 0,
        total_revenue_cents: 0,
        total_commission_cents: 0,
        paid_cents: 0,
        discount_percent_map: new Map<number, number>(),
        commission_percent_map: new Map<number, number>(),
      };
      existing.order_count += 1;
      existing.total_revenue_cents += order.final_price_cents || 0;
      existing.total_commission_cents += order.referral_commission_cents || 0;
      existing.paid_cents += order.referral_paid_cents || 0;
      const discountPercent = Number.isFinite(order.discount_percent) ? order.discount_percent : 0;
      const commissionPercent = Number.isFinite(order.referral_commission_percent)
        ? order.referral_commission_percent
        : 0;
      existing.discount_percent_map.set(
        discountPercent,
        (existing.discount_percent_map.get(discountPercent) || 0) + 1
      );
      existing.commission_percent_map.set(
        commissionPercent,
        (existing.commission_percent_map.get(commissionPercent) || 0) + 1
      );
      summaryMap.set(order.product_name, existing);
    });

    return Array.from(summaryMap.values()).sort((a, b) => a.product_name.localeCompare(b.product_name));
  }, [orders]);

  const totals = useMemo(() => {
    return summaryRows.reduce(
      (acc, row) => {
        acc.order_count += row.order_count;
        acc.total_revenue_cents += row.total_revenue_cents;
        acc.total_commission_cents += row.total_commission_cents;
        acc.paid_cents += row.paid_cents;
        return acc;
      },
      {
        order_count: 0,
        total_revenue_cents: 0,
        total_commission_cents: 0,
        paid_cents: 0,
      }
    );
  }, [summaryRows]);

  const totalRemainingCents = Math.max(totals.total_commission_cents - totals.paid_cents, 0);
  const printedAtLabel = printedAt
    ? printedAt.toLocaleDateString(language === 'sr' ? 'sr-RS' : 'en-US')
    : '';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-8 print:py-4">
        <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" className="gap-2">
              <Link to="/dashboard">
                <ArrowLeft className="h-4 w-4" />
                {language === 'sr' ? 'Nazad na dashboard' : 'Back to dashboard'}
              </Link>
            </Button>
            <Button variant="outline" className="gap-2" onClick={fetchData} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {language === 'sr' ? 'Osveži' : 'Refresh'}
            </Button>
          </div>
          <Button variant="cosmic" className="gap-2" onClick={() => window.print()}>
            <Printer className="h-4 w-4" />
            {language === 'sr' ? 'Štampaj / PDF' : 'Print / PDF'}
          </Button>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center text-slate-500 shadow-sm print:shadow-none">
            <RefreshCw className="mx-auto mb-4 h-8 w-8 animate-spin text-slate-400" />
            {language === 'sr' ? 'Učitavanje izveštaja...' : 'Loading report...'}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center text-red-700 shadow-sm print:shadow-none">
            {error}
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm print:rounded-none print:border-slate-300 print:shadow-none">
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 px-6 py-6 text-white print:bg-slate-900">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-300">
                    {language === 'sr' ? 'Referal izveštaj' : 'Referral report'}
                  </p>
                  <h1 className="mt-2 text-2xl font-semibold">Astro whisper</h1>
                </div>
                {referral && (
                  <div className="text-right text-sm text-slate-200">
                    <div className="text-base font-semibold text-white">{referral.code}</div>
                    <div>
                      {referral.owner_first_name} {referral.owner_last_name}
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-200">
                {printedAtLabel && (
                  <span>
                    {language === 'sr' ? 'Datum izveštaja:' : 'Report date:'} {printedAtLabel}
                  </span>
                )}
                {referral && (
                  <>
                    <span>
                      {language === 'sr' ? 'Trenutni popust:' : 'Current discount:'} {referral.discount_percent}%
                    </span>
                    <span>
                      {language === 'sr' ? 'Trenutna provizija:' : 'Current commission:'} {referral.commission_percent}%
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="px-6 py-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">
                  {language === 'sr' ? 'Sažetak po uslugama' : 'Service summary'}
                </h2>
                <span className="text-sm text-slate-500">
                  {language === 'sr'
                    ? `Ukupno porudžbina: ${totals.order_count}`
                    : `Total orders: ${totals.order_count}`}
                </span>
              </div>

              {summaryRows.length === 0 ? (
                <div className="mt-6 rounded-xl border border-dashed border-slate-200 px-6 py-8 text-center text-slate-500">
                  {language === 'sr' ? 'Nema porudžbina za ovaj referal.' : 'No orders for this referral.'}
                </div>
              ) : (
                <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-900 text-white">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">
                          {language === 'sr' ? 'Usluga' : 'Service'}
                        </th>
                        <th className="px-4 py-3 text-right font-semibold">
                          {language === 'sr' ? 'Broj porudžbina' : 'Orders'}
                        </th>
                        <th className="px-4 py-3 text-right font-semibold">
                          {language === 'sr' ? 'Ukupni promet' : 'Total revenue'}
                        </th>
                        <th className="px-4 py-3 text-right font-semibold">
                          {language === 'sr' ? 'Popust (%)' : 'Discount (%)'}
                        </th>
                        <th className="px-4 py-3 text-right font-semibold">
                          {language === 'sr' ? 'Ukupna provizija' : 'Total commission'}
                        </th>
                        <th className="px-4 py-3 text-right font-semibold">
                          {language === 'sr' ? 'Provizija (%)' : 'Commission (%)'}
                        </th>
                        <th className="px-4 py-3 text-right font-semibold">
                          {language === 'sr' ? 'Isplaćeno' : 'Paid'}
                        </th>
                        <th className="px-4 py-3 text-right font-semibold">
                          {language === 'sr' ? 'Preostalo' : 'Remaining'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {summaryRows.map((row) => {
                        const remainingCents = Math.max(row.total_commission_cents - row.paid_cents, 0);
                        return (
                          <tr key={row.product_name} className="bg-white">
                            <td className="px-4 py-3 text-slate-900">{row.product_name}</td>
                            <td className="px-4 py-3 text-right text-slate-700">{row.order_count}</td>
                            <td className="px-4 py-3 text-right text-slate-700">
                              {formatPrice(row.total_revenue_cents)}
                            </td>
                            <td className="px-4 py-3 text-right text-slate-700">
                              {formatPercentBreakdown(row.discount_percent_map)}
                            </td>
                            <td className="px-4 py-3 text-right text-slate-700">
                              {formatPrice(row.total_commission_cents)}
                            </td>
                            <td className="px-4 py-3 text-right text-slate-700">
                              {formatPercentBreakdown(row.commission_percent_map)}
                            </td>
                            <td className="px-4 py-3 text-right text-slate-700">
                              {formatPrice(row.paid_cents)}
                            </td>
                            <td className="px-4 py-3 text-right text-slate-700">
                              {formatPrice(remainingCents)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="bg-slate-50 text-slate-900">
                        <td className="px-4 py-3 font-semibold">
                          {language === 'sr' ? 'Ukupno' : 'Total'}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold">{totals.order_count}</td>
                        <td className="px-4 py-3 text-right font-semibold">
                          {formatPrice(totals.total_revenue_cents)}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold">—</td>
                        <td className="px-4 py-3 text-right font-semibold">
                          {formatPrice(totals.total_commission_cents)}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold">—</td>
                        <td className="px-4 py-3 text-right font-semibold">{formatPrice(totals.paid_cents)}</td>
                        <td className="px-4 py-3 text-right font-semibold">{formatPrice(totalRemainingCents)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        <p className="text-xs text-slate-400 print:hidden">
          {language === 'sr'
            ? 'Za PDF izvoz izaberite Print i sačuvajte kao PDF.'
            : 'For PDF export, choose Print and save as PDF.'}
        </p>
      </div>
    </div>
  );
};

export default ReferralPrint;
