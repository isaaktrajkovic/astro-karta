import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles, Star, ExternalLink, Share2, Copy } from 'lucide-react';
import OrderDialog from './OrderDialog';
import { getCompatibilityDescription } from '@/lib/compatibilityDescriptions';
import { toast } from 'sonner';

// Social media icons as simple SVG components
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
  </svg>
);

interface CompatibilityResultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sign1: { name: string; symbol: string };
  sign2: { name: string; symbol: string };
  compatibility: number;
  llmDescription?: string | null;
  isLoadingDescription?: boolean;
  llmResolved?: boolean;
  useLlm?: boolean;
}

const CompatibilityResultDialog = ({
  open,
  onOpenChange,
  sign1,
  sign2,
  compatibility,
  llmDescription,
  isLoadingDescription = false,
  llmResolved = true,
  useLlm = false,
}: CompatibilityResultDialogProps) => {
  const { t, language } = useLanguage();
  const [showProgress, setShowProgress] = useState(0);
  const [showUpsell, setShowUpsell] = useState(false);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [loadingDots, setLoadingDots] = useState(0);

  useEffect(() => {
    if (open) {
      setShowProgress(0);
      setShowUpsell(false);
      setLoadingDots(0);
      
      // Animate progress bar
      const timer = setTimeout(() => {
        setShowProgress(compatibility);
      }, 300);

      // Show upsell after delay
      const upsellTimer = setTimeout(() => {
        setShowUpsell(true);
      }, 2500);

      return () => {
        clearTimeout(timer);
        clearTimeout(upsellTimer);
      };
    }
  }, [open, compatibility]);

  useEffect(() => {
    if (!open || !isLoadingDescription || !useLlm) return undefined;
    const interval = setInterval(() => {
      setLoadingDots((prev) => (prev + 1) % 4);
    }, 450);
    return () => clearInterval(interval);
  }, [open, isLoadingDescription, useLlm]);

  const getProgressColor = () => {
    if (compatibility >= 80) return 'bg-green-500';
    if (compatibility >= 60) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  const getDescription = () => {
    if (llmDescription && llmDescription.trim()) {
      return llmDescription;
    }
    return getCompatibilityDescription(sign1.name, sign2.name, compatibility, language);
  };

  const getShareText = () => {
    const sign1Name = t(`zodiac.${sign1.name}`);
    const sign2Name = t(`zodiac.${sign2.name}`);
    return `${sign1.symbol} ${sign1Name} & ${sign2.symbol} ${sign2Name}: ${compatibility}% ${t('compatibility.result')}! ✨`;
  };

  const handleShare = async (platform: 'whatsapp' | 'x' | 'instagram' | 'tiktok' | 'copy') => {
    const shareText = getShareText();
    const shareUrl = window.location.origin + '/products';
    
    switch (platform) {
      case 'whatsapp':
        window.open(
          `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
          '_blank'
        );
        break;
      case 'x':
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
          '_blank',
          'width=600,height=400'
        );
        break;
      case 'instagram':
        // Instagram doesn't have direct share URL, copy to clipboard instead
        try {
          await navigator.clipboard.writeText(shareText + ' ' + shareUrl);
          toast.success(t('compatibility.share.instagramCopied') || 'Kopirano! Nalepite u Instagram Stories ili post.');
        } catch (err) {
          toast.error('Failed to copy');
        }
        break;
      case 'tiktok':
        // TikTok doesn't have direct share URL, copy to clipboard instead
        try {
          await navigator.clipboard.writeText(shareText + ' ' + shareUrl);
          toast.success(t('compatibility.share.tiktokCopied') || 'Kopirano! Nalepite u TikTok opis.');
        } catch (err) {
          toast.error('Failed to copy');
        }
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(shareText + ' ' + shareUrl);
          toast.success(t('compatibility.share.copied') || 'Kopirano u clipboard!');
        } catch (err) {
          toast.error('Failed to copy');
        }
        break;
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">
              {t('compatibility.result')}
            </DialogTitle>
          </DialogHeader>

          <div className="py-6">
            {/* Zodiac Signs Display */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="text-center">
                <div className="text-5xl mb-2 animate-fade-in">{sign1.symbol}</div>
                <p className="text-sm text-muted-foreground capitalize">
                  {t(`zodiac.${sign1.name}`)}
                </p>
              </div>
              
              <Heart className="h-8 w-8 text-accent animate-pulse" />
              
              <div className="text-center">
                <div className="text-5xl mb-2 animate-fade-in">{sign2.symbol}</div>
                <p className="text-sm text-muted-foreground capitalize">
                  {t(`zodiac.${sign2.name}`)}
                </p>
              </div>
            </div>

            {/* Compatibility Score */}
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-foreground mb-4">
                {showProgress}%
              </div>
              <div className="relative w-full h-4 bg-secondary rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ease-out rounded-full ${getProgressColor()}`}
                  style={{ width: `${showProgress}%` }}
                />
              </div>
            </div>

            {/* Description */}
            {useLlm && !llmResolved ? (
              <div className="mb-6 flex flex-col items-center gap-3 text-sm text-muted-foreground">
                <div className="relative h-16 w-16">
                  <div className="absolute inset-0 rounded-full stars-bg opacity-70" />
                  <div className="absolute inset-2 rounded-full border border-primary/20 orbit-slow">
                    <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary)/0.6)]" />
                  </div>
                  <div className="absolute inset-5 rounded-full border border-accent/40 orbit-fast">
                    <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-accent shadow-[0_0_10px_hsl(var(--accent)/0.6)]" />
                  </div>
                  <div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground/80 animate-pulse" />
                </div>
                <div className="text-center">
                  <div className="font-medium text-foreground">
                    {t('compatibility.loadingTitle')}{'.'.repeat(loadingDots)}
                  </div>
                  <div className="text-xs text-muted-foreground">{t('compatibility.loadingSubtitle')}</div>
                </div>
              </div>
            ) : (
              <p className="text-center text-muted-foreground mb-6">
                {getDescription()}
              </p>
            )}

            {/* Share buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
              <span className="text-sm text-muted-foreground mr-2">
                <Share2 className="h-4 w-4 inline mr-1" />
                {t('compatibility.share.title') || 'Podeli:'}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare('whatsapp')}
                className="gap-1"
              >
                <WhatsAppIcon />
                <span className="hidden sm:inline">WhatsApp</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare('x')}
                className="gap-1"
              >
                <XIcon />
                <span className="hidden sm:inline">X</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare('instagram')}
                className="gap-1"
              >
                <InstagramIcon />
                <span className="hidden sm:inline">Instagram</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare('tiktok')}
                className="gap-1"
              >
                <TikTokIcon />
                <span className="hidden sm:inline">TikTok</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare('copy')}
                className="gap-1"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            {/* Sparkles decoration */}
            <div className="flex justify-center gap-2 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i} 
                  className={`h-4 w-4 ${i < Math.floor(compatibility / 20) ? 'text-primary fill-primary' : 'text-muted'}`}
                />
              ))}
            </div>

            {/* Upsell Section */}
            {showUpsell && (
              <div className="animate-fade-in bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4 border border-primary/20">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      {t('compatibility.upsell.title')}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {t('compatibility.upsell.text')}
                    </p>
                    <Button 
                      variant="cosmic" 
                      size="sm"
                      onClick={() => {
                        onOpenChange(false);
                        setShowOrderDialog(true);
                      }}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      {t('compatibility.upsell.cta')} - 10€
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Order Dialog for Love Analysis */}
      <OrderDialog
        open={showOrderDialog}
        onOpenChange={setShowOrderDialog}
        productId="report-love"
        productName={t('reports.love.title')}
      />
    </>
  );
};

export default CompatibilityResultDialog;
