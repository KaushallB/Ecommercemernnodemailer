import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { resetCartItems } from "@/store/shop/cart-slice";
import { Navigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL, esewaPaymentData, esewaUrl } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymemntStart] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("esewa");
  const [deliveryCharge, setDeliveryCharge] = useState(50);
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState(1000);
  const dispatch = useDispatch();
  const { toast } = useToast();

  // console.log(currentSelectedAddress, "cartItems");

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  // Calculate final delivery charge (could be 0 if free delivery applies)
  const finalDeliveryCharge = totalCartAmount >= freeDeliveryThreshold ? 0 : deliveryCharge;
  const finalTotalAmount = totalCartAmount + finalDeliveryCharge;

  // Fetch delivery charges from settings
  useEffect(() => {
    const fetchDeliveryCharges = async () => {
      try {
        const response = await axios.post("http://localhost:5000/api/admin/settings/calculate-delivery", {
          totalAmount: totalCartAmount,
          area: currentSelectedAddress?.city || ""
        });
        
        if (response.data.success) {
          setDeliveryCharge(response.data.data.baseCharge);
          setFreeDeliveryThreshold(response.data.data.freeDeliveryThreshold);
        }
      } catch (error) {
        // console.log("Error fetching delivery charges:", error);
        // Keep default values if API fails
      }
    };

    if (totalCartAmount > 0) {
      fetchDeliveryCharges();
    }
  }, [totalCartAmount, currentSelectedAddress]);

  function handleInitiatePayment() {
    if (cartItems.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed",
        variant: "destructive",
      });
      return;
    }
    
    if (currentSelectedAddress === null) {
      toast({
        title: "Please select one address to proceed.",
        variant: "destructive",
      });
      return;
    }

    if (selectedPaymentMethod === "cod") {
      handleCashOnDeliveryOrder();
    } else if (selectedPaymentMethod === "esewa") {
      handleEsewaPayment();
    }
  }

  function handleCashOnDeliveryOrder() {
    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "cod",
      paymentStatus: "pending",
      totalAmount: finalTotalAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    dispatch(createNewOrder(orderData)).then((data) => {
      if (data?.payload?.success) {
        setCurrentSelectedAddress(null);
        setSelectedPaymentMethod("esewa");
        dispatch(resetCartItems());
        toast({
          title: "Order placed successfully!",
          description: "You will receive an email confirmation shortly. Your order is pending admin verification.",
        });
      } else {
        toast({
          title: "Failed to place order",
          variant: "destructive",
        });
      }
    });
  }

  function handleEsewaPayment() {
    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "esewa",
      paymentStatus: "pending",
      totalAmount: finalTotalAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    dispatch(createNewOrder(orderData)).then((data) => {
      // console.log(data, "esewa payment");
      if (data?.payload?.success) {
        setIsPaymemntStart(true);
        setCurrentSelectedAddress(null);
        setSelectedPaymentMethod("esewa");
      } else {
        setIsPaymemntStart(false);
        toast({
          title: "Failed to create order",
          variant: "destructive",
        });
      }
    });
  }

  // Handle eSewa payment redirection
  useEffect(() => {
    if (esewaPaymentData && esewaUrl) {
      // console.log("eSewa payment data received:", esewaPaymentData);
      // console.log("eSewa URL:", esewaUrl);
      
      // Create a form and submit it to eSewa
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = esewaUrl;

      Object.keys(esewaPaymentData).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = esewaPaymentData[key];
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
      
      // Clean up the form
      document.body.removeChild(form);
    }
  }, [esewaPaymentData, esewaUrl]);

  // Handle PayPal approval URL redirection
  useEffect(() => {
    if (approvalURL) {
      window.location.href = approvalURL;
    }
  }, [approvalURL]);

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.map((item) => (
                <UserCartItemsContent key={item.productId} cartItem={item} />
              ))
            : null}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Subtotal</span>
              <span className="font-bold">Rs {totalCartAmount}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">
                Delivery Charges
                {finalDeliveryCharge === 0 && totalCartAmount >= freeDeliveryThreshold && (
                  <span className="text-green-600 text-sm ml-1">(Free!)</span>
                )}
              </span>
              <span className={`font-medium ${finalDeliveryCharge === 0 ? 'text-green-600 line-through' : ''}`}>
                Rs {finalDeliveryCharge === 0 ? deliveryCharge : finalDeliveryCharge}
              </span>
            </div>
            {totalCartAmount < freeDeliveryThreshold && (
              <div className="text-sm text-gray-600">
                Add Rs {freeDeliveryThreshold - totalCartAmount} more for free delivery!
              </div>
            )}
            <div className="border-t pt-4">
              <div className="flex justify-between">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-lg">Rs {finalTotalAmount}</span>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="mt-6 space-y-4">
            <h3 className="font-semibold text-lg">Payment Method</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="esewa"
                  name="paymentMethod"
                  value="esewa"
                  checked={selectedPaymentMethod === "esewa"}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-red-400 focus:ring-red-400"
                />
                <label htmlFor="esewa" className="flex items-center space-x-2 cursor-pointer">
                  <span>eSewa Digital Payment</span>
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="cod"
                  name="paymentMethod"
                  value="cod"
                  checked={selectedPaymentMethod === "cod"}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-red-400 focus:ring-red-400"
                />
                <label htmlFor="cod" className="flex items-center space-x-2 cursor-pointer">
                  <span>Cash on Delivery (COD)</span>
                </label>
              </div>
            </div>
          </div>

          <div className="mt-6 w-full">
            <Button 
              onClick={handleInitiatePayment} 
              className="w-full bg-red-400 hover:bg-red-500 text-white"
              disabled={isPaymentStart}
            >
              {isPaymentStart
                ? "Processing Payment..."
                : selectedPaymentMethod === "esewa"
                ? "Checkout with eSewa"
                : "Place Order (Cash on Delivery)"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
