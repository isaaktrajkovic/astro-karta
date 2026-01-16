import { useLanguage } from '@/contexts/LanguageContext';
import ProductCard from '@/components/ProductCard';
import CompatibilityCalculator from '@/components/CompatibilityCalculator';
import talismanImage from '@/assets/talisman-set.jpg';
import crystalImage from '@/assets/crystal-set.jpg';
import reportImage from '@/assets/astro-report.jpg';
import consultationImage from '@/assets/consultation.jpg';

const Products = () => {
  const { t } = useLanguage();

  const monthlyPackages = [
    {
      id: 'monthly-basic',
      title: t('monthly.basic.title'),
      description: t('monthly.basic.desc'),
      priceCents: 0,
      image: reportImage,
      badge: t('monthly.perMonth'),
    },
  ];

  const reports = [
    {
      id: 'report-natal',
      title: t('reports.natal.title'),
      description: t('reports.natal.desc'),
      priceCents: 11000,
      originalPriceCents: 15000,
      image: reportImage,
    },
    {
      id: 'report-yearly',
      title: t('reports.yearly.title'),
      description: t('reports.yearly.desc'),
      priceCents: 7000,
      originalPriceCents: 9500,
      image: reportImage,
    },
    {
      id: 'report-solar',
      title: t('reports.solar.title'),
      description: t('reports.solar.desc'),
      priceCents: 9000,
      originalPriceCents: 12000,
      image: reportImage,
    },
    {
      id: 'report-synastry',
      title: t('reports.synastry.title'),
      description: t('reports.synastry.desc'),
      priceCents: 15000,
      originalPriceCents: 22000,
      image: reportImage,
    },
    {
      id: 'report-questions',
      title: t('reports.questions.title'),
      description: t('reports.questions.desc'),
      priceCents: 3500,
      originalPriceCents: 5500,
      image: reportImage,
    },
  ];

  const consultations = [
    {
      id: 'consult-email',
      title: t('consult.email.title'),
      description: t('consult.email.desc'),
      priceCents: 600,
      image: consultationImage,
    },
    {
      id: 'consult-vip',
      title: t('consult.vip.title'),
      description: t('consult.vip.desc'),
      priceCents: 1200,
      image: consultationImage,
      badge: 'VIP',
    },
    {
      id: 'consult-live',
      title: t('consult.live.title'),
      description: t('consult.live.desc'),
      priceCents: 1500,
      image: consultationImage,
    },
  ];

  const physicalSets = [
    {
      id: 'physical-talisman',
      title: t('physical.talisman.title'),
      description: t('physical.talisman.desc'),
      priceCents: 3000,
      image: talismanImage,
    },
    {
      id: 'physical-crystal',
      title: t('physical.crystal.title'),
      description: t('physical.crystal.desc'),
      priceCents: 4000,
      image: crystalImage,
      badge: 'Premium',
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

        {/* Monthly Packages */}
        <section id="monthly" className="mb-20 scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-foreground">
            {t('products.monthly')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {monthlyPackages.map((product) => (
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

        {/* Physical Sets */}
        <section id="physical" className="scroll-mt-24">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-foreground">
            {t('products.physical')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {physicalSets.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Products;
