import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Upload, Palette, ImageIcon } from "lucide-react";
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
    },
    branding: {
      logo: "/assets/logo.png",
      siteName: "EcoShop",
      primaryColor: "#ef4444",
      secondaryColor: "#dc2626",
      accentColor: "#fecaca"
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const logoInputRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/admin/settings/get");
      if (response.data.success) {
        setSettings(response.data.data);
      }
    } catch (error) {
      toast({
        title: "Error fetching settings",
        variant: "destructive",
      });
    }
  };

  const handleUpdateSettings = async () => {
    setIsLoading(true);
    try {
      const response = await axios.put(
        "http://localhost:5000/api/admin/settings/update",
        settings
      );
      
      if (response.data.success) {
        toast({
          title: "Settings updated successfully!",
        });
      }
    } catch (error) {
      toast({
        title: "Error updating settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
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

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 2MB",
          variant: "destructive",
        });
        return;
      }
      
      setLogoFile(file);
      const previewUrl = URL.createObjectURL(file);
      handleNestedInputChange("branding", "logo", previewUrl);
    }
  };

  const predefinedColorSchemes = [
    {
      name: "Red (Current)",
      primary: "#ef4444",
      secondary: "#dc2626",
      accent: "#fecaca"
    },
    {
      name: "Green Eco",
      primary: "#059669",
      secondary: "#047857",
      accent: "#bbf7d0"
    },
    {
      name: "Blue Ocean",
      primary: "#3b82f6",
      secondary: "#2563eb",
      accent: "#bfdbfe"
    },
    {
      name: "Purple Modern",
      primary: "#8b5cf6",
      secondary: "#7c3aed",
      accent: "#ddd6fe"
    },
    {
      name: "Orange Sunset",
      primary: "#f97316",
      secondary: "#ea580c",
      accent: "#fed7aa"
    }
  ];

  const applyColorScheme = (scheme) => {
    setSettings(prev => ({
      ...prev,
      branding: {
        ...prev.branding,
        primaryColor: scheme.primary,
        secondaryColor: scheme.secondary,
        accentColor: scheme.accent
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
                  value={settings.deliveryCharges}
                  onChange={(e) => handleInputChange("deliveryCharges", parseInt(e.target.value))}
                  placeholder="50"
                />
              </div>
              <div>
                <Label htmlFor="freeDeliveryThreshold">Free Delivery Upto (Rs)</Label>
                <Input
                  id="freeDeliveryThreshold"
                  type="number"
                  value={settings.freeDeliveryThreshold}
                  onChange={(e) => handleInputChange("freeDeliveryThreshold", parseInt(e.target.value))}
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

        {/* Branding Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Branding & Theme
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Logo Upload */}
            <div className="space-y-2">
              <Label htmlFor="logo">Company Logo</Label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                  {settings.branding?.logo ? (
                    <img 
                      src={settings.branding.logo} 
                      alt="Logo" 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => logoInputRef.current?.click()}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Logo
                  </Button>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <p className="text-xs text-gray-500">Max size: 2MB</p>
                </div>
              </div>
            </div>

            {/* Site Name */}
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                type="text"
                value={settings.branding?.siteName || ""}
                onChange={(e) => handleNestedInputChange("branding", "siteName", e.target.value)}
                placeholder="Your store name"
              />
            </div>

            {/* Color Schemes */}
            <div className="space-y-4">
              <Label>Color Theme</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {predefinedColorSchemes.map((scheme, index) => (
                  <div
                    key={index}
                    onClick={() => applyColorScheme(scheme)}
                    className="p-3 border rounded-lg cursor-pointer hover:shadow-md transition-all"
                    style={{
                      borderColor: scheme.primary,
                      backgroundColor: scheme.accent + '20'
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{scheme.name}</span>
                      <div className="flex gap-1">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: scheme.primary }}
                        ></div>
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: scheme.secondary }}
                        ></div>
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: scheme.accent }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Colors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={settings.branding?.primaryColor || "#ef4444"}
                    onChange={(e) => handleNestedInputChange("branding", "primaryColor", e.target.value)}
                    className="w-12 h-10 p-1 border rounded"
                  />
                  <Input
                    type="text"
                    value={settings.branding?.primaryColor || "#ef4444"}
                    onChange={(e) => handleNestedInputChange("branding", "primaryColor", e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondaryColor"
                    type="color"
                    value={settings.branding?.secondaryColor || "#dc2626"}
                    onChange={(e) => handleNestedInputChange("branding", "secondaryColor", e.target.value)}
                    className="w-12 h-10 p-1 border rounded"
                  />
                  <Input
                    type="text"
                    value={settings.branding?.secondaryColor || "#dc2626"}
                    onChange={(e) => handleNestedInputChange("branding", "secondaryColor", e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="accentColor">Accent Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="accentColor"
                    type="color"
                    value={settings.branding?.accentColor || "#fecaca"}
                    onChange={(e) => handleNestedInputChange("branding", "accentColor", e.target.value)}
                    className="w-12 h-10 p-1 border rounded"
                  />
                  <Input
                    type="text"
                    value={settings.branding?.accentColor || "#fecaca"}
                    onChange={(e) => handleNestedInputChange("branding", "accentColor", e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            {/* Color Preview */}
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="p-4 border rounded-lg" style={{ backgroundColor: settings.branding?.accentColor + '40' }}>
                <div className="flex gap-3">
                  <Button 
                    style={{ 
                      backgroundColor: settings.branding?.primaryColor,
                      borderColor: settings.branding?.primaryColor 
                    }}
                    className="text-white"
                  >
                    Primary Button
                  </Button>
                  <Button 
                    variant="outline"
                    style={{ 
                      borderColor: settings.branding?.secondaryColor,
                      color: settings.branding?.secondaryColor 
                    }}
                  >
                    Secondary Button
                  </Button>
                </div>
              </div>
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
