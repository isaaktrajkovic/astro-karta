import { useEffect, useMemo, useState } from 'react';
import { RefreshCw, Mail, Calendar, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';
import {
  getHoroscopeDeliveries,
  getHoroscopeSubscriptions,
  HoroscopeDeliveryLog,
  HoroscopeSubscription,
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

  const locale = language === 'sr' ? 'sr-RS' : language;

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [subscriptionsResponse, deliveriesResponse] = await Promise.all([
        getHoroscopeSubscriptions(),
        getHoroscopeDeliveries(300),
      ]);

      setSubscriptions(subscriptionsResponse.subscriptions || []);
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

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
          <div className="p-4 bg-card border border-border rounded-lg">
            <div className="text-2xl font-bold text-primary">{metrics.activeCount}</div>
            <div className="text-xs text-muted-foreground">
              {language === 'sr' ? 'Aktivne pretplate' : 'Active subscriptions'}
            </div>
          </div>
          <div className="p-4 bg-card border border-border rounded-lg">
            <div className="text-2xl font-bold text-green-400">{metrics.sentTodayCount}</div>
            <div className="text-xs text-muted-foreground">
              {language === 'sr' ? 'Poslato danas' : 'Sent today'}
            </div>
          </div>
          <div className="p-4 bg-card border border-border rounded-lg">
            <div className="text-2xl font-bold text-red-400">{metrics.failedTodayCount}</div>
            <div className="text-xs text-muted-foreground">
              {language === 'sr' ? 'Neuspešno danas' : 'Failed today'}
            </div>
          </div>
          <div className="p-4 bg-card border border-border rounded-lg">
            <div className="text-2xl font-bold text-muted-foreground">{metrics.unsubscribedCount}</div>
            <div className="text-xs text-muted-foreground">
              {language === 'sr' ? 'Odjavljeni' : 'Unsubscribed'}
            </div>
          </div>
          <div className="p-4 bg-card border border-border rounded-lg">
            <div className="text-2xl font-bold text-blue-400">{metrics.completedCount}</div>
            <div className="text-xs text-muted-foreground">
              {language === 'sr' ? 'Završene' : 'Completed'}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            {language === 'sr' ? 'Pretplate' : 'Subscriptions'}
          </h3>
          <div className="border border-border rounded-lg overflow-hidden">
            {isLoading ? (
              <div className="p-6 text-sm text-muted-foreground">
                {language === 'sr' ? 'Učitavanje...' : 'Loading...'}
              </div>
            ) : subscriptions.length === 0 ? (
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
                      <th className="p-3 text-left">{language === 'sr' ? 'Status' : 'Status'}</th>
                      <th className="p-3 text-left">{language === 'sr' ? 'Sledeće slanje' : 'Next send'}</th>
                      <th className="p-3 text-left">{language === 'sr' ? 'Poslednje slanje' : 'Last sent'}</th>
                      <th className="p-3 text-left">{language === 'sr' ? 'Poslato' : 'Sent'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptions.map((subscription) => (
                      <tr key={subscription.id} className="border-t border-border">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-foreground">{subscription.email}</span>
                          </div>
                        </td>
                        <td className="p-3 text-foreground">{getZodiacLabel(subscription.zodiac_sign)}</td>
                        <td className="p-3">
                          <span className={`inline-flex rounded-full px-2 py-1 text-xs ${getStatusStyle(subscription.status)}`}>
                            {subscription.status}
                          </span>
                        </td>
                        <td className="p-3 text-muted-foreground">{formatDateTime(subscription.next_send_at)}</td>
                        <td className="p-3 text-muted-foreground">{formatDateTime(subscription.last_sent_at)}</td>
                        <td className="p-3 text-muted-foreground">{subscription.send_count}</td>
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
            ) : deliveries.length === 0 ? (
              <div className="p-6 text-sm text-muted-foreground">
                {language === 'sr' ? 'Nema logova' : 'No delivery logs'}
              </div>
            ) : (
              <div className="divide-y divide-border">
                {deliveries.map((delivery) => (
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
