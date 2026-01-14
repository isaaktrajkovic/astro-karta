import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, Sparkles } from 'lucide-react';
import CompatibilityResultDialog from './CompatibilityResultDialog';
import { trackUsage } from '@/lib/api';

const zodiacSigns = [
  { name: 'aries', symbol: '♈', start: [3, 21], end: [4, 19] },
  { name: 'taurus', symbol: '♉', start: [4, 20], end: [5, 20] },
  { name: 'gemini', symbol: '♊', start: [5, 21], end: [6, 20] },
  { name: 'cancer', symbol: '♋', start: [6, 21], end: [7, 22] },
  { name: 'leo', symbol: '♌', start: [7, 23], end: [8, 22] },
  { name: 'virgo', symbol: '♍', start: [8, 23], end: [9, 22] },
  { name: 'libra', symbol: '♎', start: [9, 23], end: [10, 22] },
  { name: 'scorpio', symbol: '♏', start: [10, 23], end: [11, 21] },
  { name: 'sagittarius', symbol: '♐', start: [11, 22], end: [12, 21] },
  { name: 'capricorn', symbol: '♑', start: [12, 22], end: [1, 19] },
  { name: 'aquarius', symbol: '♒', start: [1, 20], end: [2, 18] },
  { name: 'pisces', symbol: '♓', start: [2, 19], end: [3, 20] },
];

const compatibilityMatrix: { [key: string]: number } = {
  'aries-aries': 75, 'aries-taurus': 55, 'aries-gemini': 80, 'aries-cancer': 45,
  'aries-leo': 95, 'aries-virgo': 50, 'aries-libra': 70, 'aries-scorpio': 65,
  'aries-sagittarius': 90, 'aries-capricorn': 50, 'aries-aquarius': 85, 'aries-pisces': 60,
  'taurus-taurus': 85, 'taurus-gemini': 45, 'taurus-cancer': 90, 'taurus-leo': 60,
  'taurus-virgo': 95, 'taurus-libra': 65, 'taurus-scorpio': 88, 'taurus-sagittarius': 40,
  'taurus-capricorn': 95, 'taurus-aquarius': 45, 'taurus-pisces': 85,
  'gemini-gemini': 70, 'gemini-cancer': 50, 'gemini-leo': 80, 'gemini-virgo': 55,
  'gemini-libra': 90, 'gemini-scorpio': 45, 'gemini-sagittarius': 85, 'gemini-capricorn': 40,
  'gemini-aquarius': 95, 'gemini-pisces': 55,
  'cancer-cancer': 80, 'cancer-leo': 55, 'cancer-virgo': 85, 'cancer-libra': 50,
  'cancer-scorpio': 95, 'cancer-sagittarius': 40, 'cancer-capricorn': 70, 'cancer-aquarius': 45,
  'cancer-pisces': 95,
  'leo-leo': 75, 'leo-virgo': 50, 'leo-libra': 80, 'leo-scorpio': 60,
  'leo-sagittarius': 95, 'leo-capricorn': 45, 'leo-aquarius': 70, 'leo-pisces': 55,
  'virgo-virgo': 80, 'virgo-libra': 55, 'virgo-scorpio': 85, 'virgo-sagittarius': 45,
  'virgo-capricorn': 95, 'virgo-aquarius': 50, 'virgo-pisces': 65,
  'libra-libra': 75, 'libra-scorpio': 60, 'libra-sagittarius': 80, 'libra-capricorn': 50,
  'libra-aquarius': 90, 'libra-pisces': 55,
  'scorpio-scorpio': 70, 'scorpio-sagittarius': 55, 'scorpio-capricorn': 85, 'scorpio-aquarius': 50,
  'scorpio-pisces': 95,
  'sagittarius-sagittarius': 80, 'sagittarius-capricorn': 50, 'sagittarius-aquarius': 85, 'sagittarius-pisces': 60,
  'capricorn-capricorn': 85, 'capricorn-aquarius': 55, 'capricorn-pisces': 70,
  'aquarius-aquarius': 75, 'aquarius-pisces': 55,
  'pisces-pisces': 80,
};

const apiBase = import.meta.env.VITE_API_BASE_URL || '';
const llmEnabled = import.meta.env.VITE_COMPATIBILITY_LLM === 'true';

const parseDateString = (dateStr: string, dayFirst = false): Date | null => {
  // Accept ISO (YYYY-MM-DD) or legacy MM/DD/YYYY style inputs
  if (!dateStr) return null;

  const trimmed = dateStr.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const [year, month, day] = trimmed.split('-').map((p) => parseInt(p, 10));
    const date = new Date(year, month - 1, day);
    if (
      date.getFullYear() === year &&
      date.getMonth() + 1 === month &&
      date.getDate() === day
    ) {
      return date;
    }
    return null;
  }

  const normalized = trimmed.replace(/[./]/g, '-').replace(/\//g, '-');
  const parts = normalized.split('-').filter(Boolean);
  if (parts.length !== 3) return null;

  let year: number, month: number, day: number;

  if (dayFirst) {
    [day, month, year] = parts.map((p) => parseInt(p, 10));
  } else {
    [month, day, year] = parts.map((p) => parseInt(p, 10));
  }

  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > new Date().getFullYear()) return null;

  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() + 1 !== month ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
};

const getZodiacSign = (date: Date) => {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  for (const sign of zodiacSigns) {
    const [startMonth, startDay] = sign.start;
    const [endMonth, endDay] = sign.end;

    if (startMonth === 12 && endMonth === 1) {
      if ((month === 12 && day >= startDay) || (month === 1 && day <= endDay)) {
        return sign;
      }
    } else if (
      (month === startMonth && day >= startDay) ||
      (month === endMonth && day <= endDay)
    ) {
      return sign;
    }
  }
  return zodiacSigns[0];
};

const getCompatibility = (sign1: string, sign2: string): number => {
  const key1 = `${sign1}-${sign2}`;
  const key2 = `${sign2}-${sign1}`;
  return compatibilityMatrix[key1] || compatibilityMatrix[key2] || 50;
};

const CompatibilityCalculator = () => {
  const { t, language } = useLanguage();
  const [date1, setDate1] = useState('');
  const [date2, setDate2] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<{
    sign1: typeof zodiacSigns[0];
    sign2: typeof zodiacSigns[0];
    compatibility: number;
    llmDescription?: string | null;
  } | null>(null);
  const maxDate = new Date().toISOString().split('T')[0];
  const [isLoadingDescription, setIsLoadingDescription] = useState(false);
  const [isMobileDateInput, setIsMobileDateInput] = useState(false);
  const llmRequestIdRef = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(hover: none) and (pointer: coarse)');
    const update = () => setIsMobileDateInput(mediaQuery.matches);
    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  const formatDayFirstDateInput = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 8);
    const parts = [];
    if (digits.length > 0) parts.push(digits.slice(0, 2));
    if (digits.length > 2) parts.push(digits.slice(2, 4));
    if (digits.length > 4) parts.push(digits.slice(4, 8));
    return parts.join('/');
  };

  const fetchLlmDescription = async (sign1: string, sign2: string, compatibility: number) => {
    if (!llmEnabled) {
      return null;
    }
    try {
      const response = await fetch(`${apiBase}/api/compatibility-llm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sign1, sign2, compatibility, language }),
      });

      if (!response.ok) {
        throw new Error('LLM request failed');
      }

      const data = await response.json();
      return typeof data.text === 'string' ? data.text : null;
    } catch (error) {
      console.error('LLM description error:', error);
      return null;
    }
  };

  const handleCalculate = () => {
    const parsedDate1 = parseDateString(date1, isMobileDateInput);
    const parsedDate2 = parseDateString(date2, isMobileDateInput);
    
    if (!parsedDate1 || !parsedDate2) return;

    const sign1 = getZodiacSign(parsedDate1);
    const sign2 = getZodiacSign(parsedDate2);
    const compatibility = getCompatibility(sign1.name, sign2.name);

    setResult({ sign1, sign2, compatibility, llmDescription: null });
    setShowResult(true);

    // Track calculator usage without blocking the UI
    trackUsage({
      sign1: sign1.name,
      sign2: sign2.name,
      compatibility: compatibility,
    }).catch((error) => {
      console.error('Error tracking calculator usage:', error);
    });

    if (llmEnabled) {
      const requestId = llmRequestIdRef.current + 1;
      llmRequestIdRef.current = requestId;
      setIsLoadingDescription(true);

      fetchLlmDescription(sign1.name, sign2.name, compatibility)
        .then((llmDescription) => {
          if (!llmDescription || llmRequestIdRef.current !== requestId) {
            return;
          }
          setResult((prev) => (prev ? { ...prev, llmDescription } : prev));
        })
        .finally(() => {
          if (llmRequestIdRef.current === requestId) {
            setIsLoadingDescription(false);
          }
        });
    } else {
      setIsLoadingDescription(false);
    }
  };

  const isValidDate = (dateStr: string) => {
    return parseDateString(dateStr, isMobileDateInput) !== null;
  };

  const canCalculate = isValidDate(date1) && isValidDate(date2);

  return (
    <section className="mb-20 scroll-mt-24">
      <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/20 rounded-2xl p-8 md:p-12 border border-primary/20">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            <Heart className="h-8 w-8 text-accent" />
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
            {t('compatibility.title')}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t('compatibility.subtitle')}
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-end justify-center gap-6 md:gap-8">
          {/* First Date Input */}
          <div className="w-full md:w-auto">
            <Label htmlFor="date1" className="block text-sm font-medium text-foreground mb-2">
              {t('compatibility.person1')}
            </Label>
            <Input
              id="date1"
              type={isMobileDateInput ? 'text' : 'date'}
              placeholder={isMobileDateInput ? 'dd/mm/yyyy' : t('compatibility.selectDate')}
              value={date1}
              onChange={(e) => setDate1(isMobileDateInput ? formatDayFirstDateInput(e.target.value) : e.target.value)}
              max={maxDate}
              inputMode={isMobileDateInput ? 'numeric' : undefined}
              pattern={isMobileDateInput ? '\\d{2}/\\d{2}/\\d{4}' : undefined}
              className="w-full md:w-[180px] bg-background/50 border-border focus:border-primary text-center"
            />
          </div>

          {/* Heart Icon */}
          <div className="hidden md:flex items-center justify-center pb-2">
            <Heart className="h-10 w-10 text-accent animate-pulse" />
          </div>

          {/* Second Date Input */}
          <div className="w-full md:w-auto">
            <Label htmlFor="date2" className="block text-sm font-medium text-foreground mb-2">
              {t('compatibility.person2')}
            </Label>
            <Input
              id="date2"
              type={isMobileDateInput ? 'text' : 'date'}
              placeholder={isMobileDateInput ? 'dd/mm/yyyy' : t('compatibility.selectDate')}
              value={date2}
              onChange={(e) => setDate2(isMobileDateInput ? formatDayFirstDateInput(e.target.value) : e.target.value)}
              max={maxDate}
              inputMode={isMobileDateInput ? 'numeric' : undefined}
              pattern={isMobileDateInput ? '\\d{2}/\\d{2}/\\d{4}' : undefined}
              className="w-full md:w-[180px] bg-background/50 border-border focus:border-primary text-center"
            />
          </div>
        </div>

        {/* Calculate Button */}
        <div className="text-center mt-8">
          <Button
            variant="cosmic"
            size="xl"
            onClick={handleCalculate}
            disabled={!canCalculate}
            className="min-w-[200px]"
          >
            <Heart className="mr-2 h-5 w-5" />
            {isLoadingDescription ? '...' : t('compatibility.calculate')}
          </Button>
        </div>

        {isLoadingDescription && (
          <div
            className="mt-6 flex flex-col items-center gap-3 text-sm text-muted-foreground"
            role="status"
            aria-live="polite"
          >
            <div className="relative h-20 w-20">
              <div className="absolute inset-0 rounded-full stars-bg opacity-70" />
              <div className="absolute inset-2 rounded-full border border-primary/20 orbit-slow">
                <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary)/0.6)]" />
              </div>
              <div className="absolute inset-5 rounded-full border border-accent/40 orbit-fast">
                <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_10px_hsl(var(--accent)/0.6)]" />
              </div>
              <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/80 animate-pulse" />
            </div>
            <div className="text-center">
              <div className="font-medium text-foreground">{t('compatibility.loadingTitle')}</div>
              <div className="text-xs text-muted-foreground">{t('compatibility.loadingSubtitle')}</div>
            </div>
          </div>
        )}
      </div>

      {/* Result Dialog */}
      {result && (
        <CompatibilityResultDialog
          open={showResult}
          onOpenChange={setShowResult}
          sign1={result.sign1}
          sign2={result.sign2}
          compatibility={result.compatibility}
          llmDescription={result.llmDescription}
          isLoadingDescription={isLoadingDescription}
          useLlm={llmEnabled}
        />
      )}
    </section>
  );
};

export default CompatibilityCalculator;
