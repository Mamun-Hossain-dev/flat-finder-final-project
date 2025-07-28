import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface PaymentFormProps {
  listingType: string; // e.g., "normal_sell", "premium_rent"
  amount: number;
  userId: string;
  userInfo: { name: string; email: string; phone: string; address?: string; city?: string };
}

const PaymentForm = ({ listingType, amount, userId, userInfo }: PaymentFormProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      const res = await fetch('/api/payment/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: listingType,
          amount,
          userId,
          userInfo
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Payment initialization failed');
      }

      const { gatewayURL } = await res.json();
      window.location.href = gatewayURL;
    } catch (error: any) {
      console.error('Payment failed:', error);
      toast({
        title: "Payment Error",
        description: error.message || "Failed to initiate payment.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return (
    <Button 
      onClick={handlePayment}
      disabled={isProcessing}
    >
      {isProcessing ? 'Processing...' : `Pay ৳${amount}`}
    </Button>
  );
};

export default PaymentForm;
