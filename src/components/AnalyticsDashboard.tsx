import { useEffect, useMemo, useState } from 'react';
import { BarChart3, RefreshCw, TrendingUp } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from 'recharts';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { formatPrice } from '@/lib/utils';
import { getAnalyticsSummary, type AnalyticsSummary } from '@/lib/api';

type RangeFilter = '7d' | '30d' | '90d' | '365d';

const buildRange = (range: RangeFilter) => {
  const now = new Date();
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const start = new Date(end);

  if (range === '7d') {
    start.setUTCDate(start.getUTCDate() - 6);
  } else if (range === '30d') {
    start.setUTCDate(start.getUTCDate() - 29);
  } else if (range === '90d') {
    start.setUTCDate(start.getUTCDate() - 89);
  } else {
    start.setUTCDate(start.getUTCDate() - 364);
  }

  const toIso = (date: Date) => date.toISOString().slice(0, 10);
  return { from: toIso(start), to: toIso(end) };
};

const formatShortDate = (dateStr: string, language: string) => {
  const date = new Date(`${dateStr}T00:00:00Z`);
  return date.toLocaleDateString(language === 'sr' ? 'sr-RS' : 'en-US', {
    month: 'short',
    day: 'numeric',
  });
};

const formatLongDate = (dateStr: string, language: string) => {
  const date = new Date(`${dateStr}T00:00:00Z`);
  return date.toLocaleDateString(language === 'sr' ? 'sr-RS' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

interface AnalyticsDashboardProps {
  active: boolean;
}

const AnalyticsDashboard = ({ active }: AnalyticsDashboardProps) => {
  const { language } = useLanguage();
  const [range, setRange] = useState<RangeFilter>('30d');
  const [utmSource, setUtmSource] = useState('all');
  const [utmCampaign, setUtmCampaign] = useState('all');
  const [referralCode, setReferralCode] = useState('all');
  const [productId, setProductId] = useState('all');
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { from, to } = useMemo(() => buildRange(range), [range]);

  const fetchSummary = async () => {
    setIsLoading(true);
    try {
      const data = await getAnalyticsSummary({
        from,
        to,
        utm_source: utmSource !== 'all' ? utmSource : undefined,
        utm_campaign: utmCampaign !== 'all' ? utmCampaign : undefined,
        referral_code: referralCode !== 'all' ? referralCode : undefined,
        product_id: productId !== 'all' ? productId : undefined,
      });
      setSummary(data);
    } catch (error) {
      console.error('Failed to load analytics summary:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (active) {
      fetchSummary();
    }
  }, [active, range, utmSource, utmCampaign, referralCode, productId]);

  const totals = summary?.totals;
  const daily = summary?.daily || [];
  const topPages = summary?.top_pages || [];
  const topReferrers = summary?.top_referrers || [];
  const topProducts = summary?.top_products || [];
  const topCountries = summary?.top_countries || [];
  const options = summary?.options;

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">
            {language === 'sr' ? 'Analitika' : 'Analytics'}
          </h2>
        </div>
        <Button variant="outline" size="sm" onClick={fetchSummary} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {language === 'sr' ? 'Osvezi' : 'Refresh'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">{language === 'sr' ? 'Period' : 'Range'}</div>
          <Select value={range} onValueChange={(value) => setRange(value as RangeFilter)}>
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">{language === 'sr' ? 'Poslednjih 7 dana' : 'Last 7 days'}</SelectItem>
              <SelectItem value="30d">{language === 'sr' ? 'Poslednjih 30 dana' : 'Last 30 days'}</SelectItem>
              <SelectItem value="90d">{language === 'sr' ? 'Poslednjih 90 dana' : 'Last 90 days'}</SelectItem>
              <SelectItem value="365d">{language === 'sr' ? 'Poslednjih 12 meseci' : 'Last 12 months'}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">UTM Source</div>
          <Select value={utmSource} onValueChange={setUtmSource}>
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{language === 'sr' ? 'Svi izvori' : 'All sources'}</SelectItem>
              {options?.utm_sources.map((source) => (
                <SelectItem key={source} value={source}>
                  {source}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">UTM Campaign</div>
          <Select value={utmCampaign} onValueChange={setUtmCampaign}>
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{language === 'sr' ? 'Sve kampanje' : 'All campaigns'}</SelectItem>
              {options?.utm_campaigns.map((campaign) => (
                <SelectItem key={campaign} value={campaign}>
                  {campaign}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">{language === 'sr' ? 'Referal' : 'Referral'}</div>
          <Select value={referralCode} onValueChange={setReferralCode}>
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{language === 'sr' ? 'Svi kodovi' : 'All codes'}</SelectItem>
              {options?.referral_codes.map((code) => (
                <SelectItem key={code} value={code}>
                  {code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">{language === 'sr' ? 'Proizvod' : 'Product'}</div>
          <Select value={productId} onValueChange={setProductId}>
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{language === 'sr' ? 'Svi proizvodi' : 'All products'}</SelectItem>
              {options?.products.map((product) => (
                <SelectItem key={product} value={product}>
                  {product}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="rounded-lg border border-border bg-secondary/30 p-4">
          <div className="text-xs text-muted-foreground">{language === 'sr' ? 'Posete' : 'Page views'}</div>
          <div className="text-2xl font-semibold text-foreground">{totals?.page_views ?? 0}</div>
        </div>
        <div className="rounded-lg border border-border bg-secondary/30 p-4">
          <div className="text-xs text-muted-foreground">{language === 'sr' ? 'Jedinstveni' : 'Unique visitors'}</div>
          <div className="text-2xl font-semibold text-foreground">{totals?.unique_visitors ?? 0}</div>
        </div>
        <div className="rounded-lg border border-border bg-secondary/30 p-4">
          <div className="text-xs text-muted-foreground">{language === 'sr' ? 'Kreirane porudzbine' : 'Orders created'}</div>
          <div className="text-2xl font-semibold text-foreground">{totals?.order_created ?? 0}</div>
        </div>
        <div className="rounded-lg border border-border bg-secondary/30 p-4">
          <div className="text-xs text-muted-foreground">{language === 'sr' ? 'Checkout pokrenut' : 'Checkout started'}</div>
          <div className="text-2xl font-semibold text-foreground">{totals?.checkout_started ?? 0}</div>
        </div>
        <div className="rounded-lg border border-border bg-secondary/30 p-4">
          <div className="text-xs text-muted-foreground">{language === 'sr' ? 'Prihod' : 'Revenue'}</div>
          <div className="text-2xl font-semibold text-foreground">{formatPrice(totals?.revenue_cents ?? 0)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="h-72 rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-3 text-sm font-medium text-foreground">
            <BarChart3 className="w-4 h-4 text-primary" />
            {language === 'sr' ? 'Posete i jedinstveni' : 'Visits & unique'}
          </div>
          {isLoading ? (
            <div className="text-center text-muted-foreground pt-10">
              {language === 'sr' ? 'Ucitavanje...' : 'Loading...'}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={daily}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => formatShortDate(value, language)}
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <YAxis
                  allowDecimals={false}
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <RechartsTooltip
                  formatter={(value: number, name) => [value, name === 'page_views'
                    ? (language === 'sr' ? 'Posete' : 'Page views')
                    : (language === 'sr' ? 'Jedinstveni' : 'Unique')]}
                  labelFormatter={(value) => formatLongDate(value, language)}
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                />
                <Line type="monotone" dataKey="page_views" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="unique_visitors" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="h-72 rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-3 text-sm font-medium text-foreground">
            <BarChart3 className="w-4 h-4 text-primary" />
            {language === 'sr' ? 'Porudzbine po danu' : 'Orders by day'}
          </div>
          {isLoading ? (
            <div className="text-center text-muted-foreground pt-10">
              {language === 'sr' ? 'Ucitavanje...' : 'Loading...'}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={daily}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => formatShortDate(value, language)}
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <YAxis
                  allowDecimals={false}
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <RechartsTooltip
                  formatter={(value: number, name) => [value, name === 'order_created'
                    ? (language === 'sr' ? 'Kreirane' : 'Created')
                    : (language === 'sr' ? 'Zavrsene' : 'Completed')]}
                  labelFormatter={(value) => formatLongDate(value, language)}
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                />
                <Bar dataKey="order_created" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                <Bar dataKey="order_completed" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-sm font-medium text-foreground mb-3">
            {language === 'sr' ? 'Najposecenije stranice' : 'Top pages'}
          </div>
          {topPages.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              {language === 'sr' ? 'Nema podataka' : 'No data'}
            </div>
          ) : (
            <div className="space-y-2 text-sm">
              {topPages.map((row) => (
                <div key={row.path} className="flex items-center justify-between">
                  <span className="text-muted-foreground truncate pr-2">{row.path}</span>
                  <span className="font-semibold text-foreground">{row.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-sm font-medium text-foreground mb-3">
            {language === 'sr' ? 'Izvori poseta' : 'Top referrers'}
          </div>
          {topReferrers.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              {language === 'sr' ? 'Nema podataka' : 'No data'}
            </div>
          ) : (
            <div className="space-y-2 text-sm">
              {topReferrers.map((row) => (
                <div key={row.referrer} className="flex items-center justify-between">
                  <span className="text-muted-foreground truncate pr-2">{row.referrer}</span>
                  <span className="font-semibold text-foreground">{row.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-sm font-medium text-foreground mb-3">
            {language === 'sr' ? 'Države posetilaca' : 'Top countries'}
          </div>
          {topCountries.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              {language === 'sr' ? 'Nema podataka' : 'No data'}
            </div>
          ) : (
            <div className="space-y-2 text-sm">
              {topCountries.map((row) => (
                <div key={row.country} className="flex items-center justify-between">
                  <span className="text-muted-foreground truncate pr-2">{row.country}</span>
                  <span className="font-semibold text-foreground">{row.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-sm font-medium text-foreground mb-3">
            {language === 'sr' ? 'Proizvodi' : 'Products'}
          </div>
          {topProducts.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              {language === 'sr' ? 'Nema podataka' : 'No data'}
            </div>
          ) : (
            <div className="space-y-2 text-sm">
              {topProducts.map((row) => (
                <div key={row.product_id} className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground truncate">{row.product_id}</span>
                  <span className="font-semibold text-foreground">
                    {row.order_created} / {formatPrice(row.revenue_cents)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
