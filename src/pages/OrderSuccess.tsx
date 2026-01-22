import { useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { trackOrderSuccessView } from '@/lib/analytics';

const OrderSuccess = () => {
  const { language } = useLanguage();

  useEffect(() => {
    trackOrderSuccessView();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto rounded-2xl border border-border bg-card/60 p-10 text-center">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            {language === 'sr' ? 'Uplata je uspešna' : 'Payment successful'}
          </h1>
          <p className="text-muted-foreground mb-6">
            {language === 'sr'
              ? 'Hvala! Tvoja narudžbina je primljena i uskoro će biti obrađena.'
              : 'Thank you! Your order has been received and will be processed shortly.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="cosmic">
              <Link to="/">
                {language === 'sr' ? 'Nazad na početnu' : 'Back to home'}
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/products">
                {language === 'sr' ? 'Pogledaj ponudu' : 'Browse products'}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
