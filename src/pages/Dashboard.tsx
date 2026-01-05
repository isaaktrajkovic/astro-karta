import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Mail, MapPin, Calendar, Clock, Package, User, Download, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import * as XLSX from 'xlsx';
import { CalculatorUsageDialog } from '@/components/CalculatorUsageDialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Order {
  id: string;
  product_id: string;
  product_name: string;
  customer_name: string;
  birth_date: string;
  birth_time: string | null;
  birth_place: string;
  email: string;
  note: string | null;
  status: string;
  created_at: string;
}

type StatusFilter = 'all' | 'pending' | 'processing' | 'completed';
type TimeFilter = 'all' | 'today' | 'week' | 'month' | 'year';
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
  const { language } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [calculatorUsageCount, setCalculatorUsageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [productFilter, setProductFilter] = useState<string>('all');
  const [zodiacFilter, setZodiacFilter] = useState<ZodiacSign>('all');
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [usageDialogOpen, setUsageDialogOpen] = useState(false);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
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
      const { count, error } = await supabase
        .from('calculator_usage')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      setCalculatorUsageCount(count || 0);
    } catch (error) {
      console.error('Error fetching calculator usage:', error);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

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

  useEffect(() => {
    fetchOrders();
    fetchCalculatorUsage();

    // Subscribe to realtime changes for calculator usage
    const channel = supabase
      .channel('calculator_usage_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'calculator_usage',
        },
        () => {
          fetchCalculatorUsage();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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

    // Time filter
    if (timeFilter !== 'all') {
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      result = result.filter((o) => {
        const orderDate = new Date(o.created_at);
        switch (timeFilter) {
          case 'today':
            return orderDate >= startOfToday;
          case 'week':
            const weekAgo = new Date(startOfToday);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return orderDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(startOfToday);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return orderDate >= monthAgo;
          case 'year':
            const yearAgo = new Date(startOfToday);
            yearAgo.setFullYear(yearAgo.getFullYear() - 1);
            return orderDate >= yearAgo;
          default:
            return true;
        }
      });
    }

    return result;
  }, [orders, statusFilter, productFilter, timeFilter, zodiacFilter]);

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedOrders.size === filteredOrders.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(filteredOrders.map(o => o.id)));
    }
  };

  const toggleSelectOrder = (orderId: string) => {
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

  const getStatusBadgeStyles = (status: string) => {
    const statusStyles: Record<string, string> = {
      pending: 'bg-yellow-500/20 text-yellow-400',
      processing: 'bg-green-500/20 text-green-400',
      completed: 'bg-red-500/20 text-red-400',
      cancelled: 'bg-muted text-muted-foreground',
    };
    return statusStyles[status] || statusStyles.pending;
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
              <label className="text-xs text-muted-foreground invisible">Export</label>
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
            </div>
          </div>
        </div>

        {/* Stats - Clickable */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
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
            {(statusFilter !== 'all' || timeFilter !== 'all' || productFilter !== 'all' || zodiacFilter !== 'all') && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setStatusFilter('all');
                  setTimeFilter('all');
                  setProductFilter('all');
                  setZodiacFilter('all');
                }}
              >
                {language === 'sr' ? 'Resetuj filtere' : 'Reset filters'}
              </Button>
            )}
          </div>

          {isLoading ? (
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
                      {language === 'sr' ? 'Podaci' : 'Birth Data'}
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      {language === 'sr' ? 'Datum' : 'Date'}
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
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-foreground">{order.product_name}</div>
                        <div className="text-xs text-muted-foreground">{order.product_id}</div>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <CalculatorUsageDialog 
          open={usageDialogOpen} 
          onOpenChange={setUsageDialogOpen} 
        />
      </div>
    </div>
  );
};

export default Dashboard;