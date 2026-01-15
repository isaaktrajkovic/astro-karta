import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import OrderForm from '@/components/OrderForm';
import { useLanguage } from '@/contexts/LanguageContext';

interface OrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  productName: string;
  priceCents: number;
  isConsultation?: boolean;
}

const OrderDialog = ({ open, onOpenChange, productId, productName, priceCents, isConsultation = false }: OrderDialogProps) => {
  const { t } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground text-xl">{t('form.title')}</DialogTitle>
          <p className="text-sm text-muted-foreground">{productName}</p>
        </DialogHeader>
        <OrderForm 
          productId={productId} 
          productName={productName} 
          basePriceCents={priceCents}
          isConsultation={isConsultation}
          onSuccess={() => onOpenChange(false)} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default OrderDialog;
