import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import OrderForm from '@/components/OrderForm';
import { formatPrice } from '@/lib/utils';
import { trackOrderView } from '@/lib/analytics';

const productData: Record<string, { titleSr: string; titleEn: string; priceCents: number }> = {
  'partner-description': { titleSr: 'Opis vašeg budućeg partnera', titleEn: 'Future Partner Description', priceCents: 600 },
  'partner-description-when': { titleSr: 'Opis vašeg budućeg partnera i gde ćete ga upoznati', titleEn: 'Future Partner + When You’ll Meet', priceCents: 800 },
  'report-natal': { titleSr: 'Analiza natalne karte', titleEn: 'Natal Chart Analysis', priceCents: 8000 },
  'report-yearly': { titleSr: 'Godišnji astro izveštaj', titleEn: 'Annual Astro Report', priceCents: 5000 },
  'report-solar': { titleSr: 'Solarni horoskop', titleEn: 'Solar Return Horoscope', priceCents: 6000 },
  'report-synastry': { titleSr: 'Uporedni horoskop i Sinastrija', titleEn: 'Relationship Horoscope & Synastry', priceCents: 8000 },
  'report-questions': { titleSr: 'Pojedinačna Astro pitanja', titleEn: 'Single Astro Questions', priceCents: 2000 },
  'report-love': { titleSr: 'Ljubavna analiza', titleEn: 'Love Analysis', priceCents: 1000 },
  'report-career': { titleSr: 'Finansijski izveštaj', titleEn: 'Financial Report', priceCents: 1200 },
  'consult-email': { titleSr: 'Astro-odgovor (24h)', titleEn: 'Astro Answer (24h)', priceCents: 10000 },
  'consult-vip': { titleSr: 'VIP odgovor (1h)', titleEn: 'VIP Answer (1h)', priceCents: 15000 },
  'consult-live': { titleSr: 'Poziv sa astrologom (15 min)', titleEn: 'Astrologer Call (15 min)', priceCents: 9900 },
};

const Order = () => {
  const { productId } = useParams<{ productId: string }>();
  const { language, t } = useLanguage();

  const product = productId ? productData[productId] : null;

  useEffect(() => {
    if (productId) {
      trackOrderView(productId);
    }
  }, [productId]);

  if (!product) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {language === 'sr' ? 'Proizvod nije pronađen' : 'Product not found'}
          </h1>
          <Button asChild variant="cosmic">
            <Link to="/products">{t('nav.products')}</Link>
          </Button>
        </div>
      </div>
    );
  }

  const productName = language === 'sr' ? product.titleSr : product.titleEn;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Button asChild variant="ghost" className="mb-8">
            <Link to="/products">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('nav.products')}
            </Link>
          </Button>

          <div className="bg-card rounded-2xl border border-border p-8 cosmic-border">
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gradient mb-2">
                {t('form.title')}
              </h1>
              <div className="flex items-center justify-center gap-4">
                <span className="text-lg text-foreground">{productName}</span>
                <span className="text-2xl font-bold text-primary">{formatPrice(product.priceCents)}</span>
              </div>
            </div>

            <OrderForm
              productId={productId || ''}
              productName={productName}
              basePriceCents={product.priceCents}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
