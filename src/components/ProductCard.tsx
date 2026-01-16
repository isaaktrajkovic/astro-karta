import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import OrderDialog from '@/components/OrderDialog';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  id: string;
  title: string;
  description: string;
  priceCents: number;
  image: string;
  badge?: string;
  isConsultation?: boolean;
}

const ProductCard = ({ id, title, description, priceCents, image, badge, isConsultation = false }: ProductCardProps) => {
  const { t } = useLanguage();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleOrder = (event?: React.MouseEvent<HTMLButtonElement>) => {
    event?.stopPropagation();
    setIsDialogOpen(true);
  };

  const handleToggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggleExpand();
    }
  };

  return (
    <>
      <div
        className={`group relative bg-card rounded-xl overflow-hidden border border-border hover-glow transition-all cursor-pointer ${isExpanded ? 'shadow-lg' : ''}`}
        onClick={handleToggleExpand}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
      >
        {badge && (
          <div className="absolute top-4 right-4 z-10 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-medium">
            {badge}
          </div>
        )}
        
        <div className="aspect-[4/3] overflow-hidden relative">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        </div>
        
        <div className="p-6 space-y-4 relative">
          <div>
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className={`text-sm text-muted-foreground mt-2 transition-all ${isExpanded ? 'line-clamp-none' : 'line-clamp-2'}`}>
              {description}
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">{formatPrice(priceCents)}</span>
            <Button 
              type="button"
              variant="cosmic" 
              size="sm"
              onClick={handleOrder}
            >
              {t('products.order')}
            </Button>
          </div>
        </div>
      </div>

      <OrderDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        productId={id}
        productName={title}
        priceCents={priceCents}
        isConsultation={isConsultation}
      />
    </>
  );
};

export default ProductCard;
