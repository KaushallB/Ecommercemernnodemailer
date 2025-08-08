import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function EsewaCancelPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear the current order ID from session storage
    sessionStorage.removeItem("currentOrderId");
  }, []);

  const handleRetryPayment = () => {
    navigate("/shop/checkout");
  };

  const handleGoHome = () => {
    navigate("/shop/home");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-red-600 text-2xl">❌</span>
          </div>
          <CardTitle className="text-red-600 mb-2">Payment Failed</CardTitle>
          <p className="text-gray-600 text-sm mb-6">
            Your eSewa payment was not completed. Please try again or use a different payment method.
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={handleRetryPayment}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Try Again
            </Button>
            <Button 
              onClick={handleGoHome}
              variant="outline"
              className="w-full"
            >
              Back to Home
            </Button>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}

export default EsewaCancelPage;
