import { useState, useEffect } from "react";
import { CheckCircle, Clock, Package, Truck, XCircle } from "lucide-react";

function OrderStatusTracker({ orderStatus }) {
  const statusSteps = [
    {
      key: "pending",
      label: "Order Placed",
      icon: <Clock className="w-5 h-5" />,
      description: "Your order has been placed and is awaiting verification",
      color: "text-yellow-600"
    },
    {
      key: "confirmed",
      label: "Confirmed",
      icon: <CheckCircle className="w-5 h-5" />,
      description: "Your order has been confirmed by our admin",
      color: "text-green-600"
    },
    {
      key: "inProcess",
      label: "Processing",
      icon: <Package className="w-5 h-5" />,
      description: "Your order is being prepared for shipping",
      color: "text-blue-600"
    },
    {
      key: "inShipping",
      label: "Shipped",
      icon: <Truck className="w-5 h-5" />,
      description: "Your order is on its way to you",
      color: "text-purple-600"
    },
    {
      key: "delivered",
      label: "Delivered",
      icon: <CheckCircle className="w-5 h-5" />,
      description: "Your order has been delivered successfully",
      color: "text-green-700"
    }
  ];

  const rejectedStatus = {
    key: "rejected",
    label: "Cancelled",
    icon: <XCircle className="w-5 h-5" />,
    description: "Your order has been cancelled",
    color: "text-red-600"
  };

  const getCurrentStepIndex = () => {
    if (orderStatus === "rejected") return -1;
    return statusSteps.findIndex(step => step.key === orderStatus);
  };

  const currentStepIndex = getCurrentStepIndex();
  const isRejected = orderStatus === "rejected";

  if (isRejected) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <div className="text-red-600">
            {rejectedStatus.icon}
          </div>
          <div>
            <h3 className="font-semibold text-red-800">{rejectedStatus.label}</h3>
            <p className="text-red-600 text-sm">{rejectedStatus.description}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="font-semibold text-lg mb-4">Order Status</h3>
      
      <div className="space-y-4">
        {statusSteps.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;
          
          return (
            <div key={step.key} className="flex items-start space-x-3">
              <div className={`flex-shrink-0 ${
                isCompleted ? step.color : "text-gray-400"
              }`}>
                {step.icon}
              </div>
              
              <div className="flex-1">
                <div className={`font-medium ${
                  isCompleted ? "text-gray-900" : "text-gray-500"
                }`}>
                  {step.label}
                  {isCurrent && (
                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      Current
                    </span>
                  )}
                </div>
                <div className={`text-sm ${
                  isCompleted ? "text-gray-600" : "text-gray-400"
                }`}>
                  {step.description}
                </div>
              </div>
              
              <div className={`w-2 h-2 rounded-full ${
                isCompleted ? "bg-green-500" : "bg-gray-300"
              }`} />
            </div>
          );
        })}
      </div>
      
      {currentStepIndex === 0 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-800 text-sm">
            <strong>Note:</strong> Your order is currently pending admin verification. 
            You will receive an email notification once the status is updated.
          </p>
        </div>
      )}
    </div>
  );
}

export default OrderStatusTracker;
