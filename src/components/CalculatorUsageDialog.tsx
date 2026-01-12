import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { sr } from 'date-fns/locale';
import { BarChart3, Calendar as CalendarIcon } from 'lucide-react';
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from 'recharts';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getUsage } from '@/lib/api';
import type { DateRange } from 'react-day-picker';

interface DailyUsage {
  date: string;
  count: number;
}

interface CalculatorUsageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type RangeFilter = 'week' | 'month' | 'year' | 'custom';

export const CalculatorUsageDialog = ({ open, onOpenChange }: CalculatorUsageDialogProps) => {
  const { language } = useLanguage();
  const [dailyUsage, setDailyUsage] = useState<DailyUsage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [range, setRange] = useState<RangeFilter>('month');
  const [customRange, setCustomRange] = useState<DateRange | undefined>(() => {
    const now = new Date();
    const start = new Date(now);
    start.setDate(start.getDate() - 6);
    return { from: start, to: now };
  });
  const locale = language === 'sr' ? sr : undefined;

  const fetchDailyUsage = async () => {
    setIsLoading(true);
    try {
      const { usage } = await getUsage();

      // Group by date
      const usageByDate: Record<string, number> = {};
      usage?.forEach((item) => {
        const date = format(new Date(item.created_at), 'yyyy-MM-dd');
        usageByDate[date] = (usageByDate[date] || 0) + 1;
      });

      // Convert to array and sort by date descending
      const dailyData = Object.entries(usageByDate)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => b.date.localeCompare(a.date));

      setDailyUsage(dailyData);
    } catch (error) {
      console.error('Error fetching daily usage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchDailyUsage();
    }
  }, [open]);

  const formatDate = (dateStr: string) => {
    const date = new Date(`${dateStr}T00:00:00`);
    return format(date, 'EEEE, d. MMMM yyyy', { locale });
  };

  const chartData = useMemo(() => {
    const now = new Date();
    const start = new Date(now);
    const end = new Date(now);

    if (range === 'custom' && customRange?.from) {
      start.setTime(customRange.from.getTime());
      end.setTime((customRange.to ?? customRange.from).getTime());
    } else if (range === 'week') {
      start.setDate(start.getDate() - 6);
    } else if (range === 'month') {
      start.setMonth(start.getMonth() - 1);
    } else {
      start.setFullYear(start.getFullYear() - 1);
    }

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    const filtered = dailyUsage
      .filter((day) => {
        const d = new Date(`${day.date}T00:00:00`);
        return d >= start && d <= end;
      })
      .sort((a, b) => new Date(`${a.date}T00:00:00`).getTime() - new Date(`${b.date}T00:00:00`).getTime());

    // Ensure there is at least one point for the chart
    return filtered.length > 0 ? filtered : [{ date: format(end, 'yyyy-MM-dd'), count: 0 }];
  }, [dailyUsage, range, customRange]);

  const formatShortDate = (date: Date) => format(date, 'd MMM yyyy', { locale });
  const customRangeLabel = customRange?.from
    ? customRange.to
      ? `${formatShortDate(customRange.from)} - ${formatShortDate(customRange.to)}`
      : formatShortDate(customRange.from)
    : (language === 'sr' ? 'Izaberite period' : 'Select a range');

  const totalUsage = dailyUsage.reduce((sum, day) => sum + day.count, 0);
  const totalInRange = chartData.reduce((sum, day) => sum + day.count, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            {language === 'sr' ? 'Statistika kalkulatora' : 'Calculator Statistics'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-primary/10 rounded-lg">
            <div className="text-2xl font-bold text-primary">{totalUsage}</div>
            <div className="text-sm text-muted-foreground">
              {language === 'sr' ? 'Ukupno korišćenja' : 'Total usage'}
            </div>
          </div>
          <div className="p-4 bg-secondary/30 rounded-lg">
            <div className="text-2xl font-bold text-foreground">{totalInRange}</div>
            <div className="text-sm text-muted-foreground">
              {language === 'sr' ? 'Korišćenja u periodu' : 'Usage in range'}
            </div>
          </div>
          <div className="p-4 bg-card border border-border rounded-lg">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-muted-foreground">
                {language === 'sr' ? 'Prikaz' : 'Range'}
              </span>
              <Select value={range} onValueChange={(v) => setRange(v as RangeFilter)}>
                <SelectTrigger className="w-[220px] bg-background">
                  <SelectValue placeholder={language === 'sr' ? 'Izaberi' : 'Select'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">{language === 'sr' ? 'Poslednjih 7 dana' : 'Last 7 days'}</SelectItem>
                  <SelectItem value="month">{language === 'sr' ? 'Poslednjih mesec dana' : 'Last month'}</SelectItem>
                  <SelectItem value="year">{language === 'sr' ? 'Poslednja godina' : 'Last year'}</SelectItem>
                  <SelectItem value="custom">{language === 'sr' ? 'Prilagođeni period' : 'Custom range'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {range === 'custom' && (
              <div className="mt-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${
                        customRange?.from ? 'text-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                      {customRangeLabel}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={customRange}
                      onSelect={setCustomRange}
                      numberOfMonths={2}
                      defaultMonth={customRange?.from}
                      disabled={{ after: new Date() }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
        </div>

        <div className="h-64 w-full mb-6 bg-card border border-border rounded-lg p-4">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              {language === 'sr' ? 'Učitavanje...' : 'Loading...'}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => format(new Date(`${value}T00:00:00`), 'd MMM')}
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <YAxis
                  allowDecimals={false}
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <RechartsTooltip
                  formatter={(value: number) => [value, language === 'sr' ? 'Korišćenja' : 'Usages']}
                  labelFormatter={(value) => formatDate(value)}
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="overflow-y-auto max-h-[50vh]">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              {language === 'sr' ? 'Učitavanje...' : 'Loading...'}
            </div>
          ) : dailyUsage.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {language === 'sr' ? 'Nema podataka' : 'No data available'}
            </div>
          ) : (
            <div className="space-y-2">
              {dailyUsage.map((day) => (
                <div
                  key={day.date}
                  className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
                >
                  <span className="text-sm text-foreground capitalize">
                    {formatDate(day.date)}
                  </span>
                  <span className="font-semibold text-primary">{day.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
