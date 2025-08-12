import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

function PaymentSuccessPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Show success toast when component mounts
    toast({
      title: "🎉 Order Confirmed Successfully!",
      description: "Your payment has been processed and your order has been confirmed. A confirmation email has been sent to you.",
      variant: "default",
      className: "bg-green-50 border-green-200 text-green-800",
    });

    // Auto redirect to home after 10 seconds
    const timer = setTimeout(() => {
      navigate("/shop/home");
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="p-10 max-w-lg text-center">
        <CardHeader className="p-0">
          <div className="text-6xl mb-4">🌱</div>
          <CardTitle className="text-4xl text-green-600 mb-4">
            Payment Successful!
          </CardTitle>
          <p className="text-lg text-gray-600 mb-4">
            Thank you for choosing eco-friendly products! Your order has been confirmed and you will receive an email confirmation shortly.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Your order helps make our planet greener. 🌍
          </p>
        </CardHeader>
        
        <div className="space-y-3">
          <Button 
            className="w-full bg-green-600 hover:bg-green-700" 
            onClick={() => navigate("/shop/account")}
          >
            View My Orders
          </Button>
          <Button 
            variant="outline" 
            className="w-full border-green-600 text-green-600 hover:bg-green-50" 
            onClick={() => navigate("/shop/home")}
          >
            Continue Shopping
          </Button>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          You will be automatically redirected to home page in a few seconds...
        </p>
      </Card>
    </div>
  );
}

export default PaymentSuccessPage;
