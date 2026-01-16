import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, FileText, MessageCircle, Calendar, Star, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import heroImage from '@/assets/hero-zodiac.jpg';
import reportImage from '@/assets/astro-report.jpg';
import consultationImage from '@/assets/consultation.jpg';

const Index = () => {
  const { t } = useLanguage();

  const productGroups = [
    {
      id: 'monthly',
      title: t('products.monthly'),
      description: t('products.monthly.desc'),
      icon: Calendar,
      image: reportImage,
      color: 'from-primary to-primary/50',
    },
    {
      id: 'reports',
      title: t('products.reports'),
      description: t('products.reports.desc'),
      icon: FileText,
      image: reportImage,
      color: 'from-accent to-accent/50',
    },
    {
      id: 'consultations',
      title: t('products.consultations'),
      description: t('products.consultations.desc'),
      icon: MessageCircle,
      image: consultationImage,
      color: 'from-primary to-accent',
    },
  ];

  const howItWorks = [
    {
      icon: Sparkles,
      title: t('how.step1.title'),
      description: t('how.step1.desc'),
    },
    {
      icon: Star,
      title: t('how.step2.title'),
      description: t('how.step2.desc'),
    },
    {
      icon: Heart,
      title: t('how.step3.title'),
      description: t('how.step3.desc'),
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Zodiac wheel"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
        </div>

        {/* Stars overlay */}
        <div className="absolute inset-0 stars-bg opacity-50" />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center pt-20">
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold float-animation">
              <span className="text-gradient">{t('hero.title')}</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button asChild variant="cosmic" size="xl">
                <Link to="/products">
                  {t('hero.cta')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="cosmicOutline" size="lg">
                <Link to="/blog">{t('nav.blog')}</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-primary/50 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-primary rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-card/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gradient">
            {t('how.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {howItWorks.map((step, index) => (
              <div
                key={index}
                className="text-center space-y-4 group"
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 cosmic-glow-sm">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="w-8 h-8 mx-auto rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Groups */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            <span className="text-gradient">{t('nav.products')}</span>
          </h2>
          <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {productGroups.map((group) => (
              <Link
                key={group.id}
                to={`/products#${group.id}`}
                className="group relative h-80 rounded-2xl overflow-hidden cosmic-border hover-glow"
              >
                <img
                  src={group.image}
                  alt={group.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${group.color} flex items-center justify-center`}>
                      <group.icon className="w-6 h-6 text-foreground" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {group.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">{group.description}</p>
                  <span className="text-primary font-medium flex items-center gap-2 group-hover:gap-4 transition-all">
                    {t('products.viewAll')}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-card/50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gradient">
              {t('hero.title')}
            </h2>
            <p className="text-lg text-muted-foreground">
              {t('hero.subtitle')}
            </p>
            <Button asChild variant="cosmic" size="xl" className="pulse-glow">
              <Link to="/products">
                {t('hero.cta')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
