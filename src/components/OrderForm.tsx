import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { createOrder } from '@/lib/api';

interface OrderFormProps {
  productId: string;
  productName: string;
  isConsultation?: boolean;
  onSuccess?: () => void;
}

const OrderForm = ({ productId, productName, isConsultation = false, onSuccess }: OrderFormProps) => {
  const { t, language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobileDateInput, setIsMobileDateInput] = useState(false);
  
  // Check if this is a compatibility/love analysis product
  const isCompatibilityAnalysis = productId === 'report-love';
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    birthTime: '',
    birthCity: '',
    birthCountry: '',
    email: '',
    note: '',
    consultationDescription: '',
    // Partner fields for compatibility analysis
    partnerFirstName: '',
    partnerLastName: '',
    partnerBirthDate: '',
    partnerBirthTime: '',
    partnerBirthCity: '',
    partnerBirthCountry: '',
  });
  const isTimeMissing = !formData.birthTime.trim()
    || (isCompatibilityAnalysis && !formData.partnerBirthTime.trim());

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

  const normalizeDateInput = (value: string, dayFirst: boolean) => {
    if (!value) return null;
    const trimmed = value.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

    const normalized = trimmed.replace(/[.\-]/g, '/');
    const parts = normalized.split('/').map((part) => part.trim());
    if (parts.length !== 3) return null;

    const [first, second, year] = parts;
    const day = dayFirst ? first : second;
    const month = dayFirst ? second : first;

    if (!/^\d{1,2}$/.test(day) || !/^\d{1,2}$/.test(month) || !/^\d{4}$/.test(year)) {
      return null;
    }

    const dayNum = Number(day);
    const monthNum = Number(month);
    const yearNum = Number(year);
    if (monthNum < 1 || monthNum > 12 || dayNum < 1 || dayNum > 31) return null;

    const date = new Date(yearNum, monthNum - 1, dayNum);
    if (
      date.getFullYear() !== yearNum ||
      date.getMonth() + 1 !== monthNum ||
      date.getDate() !== dayNum
    ) {
      return null;
    }

    return `${year}-${String(monthNum).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const normalizedBirthDate = normalizeDateInput(formData.birthDate, isMobileDateInput);
      if (!normalizedBirthDate) {
        toast({
          title: language === 'sr' ? 'Neispravan datum' : 'Invalid date',
          description: language === 'sr'
            ? 'Unesite datum u formatu dd/mm/yyyy.'
            : 'Enter the date in dd/mm/yyyy format.',
          variant: 'destructive',
        });
        return;
      }

      if (isCompatibilityAnalysis) {
        const normalizedPartnerBirthDate = normalizeDateInput(formData.partnerBirthDate, isMobileDateInput);
        if (!normalizedPartnerBirthDate) {
          toast({
            title: language === 'sr' ? 'Neispravan datum' : 'Invalid date',
            description: language === 'sr'
              ? 'Unesite datum partnera u formatu dd/mm/yyyy.'
              : 'Enter the partner date in dd/mm/yyyy format.',
            variant: 'destructive',
          });
          return;
        }
      }

      // Build note with partner info if it's a compatibility analysis
      const normalizedBirthTime = formData.birthTime.trim();
      if (!normalizedBirthTime) {
        toast({
          title: language === 'sr' ? 'Neispravno vreme' : 'Invalid time',
          description: language === 'sr'
            ? 'Unesite vreme rođenja.'
            : 'Please enter the birth time.',
          variant: 'destructive',
        });
        return;
      }

      if (isCompatibilityAnalysis) {
        const normalizedPartnerBirthTime = formData.partnerBirthTime.trim();
        if (!normalizedPartnerBirthTime) {
          toast({
            title: language === 'sr' ? 'Neispravno vreme' : 'Invalid time',
            description: language === 'sr'
              ? 'Unesite vreme rođenja partnera.'
              : 'Please enter the partner birth time.',
            variant: 'destructive',
          });
          return;
        }
      }

      let fullNote = formData.note || '';
      if (isCompatibilityAnalysis) {
        const partnerInfo = `
--- ${t('form.partnerData')} ---
${t('form.firstName')}: ${formData.partnerFirstName}
${t('form.lastName')}: ${formData.partnerLastName}
${t('form.birthdate')}: ${formData.partnerBirthDate}
${t('form.birthtime')}: ${formData.partnerBirthTime}
${t('form.birthCity')}: ${formData.partnerBirthCity}
${t('form.birthCountry')}: ${formData.partnerBirthCountry}
---`;
        fullNote = partnerInfo + (formData.note ? `\n\n${formData.note}` : '');
      }

      await createOrder({
        product_id: productId,
        product_name: productName,
        customer_name: `${formData.firstName} ${formData.lastName}`.trim(),
        first_name: formData.firstName,
        last_name: formData.lastName,
        birth_date: normalizedBirthDate,
        birth_time: normalizedBirthTime,
        birth_place: `${formData.birthCity}, ${formData.birthCountry}`,
        city: formData.birthCity,
        country: formData.birthCountry,
        email: formData.email,
        note: fullNote || null,
        consultation_description: isConsultation ? formData.consultationDescription : null,
      });

      toast({
        title: t('form.success'),
        description: productName,
      });

      setFormData({
        firstName: '',
        lastName: '',
        birthDate: '',
        birthTime: '',
        birthCity: '',
        birthCountry: '',
        email: '',
        note: '',
        consultationDescription: '',
        partnerFirstName: '',
        partnerLastName: '',
        partnerBirthDate: '',
        partnerBirthTime: '',
        partnerBirthCity: '',
        partnerBirthCountry: '',
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error submitting order:', error);
      toast({
        title: language === 'sr' ? 'Greška' : 'Error',
        description: error instanceof Error
          ? error.message
          : (language === 'sr' ? 'Došlo je do greške. Pokušajte ponovo.' : 'An error occurred. Please try again.'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Person 1 / Main person */}
      {isCompatibilityAnalysis && (
        <h3 className="text-lg font-semibold text-foreground">{t('form.yourData')}</h3>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-foreground">
            {t('form.firstName')} <span className="text-accent">*</span>
          </Label>
          <Input
            id="firstName"
            type="text"
            required
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            className="bg-secondary/50 border-border focus:border-primary"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-foreground">
            {t('form.lastName')} <span className="text-accent">*</span>
          </Label>
          <Input
            id="lastName"
            type="text"
            required
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            className="bg-secondary/50 border-border focus:border-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="birthDate" className="text-foreground">
            {t('form.birthdate')} <span className="text-accent">*</span>
          </Label>
          <Input
            id="birthDate"
            type={isMobileDateInput ? 'text' : 'date'}
            required
            value={formData.birthDate}
            onChange={(e) => setFormData({
              ...formData,
              birthDate: isMobileDateInput ? formatDayFirstDateInput(e.target.value) : e.target.value,
            })}
            placeholder={isMobileDateInput ? 'dd/mm/yyyy' : undefined}
            inputMode={isMobileDateInput ? 'numeric' : undefined}
            pattern={isMobileDateInput ? '\\d{2}/\\d{2}/\\d{4}' : undefined}
            className="bg-secondary/50 border-border focus:border-primary"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthTime" className="text-foreground">
            {t('form.birthtime')}
          </Label>
          <Input
            id="birthTime"
            type="time"
            required
            value={formData.birthTime}
            onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
            className="bg-secondary/50 border-border focus:border-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="birthCity" className="text-foreground">
            {t('form.birthCity')} <span className="text-accent">*</span>
          </Label>
          <Input
            id="birthCity"
            type="text"
            required
            value={formData.birthCity}
            onChange={(e) => setFormData({ ...formData, birthCity: e.target.value })}
            className="bg-secondary/50 border-border focus:border-primary"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="birthCountry" className="text-foreground">
            {t('form.birthCountry')} <span className="text-accent">*</span>
          </Label>
          <Input
            id="birthCountry"
            type="text"
            required
            value={formData.birthCountry}
            onChange={(e) => setFormData({ ...formData, birthCountry: e.target.value })}
            className="bg-secondary/50 border-border focus:border-primary"
          />
        </div>
      </div>

      {/* Partner fields for compatibility analysis */}
      {isCompatibilityAnalysis && (
        <>
          <Separator className="my-6" />
          <h3 className="text-lg font-semibold text-foreground">{t('form.partnerData')}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="partnerFirstName" className="text-foreground">
                {t('form.firstName')} <span className="text-accent">*</span>
              </Label>
              <Input
                id="partnerFirstName"
                type="text"
                required
                value={formData.partnerFirstName}
                onChange={(e) => setFormData({ ...formData, partnerFirstName: e.target.value })}
                className="bg-secondary/50 border-border focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="partnerLastName" className="text-foreground">
                {t('form.lastName')} <span className="text-accent">*</span>
              </Label>
              <Input
                id="partnerLastName"
                type="text"
                required
                value={formData.partnerLastName}
                onChange={(e) => setFormData({ ...formData, partnerLastName: e.target.value })}
                className="bg-secondary/50 border-border focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="partnerBirthDate" className="text-foreground">
                {t('form.birthdate')} <span className="text-accent">*</span>
              </Label>
              <Input
                id="partnerBirthDate"
                type={isMobileDateInput ? 'text' : 'date'}
                required
                value={formData.partnerBirthDate}
                onChange={(e) => setFormData({
                  ...formData,
                  partnerBirthDate: isMobileDateInput ? formatDayFirstDateInput(e.target.value) : e.target.value,
                })}
                placeholder={isMobileDateInput ? 'dd/mm/yyyy' : undefined}
                inputMode={isMobileDateInput ? 'numeric' : undefined}
                pattern={isMobileDateInput ? '\\d{2}/\\d{2}/\\d{4}' : undefined}
                className="bg-secondary/50 border-border focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="partnerBirthTime" className="text-foreground">
                {t('form.birthtime')}
              </Label>
              <Input
                id="partnerBirthTime"
                type="time"
                required
                value={formData.partnerBirthTime}
                onChange={(e) => setFormData({ ...formData, partnerBirthTime: e.target.value })}
                className="bg-secondary/50 border-border focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="partnerBirthCity" className="text-foreground">
                {t('form.birthCity')} <span className="text-accent">*</span>
              </Label>
              <Input
                id="partnerBirthCity"
                type="text"
                required
                value={formData.partnerBirthCity}
                onChange={(e) => setFormData({ ...formData, partnerBirthCity: e.target.value })}
                className="bg-secondary/50 border-border focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="partnerBirthCountry" className="text-foreground">
                {t('form.birthCountry')} <span className="text-accent">*</span>
              </Label>
              <Input
                id="partnerBirthCountry"
                type="text"
                required
                value={formData.partnerBirthCountry}
                onChange={(e) => setFormData({ ...formData, partnerBirthCountry: e.target.value })}
                className="bg-secondary/50 border-border focus:border-primary"
              />
            </div>
          </div>

          <Separator className="my-6" />
        </>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground">
          {t('form.email')} <span className="text-accent">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="bg-secondary/50 border-border focus:border-primary"
        />
      </div>

      {isConsultation && (
        <div className="space-y-2">
          <Label htmlFor="consultationDescription" className="text-foreground">
            {t('form.consultationDescription')} <span className="text-accent">*</span>
          </Label>
          <Textarea
            id="consultationDescription"
            rows={5}
            required
            value={formData.consultationDescription}
            onChange={(e) => setFormData({ ...formData, consultationDescription: e.target.value })}
            className="bg-secondary/50 border-border focus:border-primary resize-none"
            placeholder={language === 'sr' ? 'Opišite detaljno vaše pitanje ili situaciju...' : 'Describe your question or situation in detail...'}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="note" className="text-foreground">
          {t('form.note')}
        </Label>
        <Textarea
          id="note"
          rows={3}
          value={formData.note}
          onChange={(e) => setFormData({ ...formData, note: e.target.value })}
          className="bg-secondary/50 border-border focus:border-primary resize-none"
        />
      </div>

      <input type="hidden" name="productId" value={productId} />

      <p className="text-xs text-muted-foreground">{t('form.required')}</p>

      <Button
        type="submit"
        variant="cosmic"
        size="xl"
        className="w-full"
        disabled={isSubmitting || isTimeMissing}
      >
        {isSubmitting ? '...' : t('form.submit')}
      </Button>
    </form>
  );
};

export default OrderForm;
