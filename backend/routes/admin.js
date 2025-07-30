const express = require('express');
const router = express.Router();

// Admin dashboard routes
router.get('/dashboard/stats', (req, res) => {
  // Dashboard statistics
});

router.get('/dashboard/activity', (req, res) => {
  // Recent activity feed
});

router.get('/dashboard/revenue', (req, res) => {
  // Revenue chart data
});

module.exports = router;