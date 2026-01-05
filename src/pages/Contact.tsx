import { useState } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';

const Contact = () => {
  const { language, t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast({
      title: language === 'sr' ? 'Poruka poslata!' : 'Message sent!',
      description: language === 'sr' ? 'Odgovorićemo vam u najkraćem roku.' : 'We will reply to you shortly.',
    });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">{t('contact.title')}</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('contact.text')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Email</h3>
                <p className="text-muted-foreground">info@astrokarta.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  {language === 'sr' ? 'Telefon' : 'Phone'}
                </h3>
                <p className="text-muted-foreground">+381 11 123 4567</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  {language === 'sr' ? 'Lokacija' : 'Location'}
                </h3>
                <p className="text-muted-foreground">Beograd, Srbija</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-8 cosmic-border space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">
                {t('form.name')} <span className="text-accent">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                required
                className="bg-secondary/50 border-border focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                {t('form.email')} <span className="text-accent">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                required
                className="bg-secondary/50 border-border focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-foreground">
                {language === 'sr' ? 'Poruka' : 'Message'} <span className="text-accent">*</span>
              </Label>
              <Textarea
                id="message"
                rows={5}
                required
                className="bg-secondary/50 border-border focus:border-primary resize-none"
              />
            </div>

            <Button
              type="submit"
              variant="cosmic"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? '...' : (language === 'sr' ? 'Pošalji poruku' : 'Send Message')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
