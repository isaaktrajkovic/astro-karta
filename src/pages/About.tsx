import { Sparkles, Star, Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import heroImage from '@/assets/hero-zodiac.jpg';

const About = () => {
  const { language, t } = useLanguage();

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">{t('about.title')}</span>
            </h1>
          </div>

          <div className="relative rounded-2xl overflow-hidden mb-12">
            <img
              src={heroImage}
              alt="About us"
              className="w-full h-64 md:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          </div>

          <div className="prose prose-invert max-w-none">
            <p className="text-lg text-muted-foreground mb-8">
              {t('about.text')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12">
              {[
                {
                  icon: Sparkles,
                  titleSr: 'Iskusni astrolozi',
                  titleEn: 'Experienced Astrologers',
                  descSr: 'Naš tim čine profesionalni astrolozi sa višegodišnjim iskustvom.',
                  descEn: 'Our team consists of professional astrologers with years of experience.',
                },
                {
                  icon: Star,
                  titleSr: 'Personalizovani pristup',
                  titleEn: 'Personalized Approach',
                  descSr: 'Svaki izveštaj je kreiran posebno za vas na osnovu vaše natalne karte.',
                  descEn: 'Every report is created specifically for you based on your natal chart.',
                },
                {
                  icon: Heart,
                  titleSr: 'Posvećenost kvalitetu',
                  titleEn: 'Quality Commitment',
                  descSr: 'Posvećeni smo pružanju tačnih i korisnih astroloških uvida.',
                  descEn: 'We are committed to providing accurate and useful astrological insights.',
                },
              ].map((item, index) => (
                <div key={index} className="text-center p-6 bg-card rounded-xl border border-border cosmic-border">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <item.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {language === 'sr' ? item.titleSr : item.titleEn}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'sr' ? item.descSr : item.descEn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
