const Settings = require("../../models/Settings");

// Get current settings
const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    // If no settings exist, create default ones
    if (!settings) {
      settings = new Settings({
        deliveryCharges: 50,
        freeDeliveryThreshold: 1000,
      });
      await settings.save();
    }

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error fetching settings",
    });
  }
};

// Update settings
const updateSettings = async (req, res) => {
  try {
    const {
      deliveryCharges,
      freeDeliveryThreshold,
      businessHours,
      deliveryAreas,
      notifications
    } = req.body;

    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = new Settings();
    }

    // Update fields
    if (deliveryCharges !== undefined) settings.deliveryCharges = deliveryCharges;
    if (freeDeliveryThreshold !== undefined) settings.freeDeliveryThreshold = freeDeliveryThreshold;
    if (businessHours) settings.businessHours = businessHours;
    if (deliveryAreas) settings.deliveryAreas = deliveryAreas;
    if (notifications) settings.notifications = notifications;
    
    settings.updatedAt = new Date();
    settings.updatedBy = req.user?.id;

    await settings.save();

    res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      data: settings,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error updating settings",
    });
  }
};

// Get delivery charge calculation
const calculateDeliveryCharge = async (req, res) => {
  try {
    const { totalAmount, area } = req.body;
    
    const settings = await Settings.findOne();
    const baseDeliveryCharge = settings?.deliveryCharges || 50;
    const freeDeliveryThreshold = settings?.freeDeliveryThreshold || 1000;
    
    let deliveryCharge = baseDeliveryCharge;
    
    // Check if eligible for free delivery
    if (totalAmount >= freeDeliveryThreshold) {
      deliveryCharge = 0;
    }
    
    // Add area-specific charges if applicable
    if (area && settings?.deliveryAreas) {
      const areaCharge = settings.deliveryAreas.find(a => a.area.toLowerCase() === area.toLowerCase());
      if (areaCharge) {
        deliveryCharge += areaCharge.additionalCharge;
      }
    }

    res.status(200).json({
      success: true,
      data: {
        deliveryCharge,
        freeDeliveryThreshold,
        isFreeDelivery: totalAmount >= freeDeliveryThreshold,
        baseCharge: baseDeliveryCharge,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error calculating delivery charge",
    });
  }
};

module.exports = {
  getSettings,
  updateSettings,
  calculateDeliveryCharge,
};
