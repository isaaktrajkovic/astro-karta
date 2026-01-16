import { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Mail, MapPin, Calendar, Clock, Package, User, Download, Filter, StickyNote, Sparkles, Trash2, Send, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { CalculatorUsageDialog } from '@/components/CalculatorUsageDialog';
import HoroscopeAdminDialog from '@/components/HoroscopeAdminDialog';
import {
  getOrders,
  getUsage,
  Order as ApiOrder,
  updateOrderStatus as apiUpdateOrderStatus,
  deleteOrders,
  sendOrderReport,
  getReferrals,
  createReferral,
  updateReferral,
  getReferralOrders,
  updateOrderReferralPaid,
  Referral as ApiReferral,
  ReferralOrder as ApiReferralOrder,
} from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

type Order = ApiOrder;
type Referral = ApiReferral;
type ReferralOrder = ApiReferralOrder;

type StatusFilter = 'all' | 'pending' | 'processing' | 'completed' | 'cancelled';
type TimeFilter = 'all' | 'today' | 'week' | 'month' | 'year';
type GenderFilter = 'all' | 'male' | 'female' | 'unspecified';
type ZodiacSign = 'all' | 'aries' | 'taurus' | 'gemini' | 'cancer' | 'leo' | 'virgo' | 
                  'libra' | 'scorpio' | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';

const zodiacSigns = [
  { key: 'aries', symbol: '♈', sr: 'Ovan', en: 'Aries' },
  { key: 'taurus', symbol: '♉', sr: 'Bik', en: 'Taurus' },
  { key: 'gemini', symbol: '♊', sr: 'Blizanci', en: 'Gemini' },
  { key: 'cancer', symbol: '♋', sr: 'Rak', en: 'Cancer' },
  { key: 'leo', symbol: '♌', sr: 'Lav', en: 'Leo' },
  { key: 'virgo', symbol: '♍', sr: 'Devica', en: 'Virgo' },
  { key: 'libra', symbol: '♎', sr: 'Vaga', en: 'Libra' },
  { key: 'scorpio', symbol: '♏', sr: 'Škorpija', en: 'Scorpio' },
  { key: 'sagittarius', symbol: '♐', sr: 'Strelac', en: 'Sagittarius' },
  { key: 'capricorn', symbol: '♑', sr: 'Jarac', en: 'Capricorn' },
  { key: 'aquarius', symbol: '♒', sr: 'Vodolija', en: 'Aquarius' },
  { key: 'pisces', symbol: '♓', sr: 'Ribe', en: 'Pisces' },
];

const getZodiacSign = (birthDate: string): ZodiacSign => {
  const date = new Date(birthDate);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'aquarius';
  return 'pisces';
};

const getZodiacInfo = (sign: ZodiacSign) => zodiacSigns.find(z => z.key === sign);

const Dashboard = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [calculatorUsageCount, setCalculatorUsageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [productFilter, setProductFilter] = useState<string>('all');
  const [zodiacFilter, setZodiacFilter] = useState<ZodiacSign>('all');
  const [genderFilter, setGenderFilter] = useState<GenderFilter>('all');
  const [selectedOrders, setSelectedOrders] = useState<Set<number>>(new Set());
  const [usageDialogOpen, setUsageDialogOpen] = useState(false);
  const [horoscopeDialogOpen, setHoroscopeDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportOrder, setReportOrder] = useState<Order | null>(null);
  const [reportSubject, setReportSubject] = useState('');
  const [reportMessage, setReportMessage] = useState('');
  const [reportIsSending, setReportIsSending] = useState(false);
  const [ordersCollapsed, setOrdersCollapsed] = useState(false);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [referralsLoading, setReferralsLoading] = useState(false);
  const [referralOrders, setReferralOrders] = useState<ReferralOrder[]>([]);
  const [referralOrdersLoading, setReferralOrdersLoading] = useState(false);
  const [referralOrdersDialogOpen, setReferralOrdersDialogOpen] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);
  const [referralPaidEdits, setReferralPaidEdits] = useState<Record<number, string>>({});
  const [referralForm, setReferralForm] = useState({
    code: '',
    ownerFirstName: '',
    ownerLastName: '',
    discountPercent: '',
    commissionPercent: '',
    isActive: true,
  });
  const [referralEditingId, setReferralEditingId] = useState<number | null>(null);
  const [referralSaving, setReferralSaving] = useState(false);
  const referralFormRef = useRef<HTMLDivElement | null>(null);
  const referralCodeInputRef = useRef<HTMLInputElement | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const { orders } = await getOrders();
      setOrders(orders || []);
      setSelectedOrders(new Set());
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: language === 'sr' ? 'Greška' : 'Error',
        description: language === 'sr' ? 'Nije moguće učitati narudžbine' : 'Could not load orders',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCalculatorUsage = async () => {
    try {
      const { usage } = await getUsage();
      setCalculatorUsageCount(usage?.length || 0);
    } catch (error) {
      console.error('Error fetching calculator usage:', error);
    }
  };

  const fetchReferrals = async () => {
    setReferralsLoading(true);
    try {
      const { referrals } = await getReferrals();
      setReferrals(referrals || []);
    } catch (error) {
      console.error('Error fetching referrals:', error);
      toast({
        title: language === 'sr' ? 'Greška' : 'Error',
        description: language === 'sr'
          ? 'Nije moguće učitati referale'
          : 'Could not load referrals',
        variant: 'destructive',
      });
    } finally {
      setReferralsLoading(false);
    }
  };

  const resetReferralForm = () => {
    setReferralForm({
      code: '',
      ownerFirstName: '',
      ownerLastName: '',
      discountPercent: '',
      commissionPercent: '',
      isActive: true,
    });
    setReferralEditingId(null);
  };

  const handleEditReferral = (referral: Referral) => {
    setReferralForm({
      code: referral.code,
      ownerFirstName: referral.owner_first_name,
      ownerLastName: referral.owner_last_name,
      discountPercent: String(referral.discount_percent),
      commissionPercent: String(referral.commission_percent),
      isActive: referral.is_active,
    });
    setReferralEditingId(referral.id);
    setTimeout(() => {
      referralFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      referralCodeInputRef.current?.focus();
    }, 0);
    toast({
      title: language === 'sr' ? 'Izmena' : 'Edit',
      description: language === 'sr'
        ? 'Podaci su učitani za izmenu.'
        : 'Referral loaded for editing.',
    });
  };

  const handleSaveReferral = async () => {
    const code = referralForm.code.trim().toUpperCase();
    const ownerFirstName = referralForm.ownerFirstName.trim();
    const ownerLastName = referralForm.ownerLastName.trim();
    const discountPercent = Number(referralForm.discountPercent);
    const commissionPercent = Number(referralForm.commissionPercent);

    if (!code || !ownerFirstName || !ownerLastName) {
      toast({
        title: language === 'sr' ? 'Greška' : 'Error',
        description: language === 'sr'
          ? 'Popunite sva obavezna polja.'
          : 'Please fill out all required fields.',
        variant: 'destructive',
      });
      return;
    }

    if (
      !Number.isFinite(discountPercent) ||
      discountPercent < 0 ||
      discountPercent > 100 ||
      !Number.isFinite(commissionPercent) ||
      commissionPercent < 0 ||
      commissionPercent > 100
    ) {
      toast({
        title: language === 'sr' ? 'Greška' : 'Error',
        description: language === 'sr'
          ? 'Procenat popusta i provizije mora biti između 0 i 100.'
          : 'Discount and commission must be between 0 and 100.',
        variant: 'destructive',
      });
      return;
    }

    setReferralSaving(true);
    try {
      const payload = {
        code,
        owner_first_name: ownerFirstName,
        owner_last_name: ownerLastName,
        discount_percent: discountPercent,
        commission_percent: commissionPercent,
        is_active: referralForm.isActive,
      };
      if (referralEditingId) {
        await updateReferral(referralEditingId, payload);
        toast({
          title: language === 'sr' ? 'Ažurirano' : 'Updated',
          description: language === 'sr'
            ? 'Referal je ažuriran.'
            : 'Referral updated.',
        });
      } else {
        await createReferral(payload);
        toast({
          title: language === 'sr' ? 'Kreirano' : 'Created',
          description: language === 'sr'
            ? 'Referal je dodat.'
            : 'Referral added.',
        });
      }
      resetReferralForm();
      fetchReferrals();
    } catch (error) {
      console.error('Error saving referral:', error);
      toast({
        title: language === 'sr' ? 'Greška' : 'Error',
        description: error instanceof Error
          ? error.message
          : (language === 'sr' ? 'Čuvanje nije uspelo.' : 'Failed to save referral.'),
        variant: 'destructive',
      });
    } finally {
      setReferralSaving(false);
    }
  };

  const handleOpenReferralOrders = async (referral: Referral) => {
    setSelectedReferral(referral);
    setReferralOrders([]);
    setReferralPaidEdits({});
    setReferralOrdersDialogOpen(true);
    setReferralOrdersLoading(true);
    try {
      const { orders } = await getReferralOrders(referral.id);
      const nextOrders = orders || [];
      setReferralOrders(nextOrders);
      const edits: Record<number, string> = {};
      nextOrders.forEach((order) => {
        const paidCents = Number(order.referral_paid_cents || 0);
        const value = paidCents / 100;
        const hasDecimals = paidCents % 100 !== 0;
        edits[order.id] = value.toFixed(hasDecimals ? 2 : 0);
      });
      setReferralPaidEdits(edits);
    } catch (error) {
      console.error('Error fetching referral orders:', error);
      toast({
        title: language === 'sr' ? 'Greška' : 'Error',
        description: language === 'sr'
          ? 'Nije moguće učitati porudžbine.'
          : 'Could not load orders.',
        variant: 'destructive',
      });
    } finally {
      setReferralOrdersLoading(false);
    }
  };

  const handleReferralOrdersDialogChange = (open: boolean) => {
    setReferralOrdersDialogOpen(open);
    if (!open) {
      setSelectedReferral(null);
      setReferralOrders([]);
      setReferralOrdersLoading(false);
      setReferralPaidEdits({});
    }
  };

  const parseAmountToCents = (value: string) => {
    const normalized = value.replace(',', '.').trim();
    if (!normalized) return null;
    const numeric = Number(normalized);
    if (!Number.isFinite(numeric)) return null;
    return Math.max(0, Math.round(numeric * 100));
  };

  const getReferralReportData = () => {
    if (!selectedReferral) {
      return null;
    }

    const summaryMap = new Map<string, {
      product_name: string;
      order_count: number;
      total_revenue_cents: number;
      total_commission_cents: number;
      paid_cents: number;
    }>();

    referralOrders.forEach((order) => {
      const existing = summaryMap.get(order.product_name) || {
        product_name: order.product_name,
        order_count: 0,
        total_revenue_cents: 0,
        total_commission_cents: 0,
        paid_cents: 0,
      };
      existing.order_count += 1;
      existing.total_revenue_cents += order.final_price_cents || 0;
      existing.total_commission_cents += order.referral_commission_cents || 0;
      existing.paid_cents += order.referral_paid_cents || 0;
      summaryMap.set(order.product_name, existing);
    });

    const summaryHeaders = [
      language === 'sr' ? 'Usluga' : 'Service',
      language === 'sr' ? 'Broj porudžbina' : 'Orders',
      language === 'sr' ? 'Ukupni promet (EUR)' : 'Total revenue (EUR)',
      language === 'sr' ? 'Ukupna provizija (EUR)' : 'Total commission (EUR)',
      language === 'sr' ? 'Isplaćeno (EUR)' : 'Paid (EUR)',
      language === 'sr' ? 'Preostalo (EUR)' : 'Remaining (EUR)',
    ];

    const summaryRows = Array.from(summaryMap.values()).map((row) => ([
      row.product_name,
      row.order_count,
      row.total_revenue_cents / 100,
      row.total_commission_cents / 100,
      row.paid_cents / 100,
      Math.max(row.total_commission_cents - row.paid_cents, 0) / 100,
    ]));

    const orderHeaders = [
      language === 'sr' ? 'Kupac' : 'Customer',
      language === 'sr' ? 'Proizvod' : 'Product',
      language === 'sr' ? 'Ukupno (EUR)' : 'Total (EUR)',
      language === 'sr' ? 'Provizija (EUR)' : 'Commission (EUR)',
      language === 'sr' ? 'Isplaćeno (EUR)' : 'Paid (EUR)',
      language === 'sr' ? 'Preostalo (EUR)' : 'Remaining (EUR)',
      language === 'sr' ? 'Status' : 'Status',
      language === 'sr' ? 'Datum' : 'Date',
    ];

    const orderRows = referralOrders.map((order) => ([
      order.customer_name,
      order.product_name,
      (order.final_price_cents || 0) / 100,
      (order.referral_commission_cents || 0) / 100,
      (order.referral_paid_cents || 0) / 100,
      Math.max((order.referral_commission_cents || 0) - (order.referral_paid_cents || 0), 0) / 100,
      getStatusLabel(order.status),
      new Date(order.created_at).toLocaleDateString(language === 'sr' ? 'sr-RS' : 'en-US'),
    ]));

    return {
      summaryHeaders,
      summaryRows,
      orderHeaders,
      orderRows,
      filename: `referral_${selectedReferral.code}_${new Date().toISOString().split('T')[0]}`,
      referralLabel: `${selectedReferral.code} • ${selectedReferral.owner_first_name} ${selectedReferral.owner_last_name}`,
    };
  };

  const exportReferralExcel = async () => {
    if (!selectedReferral) return;
    if (!referralOrders.length) {
      toast({
        title: language === 'sr' ? 'Upozorenje' : 'Warning',
        description: language === 'sr'
          ? 'Nema porudžbina za izvoz.'
          : 'No orders to export.',
        variant: 'destructive',
      });
      return;
    }

    const report = getReferralReportData();
    if (!report) return;

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Astro whisper';
    workbook.created = new Date();

    const applyHeaderStyle = (sheet: ExcelJS.Worksheet) => {
      const headerRow = sheet.getRow(1);
      headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1F2937' },
      };
      headerRow.alignment = { vertical: 'middle', horizontal: 'left' };
      headerRow.height = 22;
    };

    const summarySheet = workbook.addWorksheet('Summary');
    summarySheet.columns = report.summaryHeaders.map((header, index) => ({
      header,
      key: `s${index}`,
      width: index === 0 ? 32 : 18,
    }));
    report.summaryRows.forEach((row) => {
      summarySheet.addRow(row);
    });
    applyHeaderStyle(summarySheet);

    const ordersSheet = workbook.addWorksheet('Orders');
    ordersSheet.columns = report.orderHeaders.map((header, index) => ({
      header,
      key: `o${index}`,
      width: index === 0 ? 28 : (index === 1 ? 24 : 18),
    }));
    report.orderRows.forEach((row) => {
      ordersSheet.addRow(row);
    });
    applyHeaderStyle(ordersSheet);

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${report.filename}.xlsx`;
    anchor.click();
    URL.revokeObjectURL(url);

    toast({
      title: language === 'sr' ? 'Uspešno' : 'Success',
      description: language === 'sr'
        ? 'Excel izveštaj je preuzet.'
        : 'Excel report downloaded.',
    });
  };

  const openReferralPrint = () => {
    if (!selectedReferral) return;
    const url = `/dashboard/referrals/${selectedReferral.id}/print`;
    navigate(url);
  };

  const handleSaveReferralPaid = async (order: ReferralOrder) => {
    const inputValue = referralPaidEdits[order.id] ?? '';
    const paidCents = parseAmountToCents(inputValue);
    if (paidCents === null) {
      toast({
        title: language === 'sr' ? 'Greška' : 'Error',
        description: language === 'sr'
          ? 'Unesite validan iznos.'
          : 'Enter a valid amount.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await updateOrderReferralPaid(order.id, { paid_cents: paidCents });
      const nextPaidCents = response.paid_cents ?? paidCents;
      const isPaid = response.is_paid ?? (nextPaidCents >= order.referral_commission_cents);
      setReferralOrders((prev) =>
        prev.map((item) =>
          item.id === order.id
            ? {
                ...item,
                referral_paid_cents: nextPaidCents,
                referral_paid: isPaid,
                referral_paid_at: isPaid ? new Date().toISOString() : null,
              }
            : item
        )
      );
      setReferralPaidEdits((prev) => ({
        ...prev,
        [order.id]: (nextPaidCents / 100).toFixed(nextPaidCents % 100 === 0 ? 0 : 2),
      }));
      fetchReferrals();
      toast({
        title: language === 'sr' ? 'Sačuvano' : 'Saved',
        description: language === 'sr'
          ? 'Isplata je ažurirana.'
          : 'Payout updated.',
      });
    } catch (error) {
      console.error('Error updating referral payment:', error);
      toast({
        title: language === 'sr' ? 'Greška' : 'Error',
        description: language === 'sr'
          ? 'Nije moguće ažurirati isplatu.'
          : 'Could not update payout.',
        variant: 'destructive',
      });
    }
  };

  const handleMarkReferralPaid = async (order: ReferralOrder) => {
    try {
      await updateOrderReferralPaid(order.id, { paid: true });
      setReferralOrders((prev) =>
        prev.map((item) =>
          item.id === order.id
            ? {
                ...item,
                referral_paid: true,
                referral_paid_at: new Date().toISOString(),
                referral_paid_cents: item.referral_commission_cents,
              }
            : item
        )
      );
      setReferralPaidEdits((prev) => ({
        ...prev,
        [order.id]: (order.referral_commission_cents / 100).toFixed(
          order.referral_commission_cents % 100 === 0 ? 0 : 2
        ),
      }));
      fetchReferrals();
      toast({
        title: language === 'sr' ? 'Isplaćeno' : 'Paid',
        description: language === 'sr'
          ? 'Porudžbina je označena kao isplaćena.'
          : 'Order marked as paid.',
      });
    } catch (error) {
      console.error('Error updating referral payment:', error);
      toast({
        title: language === 'sr' ? 'Greška' : 'Error',
        description: language === 'sr'
          ? 'Nije moguće ažurirati isplatu.'
          : 'Could not update payout.',
        variant: 'destructive',
      });
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      await apiUpdateOrderStatus(orderId, newStatus);

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      fetchReferrals();

      toast({
        title: language === 'sr' ? 'Uspešno' : 'Success',
        description: language === 'sr' ? 'Status je ažuriran' : 'Status updated',
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: language === 'sr' ? 'Greška' : 'Error',
        description: language === 'sr' ? 'Nije moguće ažurirati status' : 'Could not update status',
        variant: 'destructive',
      });
    }
  };

  const getDefaultReportSubject = (orderLanguage: string | null, productName: string) => {
    switch (orderLanguage) {
      case 'en':
        return `Your report is ready - ${productName}`;
      case 'fr':
        return `Votre rapport est prêt - ${productName}`;
      case 'de':
        return `Ihr Bericht ist bereit - ${productName}`;
      case 'es':
        return `Tu informe está listo - ${productName}`;
      case 'ru':
        return `Ваш отчет готов - ${productName}`;
      case 'sr':
      default:
        return `Vaš izveštaj je spreman - ${productName}`;
    }
  };

  const handleOpenReportDialog = (order: Order) => {
    setReportOrder(order);
    setReportSubject(getDefaultReportSubject(order.language || 'sr', order.product_name));
    setReportMessage('');
    setReportDialogOpen(true);
  };

  const handleReportDialogChange = (open: boolean) => {
    setReportDialogOpen(open);
    if (!open) {
      setReportOrder(null);
      setReportSubject('');
      setReportMessage('');
      setReportIsSending(false);
    }
  };

  const handleSendReport = async () => {
    if (!reportOrder) return;
    const trimmedMessage = reportMessage.trim();
    if (!trimmedMessage) {
      toast({
        title: language === 'sr' ? 'Greška' : 'Error',
        description: language === 'sr' ? 'Unesite tekst izveštaja.' : 'Please enter the report text.',
        variant: 'destructive',
      });
      return;
    }

    setReportIsSending(true);
    try {
      const response = await sendOrderReport(reportOrder.id, {
        subject: reportSubject.trim() || undefined,
        message: trimmedMessage,
        language: reportOrder.language || language,
      });

      toast({
        title: language === 'sr' ? 'Uspešno' : 'Success',
        description: language === 'sr' ? 'Email je poslat.' : 'Email has been sent.',
      });

      if (response.statusUpdated !== false) {
        setOrders((prev) =>
          prev.map((order) =>
            order.id === reportOrder.id ? { ...order, status: 'completed' } : order
          )
        );
        fetchReferrals();
      } else {
        toast({
          title: language === 'sr' ? 'Upozorenje' : 'Warning',
          description: language === 'sr'
            ? 'Email je poslat, ali status nije automatski ažuriran.'
            : 'Email was sent, but the status was not updated automatically.',
          variant: 'destructive',
        });
      }

      handleReportDialogChange(false);
    } catch (error) {
      console.error('Error sending report:', error);
      toast({
        title: language === 'sr' ? 'Greška' : 'Error',
        description: error instanceof Error
          ? error.message
          : (language === 'sr' ? 'Slanje nije uspelo.' : 'Failed to send report.'),
        variant: 'destructive',
      });
    } finally {
      setReportIsSending(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchCalculatorUsage();
    fetchReferrals();
  }, []);

  useEffect(() => {
    if (!referralOrdersDialogOpen || referralOrders.length === 0 || orders.length === 0) {
      return;
    }

    const statusMap = new Map(orders.map((order) => [order.id, order.status]));
    setReferralOrders((prev) => {
      let changed = false;
      const next = prev.map((order) => {
        const nextStatus = statusMap.get(order.id);
        if (nextStatus && nextStatus !== order.status) {
          changed = true;
          return { ...order, status: nextStatus };
        }
        return order;
      });
      return changed ? next : prev;
    });
  }, [orders, referralOrdersDialogOpen, referralOrders.length]);

  // Get unique products for filter
  const uniqueProducts = useMemo(() => {
    const products = new Set(orders.map(o => o.product_name));
    return Array.from(products);
  }, [orders]);

  // Filter orders based on all criteria
  const filteredOrders = useMemo(() => {
    let result = orders;

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((o) => o.status === statusFilter);
    }

    // Product filter
    if (productFilter !== 'all') {
      result = result.filter((o) => o.product_name === productFilter);
    }

    // Zodiac filter
    if (zodiacFilter !== 'all') {
      result = result.filter((o) => getZodiacSign(o.birth_date) === zodiacFilter);
    }

    // Gender filter
    if (genderFilter !== 'all') {
      result = result.filter((o) => (o.gender || 'unspecified') === genderFilter);
    }

    // Time filter
    if (timeFilter !== 'all') {
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      result = result.filter((o) => {
        const orderDate = new Date(o.created_at);
        switch (timeFilter) {
          case 'today':
            return orderDate >= startOfToday;
          case 'week': {
            const weekAgo = new Date(startOfToday);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return orderDate >= weekAgo;
          }
          case 'month': {
            const monthAgo = new Date(startOfToday);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return orderDate >= monthAgo;
          }
          case 'year': {
            const yearAgo = new Date(startOfToday);
            yearAgo.setFullYear(yearAgo.getFullYear() - 1);
            return orderDate >= yearAgo;
          }
          default:
            return true;
        }
      });
    }

    return result;
  }, [orders, statusFilter, productFilter, timeFilter, zodiacFilter, genderFilter]);

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedOrders.size === filteredOrders.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(filteredOrders.map(o => o.id)));
    }
  };

  const toggleSelectOrder = (orderId: number) => {
    const newSelected = new Set(selectedOrders);
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId);
    } else {
      newSelected.add(orderId);
    }
    setSelectedOrders(newSelected);
  };

  // Export to Excel
  const exportToExcel = () => {
    const ordersToExport = filteredOrders.filter(o => selectedOrders.has(o.id));
    
    if (ordersToExport.length === 0) {
      toast({
        title: language === 'sr' ? 'Upozorenje' : 'Warning',
        description: language === 'sr' ? 'Izaberite narudžbine za izvoz' : 'Select orders to export',
        variant: 'destructive',
      });
      return;
    }

    const exportData = ordersToExport.map(order => ({
      [language === 'sr' ? 'Ime kupca' : 'Customer Name']: order.customer_name,
      'Email': order.email,
      [language === 'sr' ? 'Pol' : 'Gender']: getGenderLabel(order.gender),
      [language === 'sr' ? 'Proizvod' : 'Product']: order.product_name,
      [language === 'sr' ? 'Datum rođenja' : 'Birth Date']: order.birth_date,
      [language === 'sr' ? 'Vreme rođenja' : 'Birth Time']: order.birth_time || '-',
      [language === 'sr' ? 'Mesto rođenja' : 'Birth Place']: order.birth_place,
      'Status': getStatusLabel(order.status),
      [language === 'sr' ? 'Datum narudžbine' : 'Order Date']: new Date(order.created_at).toLocaleString(),
      [language === 'sr' ? 'Napomena' : 'Note']: order.note || '-',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
    XLSX.writeFile(workbook, `orders_${new Date().toISOString().split('T')[0]}.xlsx`);

    toast({
      title: language === 'sr' ? 'Uspešno' : 'Success',
      description: language === 'sr' ? `Izvezeno ${ordersToExport.length} narudžbina` : `Exported ${ordersToExport.length} orders`,
    });
  };

  const deleteSelectedOrders = async () => {
    const selectedIds = Array.from(selectedOrders);
    if (selectedIds.length === 0) return;

    const confirmed = window.confirm(
      language === 'sr'
        ? `Obrisati ${selectedIds.length} izabranih narudžbina? Ovo se ne može vratiti.`
        : `Delete ${selectedIds.length} selected orders? This cannot be undone.`
    );
    if (!confirmed) return;

    try {
      const { deleted } = await deleteOrders(selectedIds);
      const selectedIdSet = new Set(selectedIds);
      setOrders((prev) => prev.filter((order) => !selectedIdSet.has(order.id)));
      setSelectedOrders(new Set());
      toast({
        title: language === 'sr' ? 'Uspešno' : 'Success',
        description: language === 'sr'
          ? `Obrisano ${deleted} narudžbina`
          : `Deleted ${deleted} orders`,
      });
    } catch (error) {
      console.error('Error deleting orders:', error);
      toast({
        title: language === 'sr' ? 'Greška' : 'Error',
        description: language === 'sr'
          ? 'Nije moguće obrisati narudžbine'
          : 'Could not delete orders',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadgeStyles = (status: string) => {
    const statusStyles: Record<string, string> = {
      pending: 'bg-yellow-500/20 text-yellow-400',
      processing: 'bg-green-500/20 text-green-400',
      completed: 'bg-red-500/20 text-red-400',
      cancelled: 'bg-muted text-muted-foreground',
    };
    return statusStyles[status] || statusStyles.pending;
  };

  const getReferralOrderStatus = (referral: Referral) => {
    if (referral.order_count === 0) {
      return { key: 'none', label: language === 'sr' ? 'Nema' : 'None' };
    }
    if (referral.pending_count > 0) {
      return { key: 'pending', label: getStatusLabel('pending') };
    }
    if (referral.processing_count > 0) {
      return { key: 'processing', label: getStatusLabel('processing') };
    }
    if (referral.completed_count === referral.order_count) {
      return { key: 'completed', label: getStatusLabel('completed') };
    }
    if (referral.cancelled_count === referral.order_count) {
      return { key: 'cancelled', label: getStatusLabel('cancelled') };
    }
    return { key: 'mixed', label: language === 'sr' ? 'Mešano' : 'Mixed' };
  };

  const getStatusLabel = (status: string) => {
    const statusLabels: Record<string, { sr: string; en: string }> = {
      pending: { sr: 'Na čekanju', en: 'Pending' },
      processing: { sr: 'U obradi', en: 'Processing' },
      completed: { sr: 'Završeno', en: 'Completed' },
      cancelled: { sr: 'Otkazano', en: 'Cancelled' },
    };
    return statusLabels[status]?.[language] || status;
  };

  const getGenderLabel = (gender?: string | null) => {
    if (gender === 'male') return language === 'sr' ? 'Muški' : 'Male';
    if (gender === 'female') return language === 'sr' ? 'Ženski' : 'Female';
    return language === 'sr' ? 'Nije navedeno' : 'Unspecified';
  };

  const StatCard = ({ 
    count, 
    label, 
    colorClass, 
    filterValue 
  }: { 
    count: number; 
    label: string; 
    colorClass: string; 
    filterValue: StatusFilter;
  }) => (
    <button
      onClick={() => setStatusFilter(filterValue)}
      className={`bg-card p-6 rounded-xl border transition-all text-left w-full ${
        statusFilter === filterValue 
          ? 'border-primary ring-2 ring-primary/20' 
          : 'border-border hover:border-primary/50'
      }`}
    >
      <div className={`text-3xl font-bold mb-2 ${colorClass}`}>{count}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </button>
  );

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon">
              <Link to="/">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-foreground">
              {language === 'sr' ? 'Admin Dashboard' : 'Admin Dashboard'}
            </h1>
          </div>
          <Button onClick={fetchOrders} variant="outline" size="sm" disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {language === 'sr' ? 'Osveži' : 'Refresh'}
          </Button>
        </div>

        {/* Filters Section */}
        <div className="bg-card p-4 rounded-xl border border-border mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              {language === 'sr' ? 'Filteri' : 'Filters'}
            </span>
          </div>
          <div className="flex flex-wrap gap-4">
            {/* Time Filter */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">
                {language === 'sr' ? 'Vreme' : 'Time'}
              </label>
              <Select value={timeFilter} onValueChange={(v) => setTimeFilter(v as TimeFilter)}>
                <SelectTrigger className="w-[150px] bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === 'sr' ? 'Sve' : 'All'}</SelectItem>
                  <SelectItem value="today">{language === 'sr' ? 'Danas' : 'Today'}</SelectItem>
                  <SelectItem value="week">{language === 'sr' ? 'Ova nedelja' : 'This Week'}</SelectItem>
                  <SelectItem value="month">{language === 'sr' ? 'Ovaj mesec' : 'This Month'}</SelectItem>
                  <SelectItem value="year">{language === 'sr' ? 'Ova godina' : 'This Year'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Product Filter */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">
                {language === 'sr' ? 'Proizvod' : 'Product'}
              </label>
              <Select value={productFilter} onValueChange={setProductFilter}>
                <SelectTrigger className="w-[200px] bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === 'sr' ? 'Svi proizvodi' : 'All Products'}</SelectItem>
                  {uniqueProducts.map((product) => (
                    <SelectItem key={product} value={product}>{product}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">
                Status
              </label>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
                <SelectTrigger className="w-[150px] bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === 'sr' ? 'Svi statusi' : 'All Statuses'}</SelectItem>
                  <SelectItem value="pending">{language === 'sr' ? 'Na čekanju' : 'Pending'}</SelectItem>
                  <SelectItem value="processing">{language === 'sr' ? 'U obradi' : 'Processing'}</SelectItem>
                  <SelectItem value="completed">{language === 'sr' ? 'Završeno' : 'Completed'}</SelectItem>
                  <SelectItem value="cancelled">{language === 'sr' ? 'Otkazano' : 'Cancelled'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Gender Filter */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">
                {language === 'sr' ? 'Pol' : 'Gender'}
              </label>
              <Select value={genderFilter} onValueChange={(v) => setGenderFilter(v as GenderFilter)}>
                <SelectTrigger className="w-[150px] bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === 'sr' ? 'Svi' : 'All'}</SelectItem>
                  <SelectItem value="female">{language === 'sr' ? 'Ženski' : 'Female'}</SelectItem>
                  <SelectItem value="male">{language === 'sr' ? 'Muški' : 'Male'}</SelectItem>
                  <SelectItem value="unspecified">{language === 'sr' ? 'Nije navedeno' : 'Unspecified'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Zodiac Filter */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">
                {language === 'sr' ? 'Horoskopski znak' : 'Zodiac Sign'}
              </label>
              <Select value={zodiacFilter} onValueChange={(v) => setZodiacFilter(v as ZodiacSign)}>
                <SelectTrigger className="w-[180px] bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === 'sr' ? 'Svi znakovi' : 'All Signs'}</SelectItem>
                  {zodiacSigns.map((sign) => (
                    <SelectItem key={sign.key} value={sign.key}>
                      <span className="flex items-center gap-2">
                        <span>{sign.symbol}</span>
                        {language === 'sr' ? sign.sr : sign.en}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Export Button */}
            <div className="flex flex-col gap-1 ml-auto">
              <label className="text-xs text-muted-foreground invisible">Actions</label>
              <div className="flex flex-wrap gap-2">
                <Button 
                  onClick={exportToExcel} 
                  variant="outline" 
                  size="sm"
                  disabled={selectedOrders.size === 0}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {language === 'sr' ? 'Izvezi Excel' : 'Export Excel'}
                  {selectedOrders.size > 0 && ` (${selectedOrders.size})`}
                </Button>
                <Button
                  onClick={deleteSelectedOrders}
                  variant="destructive"
                  size="sm"
                  disabled={selectedOrders.size === 0}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {language === 'sr' ? 'Obriši' : 'Delete'}
                  {selectedOrders.size > 0 && ` (${selectedOrders.size})`}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats - Clickable */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
          <StatCard
            count={orders.length}
            label={language === 'sr' ? 'Ukupno narudžbina' : 'Total Orders'}
            colorClass="text-gradient"
            filterValue="all"
          />
          <StatCard
            count={orders.filter((o) => o.status === 'pending').length}
            label={language === 'sr' ? 'Na čekanju' : 'Pending'}
            colorClass="text-yellow-400"
            filterValue="pending"
          />
          <StatCard
            count={orders.filter((o) => o.status === 'processing').length}
            label={language === 'sr' ? 'U obradi' : 'Processing'}
            colorClass="text-green-400"
            filterValue="processing"
          />
          <StatCard
            count={orders.filter((o) => o.status === 'completed').length}
            label={language === 'sr' ? 'Završeno' : 'Completed'}
            colorClass="text-red-400"
            filterValue="completed"
          />
          {/* Calculator Usage - Clickable */}
          <button
            onClick={() => setUsageDialogOpen(true)}
            className="bg-card p-6 rounded-xl border border-border hover:border-primary/50 transition-all text-left w-full"
          >
            <div className="text-3xl font-bold mb-2 text-primary">{calculatorUsageCount}</div>
            <div className="text-sm text-muted-foreground">
              {language === 'sr' ? 'Korišćenje kalkulatora' : 'Calculator Usage'}
            </div>
          </button>
          <button
            onClick={() => setHoroscopeDialogOpen(true)}
            className="bg-card p-6 rounded-xl border border-border hover:border-primary/50 transition-all text-left w-full"
          >
            <div className="flex items-center gap-2 text-primary mb-2">
              <Sparkles className="w-6 h-6" />
              <div className="text-2xl font-bold">
                {language === 'sr' ? 'Horoskop' : 'Horoscope'}
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              {language === 'sr' ? 'Dnevna slanja' : 'Daily sends'}
            </div>
          </button>
        </div>

        {/* Orders Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              {statusFilter === 'all' 
                ? (language === 'sr' ? 'Sve narudžbine' : 'All Orders')
                : (language === 'sr' ? `Narudžbine: ${getStatusLabel(statusFilter)}` : `Orders: ${getStatusLabel(statusFilter)}`)}
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({filteredOrders.length})
              </span>
            </h2>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOrdersCollapsed((prev) => !prev)}
              >
                {ordersCollapsed
                  ? (language === 'sr' ? 'Prikaži narudžbine' : 'Show orders')
                  : (language === 'sr' ? 'Skupi narudžbine' : 'Collapse orders')}
              </Button>
              {(statusFilter !== 'all' || timeFilter !== 'all' || productFilter !== 'all' || zodiacFilter !== 'all' || genderFilter !== 'all') && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setStatusFilter('all');
                    setTimeFilter('all');
                    setProductFilter('all');
                    setZodiacFilter('all');
                    setGenderFilter('all');
                  }}
                >
                  {language === 'sr' ? 'Resetuj filtere' : 'Reset filters'}
                </Button>
              )}
            </div>
          </div>

          {ordersCollapsed ? (
            <div className="p-12 text-center text-muted-foreground">
              {language === 'sr' ? 'Narudžbine su skupljene.' : 'Orders are collapsed.'}
            </div>
          ) : isLoading ? (
            <div className="p-12 text-center text-muted-foreground">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
              {language === 'sr' ? 'Učitavanje...' : 'Loading...'}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              {language === 'sr' ? 'Nema narudžbina' : 'No orders yet'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/30">
                  <tr>
                    <th className="p-4 w-12">
                      <Checkbox
                        checked={selectedOrders.size === filteredOrders.length && filteredOrders.length > 0}
                        onCheckedChange={toggleSelectAll}
                      />
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      {language === 'sr' ? 'Kupac' : 'Customer'}
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      {language === 'sr' ? 'Proizvod' : 'Product'}
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      {language === 'sr' ? 'Napomena' : 'Note'}
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      {language === 'sr' ? 'Podaci' : 'Birth Data'}
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      {language === 'sr' ? 'Datum' : 'Date'}
                    </th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                      {language === 'sr' ? 'Akcije' : 'Actions'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-t border-border hover:bg-secondary/10 transition-colors">
                      <td className="p-4">
                        <Checkbox
                          checked={selectedOrders.has(order.id)}
                          onCheckedChange={() => toggleSelectOrder(order.id)}
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <User className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{order.customer_name}</div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Mail className="w-3 h-3" />
                              {order.email}
                            </div>
                            {order.gender && order.gender !== 'unspecified' && (
                              <div className="text-xs text-muted-foreground">
                                {getGenderLabel(order.gender)}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-foreground">{order.product_name}</div>
                        <div className="text-xs text-muted-foreground">{order.product_id}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-start gap-2 text-sm text-muted-foreground max-w-xs">
                          <StickyNote className="w-3.5 h-3.5 mt-0.5 text-muted-foreground/80" />
                          <span>{order.note?.trim() || (language === 'sr' ? 'Nema napomene' : 'No note')}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2 text-foreground">
                            <Calendar className="w-3 h-3 text-muted-foreground" />
                            {new Date(order.birth_date).toLocaleDateString(language === 'sr' ? 'sr-RS' : 'en-US')}
                            <span className="ml-1 text-primary" title={(() => {
                              const zodiac = getZodiacInfo(getZodiacSign(order.birth_date));
                              return zodiac ? (language === 'sr' ? zodiac.sr : zodiac.en) : '';
                            })()}>
                              {getZodiacInfo(getZodiacSign(order.birth_date))?.symbol}
                            </span>
                          </div>
                          {order.birth_time && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {order.birth_time}
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            {order.birth_place}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Select
                          value={order.status}
                          onValueChange={(value) => updateOrderStatus(order.id, value)}
                        >
                          <SelectTrigger className={`w-[140px] h-8 text-xs ${getStatusBadgeStyles(order.status)}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">
                              <span className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-yellow-400" />
                                {language === 'sr' ? 'Na čekanju' : 'Pending'}
                              </span>
                            </SelectItem>
                            <SelectItem value="processing">
                              <span className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-400" />
                                {language === 'sr' ? 'U obradi' : 'Processing'}
                              </span>
                            </SelectItem>
                            <SelectItem value="completed">
                              <span className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-red-400" />
                                {language === 'sr' ? 'Završeno' : 'Completed'}
                              </span>
                            </SelectItem>
                            <SelectItem value="cancelled">
                              <span className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                                {language === 'sr' ? 'Otkazano' : 'Cancelled'}
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString(language === 'sr' ? 'sr-RS' : 'en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenReportDialog(order)}
                          title={language === 'sr' ? 'Pošalji izveštaj' : 'Send report'}
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Referrals Section */}
        <div className="mt-10">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">
              {language === 'sr' ? 'Referal kodovi' : 'Referral codes'}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div ref={referralFormRef} className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                {referralEditingId
                  ? (language === 'sr' ? 'Izmena referala' : 'Edit referral')
                  : (language === 'sr' ? 'Dodaj referal' : 'Add referral')}
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="referral-code">
                    {language === 'sr' ? 'Kod' : 'Code'}
                  </Label>
                  <Input
                    id="referral-code"
                    ref={referralCodeInputRef}
                    value={referralForm.code}
                    onChange={(event) =>
                      setReferralForm((prev) => ({
                        ...prev,
                        code: event.target.value.toUpperCase(),
                      }))
                    }
                    placeholder={language === 'sr' ? 'Npr. ASTRO10' : 'e.g. ASTRO10'}
                    className="bg-secondary/50 border-border focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="referral-owner-first">
                      {language === 'sr' ? 'Ime' : 'First name'}
                    </Label>
                    <Input
                      id="referral-owner-first"
                      value={referralForm.ownerFirstName}
                      onChange={(event) =>
                        setReferralForm((prev) => ({
                          ...prev,
                          ownerFirstName: event.target.value,
                        }))
                      }
                      className="bg-secondary/50 border-border focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="referral-owner-last">
                      {language === 'sr' ? 'Prezime' : 'Last name'}
                    </Label>
                    <Input
                      id="referral-owner-last"
                      value={referralForm.ownerLastName}
                      onChange={(event) =>
                        setReferralForm((prev) => ({
                          ...prev,
                          ownerLastName: event.target.value,
                        }))
                      }
                      className="bg-secondary/50 border-border focus:border-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="referral-discount">
                      {language === 'sr' ? 'Popust (%)' : 'Discount (%)'}
                    </Label>
                    <Input
                      id="referral-discount"
                      type="number"
                      min="0"
                      max="100"
                      value={referralForm.discountPercent}
                      onChange={(event) =>
                        setReferralForm((prev) => ({
                          ...prev,
                          discountPercent: event.target.value,
                        }))
                      }
                      className="bg-secondary/50 border-border focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="referral-commission">
                      {language === 'sr' ? 'Provizija (%)' : 'Commission (%)'}
                    </Label>
                    <Input
                      id="referral-commission"
                      type="number"
                      min="0"
                      max="100"
                      value={referralForm.commissionPercent}
                      onChange={(event) =>
                        setReferralForm((prev) => ({
                          ...prev,
                          commissionPercent: event.target.value,
                        }))
                      }
                      className="bg-secondary/50 border-border focus:border-primary"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-3 py-2">
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      {language === 'sr' ? 'Aktivan' : 'Active'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {language === 'sr'
                        ? 'Kod može da se koristi pri narudžbini'
                        : 'Code can be used during checkout'}
                    </div>
                  </div>
                  <Switch
                    checked={referralForm.isActive}
                    onCheckedChange={(checked) =>
                      setReferralForm((prev) => ({ ...prev, isActive: checked }))
                    }
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    type="button"
                    variant="cosmic"
                    onClick={handleSaveReferral}
                    disabled={referralSaving}
                  >
                    {referralSaving
                      ? (language === 'sr' ? 'Čuvanje...' : 'Saving...')
                      : (referralEditingId
                        ? (language === 'sr' ? 'Sačuvaj izmene' : 'Save changes')
                        : (language === 'sr' ? 'Dodaj referal' : 'Add referral'))}
                  </Button>
                  {referralEditingId && (
                    <Button type="button" variant="outline" onClick={resetReferralForm}>
                      {language === 'sr' ? 'Otkaži' : 'Cancel'}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-card rounded-xl border border-border overflow-hidden">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">
                  {language === 'sr' ? 'Pregled referala' : 'Referral overview'}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fetchReferrals}
                  disabled={referralsLoading}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${referralsLoading ? 'animate-spin' : ''}`} />
                  {language === 'sr' ? 'Osveži' : 'Refresh'}
                </Button>
              </div>

              {referralsLoading ? (
                <div className="p-10 text-center text-muted-foreground">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
                  {language === 'sr' ? 'Učitavanje...' : 'Loading...'}
                </div>
              ) : referrals.length === 0 ? (
                <div className="p-10 text-center text-muted-foreground">
                  {language === 'sr' ? 'Nema referal kodova.' : 'No referral codes yet.'}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-secondary/30">
                      <tr>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                          {language === 'sr' ? 'Kod' : 'Code'}
                        </th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                          {language === 'sr' ? 'Nosilac' : 'Owner'}
                        </th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                          {language === 'sr' ? 'Porudžbine' : 'Orders'}
                        </th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                          {language === 'sr' ? 'Provizija' : 'Commission'}
                        </th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                          {language === 'sr' ? 'Status porudžbina' : 'Order status'}
                        </th>
                        <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                          {language === 'sr' ? 'Akcije' : 'Actions'}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {referrals.map((referral) => (
                        <tr
                          key={referral.id}
                          className="border-t border-border hover:bg-secondary/10 transition-colors"
                        >
                          <td className="p-4">
                            <div className="font-medium text-foreground">{referral.code}</div>
                            <div className="text-xs text-muted-foreground">
                              {language === 'sr' ? 'Popust' : 'Discount'}: {referral.discount_percent}%
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {referral.is_active
                                ? (language === 'sr' ? 'Aktivan' : 'Active')
                                : (language === 'sr' ? 'Neaktivan' : 'Inactive')}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-foreground">
                              {referral.owner_first_name} {referral.owner_last_name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {language === 'sr' ? 'Provizija' : 'Commission'}: {referral.commission_percent}%
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-foreground">{referral.order_count}</div>
                            <div className="text-xs text-muted-foreground">
                              {formatPrice(referral.total_revenue_cents)}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-foreground">
                              {formatPrice(referral.total_commission_cents)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {language === 'sr' ? 'Isplaćeno' : 'Paid'}:{' '}
                              {formatPrice(referral.paid_commission_cents)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {language === 'sr' ? 'Neisplaćeno' : 'Unpaid'}:{' '}
                              {formatPrice(referral.unpaid_commission_cents)}
                            </div>
                          </td>
                          <td className="p-4">
                            {(() => {
                              const status = getReferralOrderStatus(referral);
                              const badgeClass = status.key === 'mixed'
                                ? 'bg-secondary/60 text-muted-foreground'
                                : status.key === 'none'
                                  ? 'bg-muted text-muted-foreground'
                                  : getStatusBadgeStyles(status.key);
                              return (
                                <span
                                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${badgeClass}`}
                                >
                                  {status.label}
                                </span>
                              );
                            })()}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenReferralOrders(referral)}
                              >
                                {language === 'sr' ? 'Porudžbine' : 'Orders'}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditReferral(referral)}
                              >
                                {language === 'sr' ? 'Izmeni' : 'Edit'}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        <CalculatorUsageDialog 
          open={usageDialogOpen} 
          onOpenChange={setUsageDialogOpen} 
        />
        <HoroscopeAdminDialog
          open={horoscopeDialogOpen}
          onOpenChange={setHoroscopeDialogOpen}
        />
        <Dialog open={reportDialogOpen} onOpenChange={handleReportDialogChange}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Send className="w-5 h-5 text-primary" />
                {language === 'sr' ? 'Pošalji izveštaj' : 'Send report'}
              </DialogTitle>
              <DialogDescription>
                {language === 'sr'
                  ? 'Poruka će biti poslata u istom formatu kao dnevni horoskop.'
                  : 'The message will be sent in the same format as the daily horoscope.'}
              </DialogDescription>
            </DialogHeader>

            {reportOrder ? (
              <div className="rounded-lg border border-border bg-card/40 p-4 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">
                    {language === 'sr' ? 'Prima' : 'Recipient'}
                  </span>
                  <span className="text-foreground">{reportOrder.email}</span>
                </div>
                <div className="mt-2 flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">
                    {language === 'sr' ? 'Proizvod' : 'Product'}
                  </span>
                  <span className="text-foreground">{reportOrder.product_name}</span>
                </div>
                <div className="mt-2 flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">
                    {language === 'sr' ? 'Jezik kupca' : 'Customer language'}
                  </span>
                  <span className="text-foreground">{reportOrder.language || 'sr'}</span>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-border bg-card/40 p-4 text-sm text-muted-foreground">
                {language === 'sr' ? 'Porudžbina nije izabrana.' : 'No order selected.'}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="report-subject">{language === 'sr' ? 'Naslov' : 'Subject'}</Label>
                <Input
                  id="report-subject"
                  value={reportSubject}
                  onChange={(event) => setReportSubject(event.target.value)}
                  placeholder={language === 'sr' ? 'Unesite naslov emaila' : 'Enter email subject'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="report-message">{language === 'sr' ? 'Tekst izveštaja' : 'Report text'}</Label>
                <Textarea
                  id="report-message"
                  value={reportMessage}
                  onChange={(event) => setReportMessage(event.target.value)}
                  rows={8}
                  placeholder={language === 'sr'
                    ? 'Napišite izveštaj. Prazan red pravi novi paragraf.'
                    : 'Write the report. Leave a blank line to start a new paragraph.'}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => handleReportDialogChange(false)}>
                {language === 'sr' ? 'Otkaži' : 'Cancel'}
              </Button>
              <Button
                variant="cosmic"
                onClick={handleSendReport}
                disabled={reportIsSending || !reportOrder}
              >
                {reportIsSending ? (language === 'sr' ? 'Slanje...' : 'Sending...') : (language === 'sr' ? 'Pošalji' : 'Send')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={referralOrdersDialogOpen} onOpenChange={handleReferralOrdersDialogChange}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-primary" />
                {language === 'sr' ? 'Porudžbine referala' : 'Referral orders'}
              </DialogTitle>
              <DialogDescription>
                {selectedReferral
                  ? `${selectedReferral.code} • ${selectedReferral.owner_first_name} ${selectedReferral.owner_last_name}`
                  : (language === 'sr' ? 'Nema izabranog referala.' : 'No referral selected.')}
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={exportReferralExcel}
                disabled={!referralOrders.length}
              >
                {language === 'sr' ? 'Preuzmi Excel' : 'Download Excel'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={openReferralPrint}
                disabled={!referralOrders.length}
              >
                {language === 'sr' ? 'Štampa / PDF' : 'Print / PDF'}
              </Button>
            </div>

            {referralOrdersLoading ? (
              <div className="p-8 text-center text-muted-foreground">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
                {language === 'sr' ? 'Učitavanje...' : 'Loading...'}
              </div>
            ) : referralOrders.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                {language === 'sr' ? 'Nema porudžbina za ovaj kod.' : 'No orders for this code.'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary/30">
                    <tr>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                        {language === 'sr' ? 'Kupac' : 'Customer'}
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                        {language === 'sr' ? 'Proizvod' : 'Product'}
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                        {language === 'sr' ? 'Ukupno' : 'Total'}
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                        {language === 'sr' ? 'Provizija' : 'Commission'}
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                        {language === 'sr' ? 'Isplaćeno' : 'Paid'}
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                        {language === 'sr' ? 'Preostalo' : 'Remaining'}
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                        {language === 'sr' ? 'Status' : 'Status'}
                      </th>
                      <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                        {language === 'sr' ? 'Akcije' : 'Actions'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {referralOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-t border-border hover:bg-secondary/10 transition-colors"
                      >
                        <td className="p-4">
                          <div className="text-foreground">{order.customer_name}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString(language === 'sr' ? 'sr-RS' : 'en-US')}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-foreground">{order.product_name}</div>
                        </td>
                        <td className="p-4 text-foreground">
                          {formatPrice(order.final_price_cents)}
                        </td>
                        <td className="p-4 text-foreground">
                          {formatPrice(order.referral_commission_cents)}
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <Input
                              value={referralPaidEdits[order.id] ?? ''}
                              onChange={(event) =>
                                setReferralPaidEdits((prev) => ({
                                  ...prev,
                                  [order.id]: event.target.value,
                                }))
                              }
                              placeholder="0"
                              className="h-8 w-24 bg-secondary/50 border-border focus:border-primary"
                              inputMode="decimal"
                            />
                            {order.referral_paid && order.referral_paid_at ? (
                              <div className="text-xs text-emerald-400">
                                {language === 'sr' ? 'Isplaćeno' : 'Paid'}{' '}
                                {new Date(order.referral_paid_at).toLocaleDateString(
                                  language === 'sr' ? 'sr-RS' : 'en-US'
                                )}
                              </div>
                            ) : (
                              <div className="text-xs text-muted-foreground">
                                {language === 'sr' ? 'Nije isplaćeno' : 'Unpaid'}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {formatPrice(
                            Math.max(
                              (order.referral_commission_cents || 0) - (order.referral_paid_cents || 0),
                              0
                            )
                          )}
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {getStatusLabel(order.status)}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSaveReferralPaid(order)}
                            >
                              {language === 'sr' ? 'Sačuvaj' : 'Save'}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkReferralPaid(order)}
                            >
                              {language === 'sr' ? 'Sve' : 'Full'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Dashboard;
