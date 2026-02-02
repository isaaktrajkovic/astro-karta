import { useLanguage } from '@/contexts/LanguageContext';
import ProductCard from '@/components/ProductCard';
import CompatibilityCalculator from '@/components/CompatibilityCalculator';
import reportImage from '@/assets/astro-report.jpg';
import consultationImage from '@/assets/consultation.jpg';

const Products = () => {
  const { t } = useLanguage();

  const featured = [
    {
      id: 'partner-description',
      title: t('featured.partner.basic.title'),
      description: t('featured.partner.basic.desc'),
      priceCents: 600,
      originalPriceCents: 900,
      image: reportImage,
      badge: 'Novo',
    },
    {
      id: 'partner-description-when',
      title: t('featured.partner.when.title'),
      description: t('featured.partner.when.desc'),
      priceCents: 800,
      originalPriceCents: 1200,
      image: reportImage,
      badge: 'Novo',
    },
  ];

  const reports = [
    {
      id: 'report-natal',
      title: t('reports.natal.title'),
      description: t('reports.natal.desc'),
      priceCents: 8000,
      originalPriceCents: 10000,
      image: reportImage,
    },
    {
      id: 'report-yearly',
      title: t('reports.yearly.title'),
      description: t('reports.yearly.desc'),
      priceCents: 5000,
      originalPriceCents: 7500,
      image: reportImage,
    },
    {
      id: 'report-solar',
      title: t('reports.solar.title'),
      description: t('reports.solar.desc'),
      priceCents: 6000,
      originalPriceCents: 9000,
      image: reportImage,
    },
    {
      id: 'report-synastry',
      title: t('reports.synastry.title'),
      description: t('reports.synastry.desc'),
      priceCents: 8000,
      originalPriceCents: 15000,
      image: reportImage,
    },
    {
      id: 'report-questions',
      title: t('reports.questions.title'),
      description: t('reports.questions.desc'),
      priceCents: 2000,
      originalPriceCents: 3500,
      image: reportImage,
    },
  ];

  const consultations = [
    {
      id: 'consult-email',
      title: t('consult.email.title'),
      description: t('consult.email.desc'),
      priceCents: 10000,
      image: consultationImage,
    },
    {
      id: 'consult-vip',
      title: t('consult.vip.title'),
      description: t('consult.vip.desc'),
      priceCents: 15000,
      image: consultationImage,
      badge: 'VIP',
    },
    {
      id: 'consult-live',
      title: t('consult.live.title'),
      description: t('consult.live.desc'),
      priceCents: 9900,
      image: consultationImage,
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">{t('nav.products')}</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>
        </div>

        {/* Compatibility Calculator */}
        <CompatibilityCalculator />

        {/* Featured */}
        <section id="featured" className="mb-20 scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
            {t('products.featured')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </section>

        {/* Reports */}
        <section id="reports" className="mb-20 scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
            {t('products.reports')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </section>

        {/* Consultations */}
        <section id="consultations" className="mb-20 scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
            {t('products.consultations')}
          </h2>
          <p className="text-sm text-muted-foreground mb-8 bg-secondary/50 p-4 rounded-lg inline-block">
            ✨ {t('consult.note')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {consultations.map((product) => (
              <ProductCard key={product.id} {...product} isConsultation />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Products;
