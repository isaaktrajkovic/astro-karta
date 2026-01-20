import { XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const OrderCancel = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto rounded-2xl border border-border bg-card/60 p-10 text-center">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            {language === 'sr' ? 'Plaćanje je otkazano' : 'Payment cancelled'}
          </h1>
          <p className="text-muted-foreground mb-6">
            {language === 'sr'
              ? 'Ukoliko želiš, možeš pokušati ponovo ili se vratiti na ponudu.'
              : 'If you want, you can try again or return to the product list.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="cosmic">
              <Link to="/products">
                {language === 'sr' ? 'Nazad na ponudu' : 'Back to products'}
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/">
                {language === 'sr' ? 'Početna strana' : 'Home'}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCancel;
