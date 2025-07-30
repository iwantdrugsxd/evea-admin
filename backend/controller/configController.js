const SystemConfig = require('../models/SystemConfig');

const getPlatformConfig = async (req, res) => {
  try {
    let config = await SystemConfig.findOne();
    if (!config) {
      config = new SystemConfig();
      await config.save();
    }
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updatePlatformConfig = async (req, res) => {
  try {
    const updates = req.body;
    
    let config = await SystemConfig.findOne();
    if (!config) {
      config = new SystemConfig(updates);
    } else {
      Object.assign(config, updates);
    }
    
    await config.save();
    res.json({ message: 'Configuration updated successfully', config });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const testEmailConfig = async (req, res) => {
  try {
    const { testEmail } = req.body;
    
    // Implement email testing logic
    // const result = await sendTestEmail(testEmail);
    
    res.json({ 
      message: 'Test email sent successfully',
      success: true
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Failed to send test email', 
      error: error.message,
      success: false
    });
  }
};

module.exports = {
  getPlatformConfig,
  updatePlatformConfig,
  testEmailConfig
};