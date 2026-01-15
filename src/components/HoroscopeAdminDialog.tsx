import { useEffect, useMemo, useState } from 'react';
import { RefreshCw, Mail, Calendar, CheckCircle2, AlertCircle, Clock, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';
import {
  cancelHoroscopeSubscription,
  createTestHoroscopeSubscription,
  getHoroscopeDeliveries,
  getHoroscopeSubscriptions,
  HoroscopeDeliveryLog,
  HoroscopeSubscription,
  updateHoroscopeSendHour,
} from '@/lib/api';

interface HoroscopeAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const HoroscopeAdminDialog = ({ open, onOpenChange }: HoroscopeAdminDialogProps) => {
  const { language, t } = useLanguage();
  const [subscriptions, setSubscriptions] = useState<HoroscopeSubscription[]>([]);
  const [deliveries, setDeliveries] = useState<HoroscopeDeliveryLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showTestForm, setShowTestForm] = useState(false);
  const [isCreatingTest, setIsCreatingTest] = useState(false);
  const [subscriptionStatusFilter, setSubscriptionStatusFilter] = useState('all');
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [sendHourEdits, setSendHourEdits] = useState<Record<string, string>>({});
  const [savingSendHourId, setSavingSendHourId] = useState<string | null>(null);
  const [deliveryStatusFilter, setDeliveryStatusFilter] = useState<'all' | 'sent' | 'failed'>('all');
  const [deliveryDateFilter, setDeliveryDateFilter] = useState<'all' | 'today'>('all');
  const [testForm, setTestForm] = useState({
    email: '',
    zodiacSign: 'aries',
    birthDate: '',
    birthTime: '',
    plan: 'basic',
    gender: 'female',
    sendNow: true,
  });

  const locale = language === 'sr' ? 'sr-RS' : language;
  const timezone = typeof Intl !== 'undefined'
    ? Intl.DateTimeFormat().resolvedOptions().timeZone
    : undefined;
  const zodiacOptions = [
    'aries',
    'taurus',
    'gemini',
    'cancer',
    'leo',
    'virgo',
    'libra',
    'scorpio',
    'sagittarius',
    'capricorn',
    'aquarius',
    'pisces',
  ];

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [subscriptionsResponse, deliveriesResponse] = await Promise.all([
        getHoroscopeSubscriptions(),
        getHoroscopeDeliveries(300),
      ]);

      const nextSubscriptions = subscriptionsResponse.subscriptions || [];
      setSubscriptions(nextSubscriptions);
      setSendHourEdits((prev) => {
        const next = { ...prev };
        for (const subscription of nextSubscriptions) {
          const sendHour = Number.isInteger(subscription.send_hour)
            ? subscription.send_hour
            : 8;
          next[subscription.id] = `${String(sendHour).padStart(2, '0')}:00`;
        }
        return next;
      });
      setDeliveries(deliveriesResponse.deliveries || []);
    } catch (error) {
      console.error('Failed to fetch horoscope admin data:', error);
      toast({
        title: language === 'sr' ? 'Greška' : 'Error',
        description: language === 'sr'
          ? 'Nije moguće učitati horoskop podatke'
          : 'Could not load horoscope data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  const metrics = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const activeCount = subscriptions.filter((s) => s.status === 'active').length;
    const completedCount = subscriptions.filter((s) => s.status === 'completed').length;
    const unsubscribedCount = subscriptions.filter((s) => s.status === 'unsubscribed').length;

    const sentTodayCount = deliveries.filter((d) =>
      d.status === 'sent' && new Date(d.created_at) >= startOfToday
    ).length;

    const failedTodayCount = deliveries.filter((d) =>
      d.status === 'failed' && new Date(d.created_at) >= startOfToday
    ).length;

    return {
      activeCount,
      completedCount,
      unsubscribedCount,
      sentTodayCount,
      failedTodayCount,
    };
  }, [subscriptions, deliveries]);

  const formatDateTime = (value?: string | null) => {
    if (!value) return '-';
    const date = new Date(value);
    return date.toLocaleString(locale);
  };

  const formatDateOnly = (value?: string | null) => {
    if (!value) return '-';
    return new Date(`${value}T00:00:00`).toLocaleDateString(locale);
  };

  const getStatusStyle = (status: string) => {
    if (status === 'active') return 'bg-green-500/20 text-green-400';
    if (status === 'completed') return 'bg-blue-500/20 text-blue-400';
    if (status === 'unsubscribed') return 'bg-muted text-muted-foreground';
    if (status === 'sent') return 'bg-green-500/20 text-green-400';
    if (status === 'failed') return 'bg-red-500/20 text-red-400';
    return 'bg-muted text-muted-foreground';
  };

  const getZodiacLabel = (signKey: string) => t(`zodiac.${signKey}`) || signKey;
  const getPlanLabel = (plan: string) =>
    plan === 'premium'
      ? (language === 'sr' ? 'Premium' : 'Premium')
      : (language === 'sr' ? 'Osnovni' : 'Basic');

  const getSendHourValue = (subscription: HoroscopeSubscription) => {
    const fallback = Number.isInteger(subscription.send_hour)
      ? subscription.send_hour
      : 8;
    return sendHourEdits[subscription.id] || `${String(fallback).padStart(2, '0')}:00`;
  };

  const parseSendHour = (value: string) => {
    const match = String(value || '').trim().match(/^(\d{1,2}):/);
    if (!match) return null;
    const hour = Number(match[1]);
    if (!Number.isInteger(hour) || hour < 0 || hour > 23) return null;
    return hour;
  };

  const handleSaveSendHour = async (subscription: HoroscopeSubscription) => {
    const value = getSendHourValue(subscription);
    const hour = parseSendHour(value);
    if (hour === null) {
      toast({
        title: language === 'sr' ? 'Greška' : 'Error',
        description: language === 'sr'
          ? 'Unesite vreme u formatu HH:00.'
          : 'Enter time in HH:00 format.',
        variant: 'destructive',
      });
      return;
    }

    setSavingSendHourId(subscription.id);
    try {
      const response = await updateHoroscopeSendHour(subscription.id, hour);
      const updated = response.subscription;
      setSubscriptions((prev) =>
        prev.map((item) =>
          item.id === subscription.id
            ? { ...item, send_hour: updated.send_hour, next_send_at: updated.next_send_at }
            : item
        )
      );
      setSendHourEdits((prev) => ({
        ...prev,
        [subscription.id]: `${String(updated.send_hour).padStart(2, '0')}:00`,
      }));
      toast({
        title: language === 'sr' ? 'Uspešno' : 'Success',
        description: language === 'sr'
          ? 'Vreme slanja je ažurirano.'
          : 'Send time updated.',
      });
    } catch (error) {
      console.error('Failed to update send hour:', error);
      toast({
        title: language === 'sr' ? 'Greška' : 'Error',
        description: language === 'sr'
          ? 'Nije moguće ažurirati vreme slanja.'
          : 'Could not update send time.',
        variant: 'destructive',
      });
    } finally {
      setSavingSendHourId(null);
    }
  };

  const filteredSubscriptions = useMemo(() => {
    if (subscriptionStatusFilter === 'all') return subscriptions;
    return subscriptions.filter((subscription) => subscription.status === subscriptionStatusFilter);
  }, [subscriptions, subscriptionStatusFilter]);

  const filteredDeliveries = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let result = deliveries;
    if (deliveryDateFilter === 'today') {
      result = result.filter((delivery) => new Date(delivery.created_at) >= startOfToday);
    }
    if (deliveryStatusFilter !== 'all') {
      result = result.filter((delivery) => delivery.status === deliveryStatusFilter);
    }
    return result;
  }, [deliveries, deliveryDateFilter, deliveryStatusFilter]);

  const toggleSubscriptionFilter = (status: string) => {
    setSubscriptionStatusFilter((prev) => (prev === status ? 'all' : status));
  };

  const toggleDeliveryFilter = (status: 'sent' | 'failed') => {
    const isActive = deliveryStatusFilter === status && deliveryDateFilter === 'today';
    setDeliveryStatusFilter(isActive ? 'all' : status);
    setDeliveryDateFilter(isActive ? 'all' : 'today');
  };

  const getMetricTileClass = (active: boolean) =>
    `p-4 bg-card border border-border rounded-lg cursor-pointer ${active ? 'ring-2 ring-primary/40' : ''}`;

  const handleCancelSubscription = async (subscriptionId: string) => {
    const confirmed = window.confirm(
      language === 'sr'
        ? 'Da li ste sigurni da želite da otkažete pretplatu?'
        : 'Are you sure you want to cancel this subscription?'
    );
    if (!confirmed) return;

    setCancellingId(subscriptionId);
    try {
      await cancelHoroscopeSubscription(subscriptionId);
      setSubscriptions((prev) =>
        prev.map((subscription) =>
          subscription.id === subscriptionId
            ? {
                ...subscription,
                status: 'unsubscribed',
                next_send_at: null,
                unsubscribed_at: new Date().toISOString(),
              }
            : subscription
        )
      );
      toast({
        title: language === 'sr' ? 'Uspešno' : 'Success',
        description: language === 'sr'
          ? 'Pretplata je otkazana.'
          : 'Subscription cancelled.',
      });
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      toast({
        title: language === 'sr' ? 'Greška' : 'Error',
        description: language === 'sr'
          ? 'Nije moguće otkazati pretplatu.'
          : 'Could not cancel subscription.',
        variant: 'destructive',
      });
    } finally {
      setCancellingId(null);
    }
  };

  const handleCreateTestSubscription = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!testForm.email.trim() || !testForm.birthDate) {
      toast({
        title: language === 'sr' ? 'Greška' : 'Error',
        description: language === 'sr'
          ? 'Email i datum rođenja su obavezni.'
          : 'Email and birth date are required.',
        variant: 'destructive',
      });
      return;
    }

    setIsCreatingTest(true);
    try {
      const { sent } = await createTestHoroscopeSubscription({
        email: testForm.email.trim(),
        zodiac_sign: testForm.zodiacSign,
        birth_date: testForm.birthDate,
        birth_time: testForm.birthTime || null,
        plan: testForm.plan as 'basic' | 'premium',
        gender: testForm.gender as 'male' | 'female',
        language,
        timezone,
        send_now: testForm.sendNow,
      });

      toast({
        title: language === 'sr' ? 'Uspešno' : 'Success',
        description: language === 'sr'
          ? sent
            ? 'Test pretplata je kreirana i poslata odmah.'
            : 'Test pretplata je kreirana.'
          : sent
            ? 'Test subscription created and sent.'
            : 'Test subscription created.',
      });

      setTestForm({
        email: '',
        zodiacSign: 'aries',
        birthDate: '',
        birthTime: '',
        plan: 'basic',
        gender: 'female',
        sendNow: true,
      });
      setShowTestForm(false);
      fetchData();
    } catch (error) {
      console.error('Failed to create test subscription:', error);
      toast({
        title: language === 'sr' ? 'Greška' : 'Error',
        description: language === 'sr'
          ? 'Nije moguće napraviti test pretplatu.'
          : 'Could not create test subscription.',
        variant: 'destructive',
      });
    } finally {
      setIsCreatingTest(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between gap-4">
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              {language === 'sr' ? 'Dnevni horoskop' : 'Daily Horoscope'}
            </DialogTitle>
            <Button
              onClick={fetchData}
              variant="outline"
              size="sm"
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {language === 'sr' ? 'Osveži' : 'Refresh'}
            </Button>
          </div>
        </DialogHeader>

        <div className="border border-border rounded-lg p-4 mb-6 bg-card">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="text-sm font-semibold text-foreground">
              {language === 'sr' ? 'Test pretplata' : 'Test subscription'}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTestForm((prev) => !prev)}
            >
              <Plus className="w-4 h-4 mr-2" />
              {showTestForm
                ? (language === 'sr' ? 'Sakrij' : 'Hide')
                : (language === 'sr' ? 'Dodaj' : 'Add')}
            </Button>
          </div>
          {showTestForm && (
            <form onSubmit={handleCreateTestSubscription} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-muted-foreground">
                  {language === 'sr' ? 'Email' : 'Email'}
                </label>
                <Input
                  type="email"
                  value={testForm.email}
                  onChange={(event) => setTestForm((prev) => ({ ...prev, email: event.target.value }))}
                  placeholder="email@example.com"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-muted-foreground">
                  {language === 'sr' ? 'Plan' : 'Plan'}
                </label>
                <Select
                  value={testForm.plan}
                  onValueChange={(value) => setTestForm((prev) => ({ ...prev, plan: value }))}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">{language === 'sr' ? 'Osnovni' : 'Basic'}</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-muted-foreground">
                  {t('form.gender')}
                </label>
                <Select
                  value={testForm.gender}
                  onValueChange={(value) => setTestForm((prev) => ({ ...prev, gender: value }))}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">{t('form.gender.female')}</SelectItem>
                    <SelectItem value="male">{t('form.gender.male')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-muted-foreground">
                  {language === 'sr' ? 'Znak' : 'Sign'}
                </label>
                <Select
                  value={testForm.zodiacSign}
                  onValueChange={(value) => setTestForm((prev) => ({ ...prev, zodiacSign: value }))}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {zodiacOptions.map((signKey) => (
                      <SelectItem key={signKey} value={signKey}>
                        {getZodiacLabel(signKey)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-muted-foreground">
                  {language === 'sr' ? 'Datum rođenja' : 'Birth date'}
                </label>
                <Input
                  type="date"
                  value={testForm.birthDate}
                  onChange={(event) => setTestForm((prev) => ({ ...prev, birthDate: event.target.value }))}
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-muted-foreground">
                  {language === 'sr' ? 'Vreme rođenja' : 'Birth time'}
                </label>
                <Input
                  type="time"
                  value={testForm.birthTime}
                  onChange={(event) => setTestForm((prev) => ({ ...prev, birthTime: event.target.value }))}
                />
              </div>
              <div className="flex items-center gap-2 mt-6">
                <Checkbox
                  checked={testForm.sendNow}
                  onCheckedChange={(checked) =>
                    setTestForm((prev) => ({ ...prev, sendNow: Boolean(checked) }))
                  }
                />
                <span className="text-sm text-muted-foreground">
                  {language === 'sr' ? 'Pošalji odmah' : 'Send now'}
                </span>
              </div>
              <div className="md:col-span-2 flex justify-end">
                <Button type="submit" disabled={isCreatingTest}>
                  {language === 'sr' ? 'Kreiraj test' : 'Create test'}
                </Button>
              </div>
            </form>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
          <div
            className={getMetricTileClass(subscriptionStatusFilter === 'active')}
            onClick={() => toggleSubscriptionFilter('active')}
          >
            <div className="text-2xl font-bold text-primary">{metrics.activeCount}</div>
            <div className="text-xs text-muted-foreground">
              {language === 'sr' ? 'Aktivne pretplate' : 'Active subscriptions'}
            </div>
          </div>
          <div
            className={getMetricTileClass(deliveryStatusFilter === 'sent' && deliveryDateFilter === 'today')}
            onClick={() => toggleDeliveryFilter('sent')}
          >
            <div className="text-2xl font-bold text-green-400">{metrics.sentTodayCount}</div>
            <div className="text-xs text-muted-foreground">
              {language === 'sr' ? 'Poslato danas' : 'Sent today'}
            </div>
          </div>
          <div
            className={getMetricTileClass(deliveryStatusFilter === 'failed' && deliveryDateFilter === 'today')}
            onClick={() => toggleDeliveryFilter('failed')}
          >
            <div className="text-2xl font-bold text-red-400">{metrics.failedTodayCount}</div>
            <div className="text-xs text-muted-foreground">
              {language === 'sr' ? 'Neuspešno danas' : 'Failed today'}
            </div>
          </div>
          <div
            className={getMetricTileClass(subscriptionStatusFilter === 'unsubscribed')}
            onClick={() => toggleSubscriptionFilter('unsubscribed')}
          >
            <div className="text-2xl font-bold text-muted-foreground">{metrics.unsubscribedCount}</div>
            <div className="text-xs text-muted-foreground">
              {language === 'sr' ? 'Odjavljeni' : 'Unsubscribed'}
            </div>
          </div>
          <div
            className={getMetricTileClass(subscriptionStatusFilter === 'completed')}
            onClick={() => toggleSubscriptionFilter('completed')}
          >
            <div className="text-2xl font-bold text-blue-400">{metrics.completedCount}</div>
            <div className="text-xs text-muted-foreground">
              {language === 'sr' ? 'Završene' : 'Completed'}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <h3 className="text-sm font-semibold text-foreground">
              {language === 'sr' ? 'Pretplate' : 'Subscriptions'}
            </h3>
            <Select
              value={subscriptionStatusFilter}
              onValueChange={(value) => setSubscriptionStatusFilter(value)}
            >
              <SelectTrigger className="h-8 w-[160px] bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === 'sr' ? 'Svi statusi' : 'All statuses'}</SelectItem>
                <SelectItem value="active">{language === 'sr' ? 'Aktivne' : 'Active'}</SelectItem>
                <SelectItem value="completed">{language === 'sr' ? 'Završene' : 'Completed'}</SelectItem>
                <SelectItem value="unsubscribed">{language === 'sr' ? 'Odjavljene' : 'Unsubscribed'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="border border-border rounded-lg overflow-hidden">
            {isLoading ? (
              <div className="p-6 text-sm text-muted-foreground">
                {language === 'sr' ? 'Učitavanje...' : 'Loading...'}
              </div>
            ) : filteredSubscriptions.length === 0 ? (
              <div className="p-6 text-sm text-muted-foreground">
                {language === 'sr' ? 'Nema pretplata' : 'No subscriptions yet'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/30 text-muted-foreground">
                    <tr>
                      <th className="p-3 text-left">{language === 'sr' ? 'Email' : 'Email'}</th>
                      <th className="p-3 text-left">{language === 'sr' ? 'Znak' : 'Sign'}</th>
                      <th className="p-3 text-left">{language === 'sr' ? 'Plan' : 'Plan'}</th>
                      <th className="p-3 text-left">{language === 'sr' ? 'Status' : 'Status'}</th>
                      <th className="p-3 text-left">{language === 'sr' ? 'Zona' : 'Time zone'}</th>
                      <th className="p-3 text-left">{language === 'sr' ? 'Vreme slanja' : 'Send time'}</th>
                      <th className="p-3 text-left">{language === 'sr' ? 'Sledeće slanje' : 'Next send'}</th>
                      <th className="p-3 text-left">{language === 'sr' ? 'Poslednje slanje' : 'Last sent'}</th>
                      <th className="p-3 text-left">{language === 'sr' ? 'Poslato' : 'Sent'}</th>
                      <th className="p-3 text-right">{language === 'sr' ? 'Akcije' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubscriptions.map((subscription) => (
                      <tr key={subscription.id} className="border-t border-border">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-foreground">{subscription.email}</span>
                          </div>
                        </td>
                        <td className="p-3 text-foreground">{getZodiacLabel(subscription.zodiac_sign)}</td>
                        <td className="p-3 text-foreground">{getPlanLabel(subscription.plan)}</td>
                        <td className="p-3">
                          <span className={`inline-flex rounded-full px-2 py-1 text-xs ${getStatusStyle(subscription.status)}`}>
                            {subscription.status}
                          </span>
                        </td>
                        <td className="p-3 text-muted-foreground">
                          {subscription.timezone || '-'}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Input
                              type="time"
                              step={3600}
                              value={getSendHourValue(subscription)}
                              onChange={(event) =>
                                setSendHourEdits((prev) => ({
                                  ...prev,
                                  [subscription.id]: event.target.value,
                                }))
                              }
                              disabled={subscription.status !== 'active'}
                              className="h-8 w-[110px] bg-background"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSaveSendHour(subscription)}
                              disabled={subscription.status !== 'active' || savingSendHourId === subscription.id}
                            >
                              {savingSendHourId === subscription.id
                                ? (language === 'sr' ? '...' : '...')
                                : (language === 'sr' ? 'Sačuvaj' : 'Save')}
                            </Button>
                          </div>
                        </td>
                        <td className="p-3 text-muted-foreground">{formatDateTime(subscription.next_send_at)}</td>
                        <td className="p-3 text-muted-foreground">{formatDateTime(subscription.last_sent_at)}</td>
                        <td className="p-3 text-muted-foreground">{subscription.send_count}</td>
                        <td className="p-3 text-right">
                          {subscription.status === 'active' ? (
                            <Button
                              variant="destructive"
                              size="sm"
                              disabled={cancellingId === subscription.id}
                              onClick={() => handleCancelSubscription(subscription.id)}
                            >
                              {language === 'sr' ? 'Otkaži' : 'Cancel'}
                            </Button>
                          ) : (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">
            {language === 'sr' ? 'Log slanja' : 'Delivery log'}
          </h3>
          <div className="border border-border rounded-lg overflow-hidden">
            {isLoading ? (
              <div className="p-6 text-sm text-muted-foreground">
                {language === 'sr' ? 'Učitavanje...' : 'Loading...'}
              </div>
            ) : filteredDeliveries.length === 0 ? (
              <div className="p-6 text-sm text-muted-foreground">
                {language === 'sr' ? 'Nema logova' : 'No delivery logs'}
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filteredDeliveries.map((delivery) => (
                  <div key={delivery.id} className="p-4 flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs ${getStatusStyle(delivery.status)}`}>
                        {delivery.status === 'sent' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <AlertCircle className="w-3 h-3" />
                        )}
                        {delivery.status}
                      </span>
                      <span className="text-foreground">{delivery.email}</span>
                      <span className="text-muted-foreground">{getZodiacLabel(delivery.zodiac_sign)}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDateOnly(delivery.horoscope_date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDateTime(delivery.created_at)}
                      </span>
                      {delivery.error_message && (
                        <span className="text-red-400">{delivery.error_message}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HoroscopeAdminDialog;
