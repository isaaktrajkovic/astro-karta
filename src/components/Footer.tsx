import { Link } from 'react-router-dom';
import { Sparkles, Instagram, Facebook, Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold text-gradient">AstroKarta</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              {t('about.text').slice(0, 100)}...
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Links</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {t('nav.home')}
              </Link>
              <Link to="/products" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {t('nav.products')}
              </Link>
              <Link to="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {t('nav.blog')}
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Legal</h4>
            <div className="flex flex-col gap-2">
              <Link to="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {t('footer.faq')}
              </Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {t('footer.terms')}
              </Link>
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                {t('footer.privacy')}
              </Link>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">{t('footer.social')}</h4>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="mailto:info@astrokarta.com"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all duration-300"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AstroKarta. {t('footer.rights')}.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
