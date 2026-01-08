import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import OrderDialog from '@/components/OrderDialog';

interface ProductCardProps {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  badge?: string;
  isConsultation?: boolean;
}

const ProductCard = ({ id, title, description, price, image, badge, isConsultation = false }: ProductCardProps) => {
  const { t } = useLanguage();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleOrder = async () => {
    setIsDialogOpen(true);
  };

  return (
    <>
      <div className="group relative bg-card rounded-xl overflow-hidden border border-border hover-glow">
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
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {description}
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">{price}</span>
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
        isConsultation={isConsultation}
      />
    </>
  );
};

export default ProductCard;
