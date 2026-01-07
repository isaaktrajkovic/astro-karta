import { useState } from 'react';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Build note with partner info if it's a compatibility analysis
      let fullNote = formData.note || '';
      if (isCompatibilityAnalysis) {
        const partnerInfo = `
--- ${t('form.partnerData')} ---
${t('form.firstName')}: ${formData.partnerFirstName}
${t('form.lastName')}: ${formData.partnerLastName}
${t('form.birthdate')}: ${formData.partnerBirthDate}
${t('form.birthtime')}: ${formData.partnerBirthTime || '-'}
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
        birth_date: formData.birthDate,
        birth_time: formData.birthTime || null,
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
            type="date"
            required
            value={formData.birthDate}
            onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
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
                type="date"
                required
                value={formData.partnerBirthDate}
                onChange={(e) => setFormData({ ...formData, partnerBirthDate: e.target.value })}
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
        disabled={isSubmitting}
      >
        {isSubmitting ? '...' : t('form.submit')}
      </Button>
    </form>
  );
};

export default OrderForm;
