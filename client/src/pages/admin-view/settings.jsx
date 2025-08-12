import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

function AdminSettings() {
  const [settings, setSettings] = useState({
    deliveryCharges: 50,
    freeDeliveryThreshold: 1000,
    businessHours: {
      open: "09:00",
      close: "18:00"
    },
    notifications: {
      emailEnabled: true,
      smsEnabled: false
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = JSON.parse(sessionStorage.getItem("token"));
      const response = await axios.get("http://localhost:5000/api/admin/settings/get", {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.data.success) {
        setSettings(response.data.data);
      }
    } catch (error) {
      console.error("Settings fetch error:", error);
      toast({
        title: "Error fetching settings",
        variant: "destructive",
      });
    }
  };

  const handleUpdateSettings = async () => {
    setIsLoading(true);
    try {
      const token = JSON.parse(sessionStorage.getItem("token"));
      
      // Ensure numeric values are properly set
      const cleanSettings = {
        ...settings,
        deliveryCharges: Number(settings.deliveryCharges) || 50,
        freeDeliveryThreshold: Number(settings.freeDeliveryThreshold) || 1000
      };

      const response = await axios.put(
        "http://localhost:5000/api/admin/settings/update",
        cleanSettings,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        toast({
          title: "Settings updated successfully!",
        });
      }
    } catch (error) {
      console.error("Settings update error:", error);
      toast({
        title: "Error updating settings",
        description: error.response?.data?.message || "Failed to update settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    // Handle numeric fields properly
    if (field === 'deliveryCharges' || field === 'freeDeliveryThreshold') {
      const numValue = value === '' ? '' : Number(value);
      setSettings(prev => ({
        ...prev,
        [field]: numValue
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleNestedInputChange = (parent, key, value) => {
    setSettings(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [key]: value
      }
    }));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <div className="grid gap-6">
        {/* Delivery Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Delivery Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="deliveryCharges">Default Delivery Charges (Rs)</Label>
                <Input
                  id="deliveryCharges"
                  type="number"
                  value={settings.deliveryCharges || 50}
                  onChange={(e) => handleInputChange("deliveryCharges", e.target.value)}
                  placeholder="50"
                />
              </div>
              <div>
                <Label htmlFor="freeDeliveryThreshold">Free Delivery Upto (Rs)</Label>
                <Input
                  id="freeDeliveryThreshold"
                  type="number"
                  value={settings.freeDeliveryThreshold || 1000}
                  onChange={(e) => handleInputChange("freeDeliveryThreshold", e.target.value)}
                  placeholder="1000"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Orders above this amount get free delivery
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Hours */}
        <Card>
          <CardHeader>
            <CardTitle>Business Hours</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="openTime">Opening Time</Label>
                <Input
                  id="openTime"
                  type="time"
                  value={settings.businessHours?.open || "09:00"}
                  onChange={(e) => handleNestedInputChange("businessHours", "open", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="closeTime">Closing Time</Label>
                <Input
                  id="closeTime"
                  type="time"
                  value={settings.businessHours?.close || "18:00"}
                  onChange={(e) => handleNestedInputChange("businessHours", "close", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="emailEnabled"
                checked={settings.notifications?.emailEnabled || false}
                onChange={(e) => handleNestedInputChange("notifications", "emailEnabled", e.target.checked)}
                className="w-4 h-4 text-red-400 focus:ring-red-400"
              />
              <Label htmlFor="emailEnabled">Enable Email Notifications</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="smsEnabled"
                checked={settings.notifications?.smsEnabled || false}
                onChange={(e) => handleNestedInputChange("notifications", "smsEnabled", e.target.checked)}
                className="w-4 h-4 text-red-400 focus:ring-red-400"
              />
              <Label htmlFor="smsEnabled">Enable SMS Notifications (Coming Soon)</Label>
            </div>
          </CardContent>
        </Card>



        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleUpdateSettings}
            disabled={isLoading}
            className="bg-red-400 hover:bg-red-500 text-white"
          >
            {isLoading ? "Updating..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AdminSettings;
