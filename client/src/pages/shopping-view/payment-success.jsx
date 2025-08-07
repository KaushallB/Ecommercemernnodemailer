import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

function PaymentSuccessPage() {
  const navigate = useNavigate();

  return (
    <Card className="p-10">
      <CardHeader className="p-0">
        <CardTitle className="text-4xl text-green-600">🌱 Payment Successful!</CardTitle>
        <p className="text-lg text-gray-600 mt-4">
          Thank you for choosing eco-friendly products! Your order helps make our planet greener.
        </p>
      </CardHeader>
      <Button className="mt-5 bg-green-600 hover:bg-green-700" onClick={() => navigate("/shop/account")}>
        View Orders
      </Button>
    </Card>
  );
}

export default PaymentSuccessPage;
