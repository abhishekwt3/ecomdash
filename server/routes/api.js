import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { getMainMetrics, getAdsMetrics, getWebsiteMetrics } from '../controllers/dashboardController.js';
import { getCosts, createCost, deleteCost } from '../controllers/costController.js';
import { connectMeta, getIntegrationStatus, disconnectIntegration } from '../controllers/integrationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Auth
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', protect, getMe);

// Dashboard Metrics (Protected)
router.get('/metrics', protect, getMainMetrics);
router.get('/metrics/ads', protect, getAdsMetrics);
router.get('/metrics/website', protect, getWebsiteMetrics);

// Costs (Protected)
router.get('/costs', protect, getCosts);
router.post('/costs', protect, createCost);
router.delete('/costs/:id', protect, deleteCost);

// Integrations
router.get('/integrations/status', protect, getIntegrationStatus);
router.post('/integrations/meta/connect', protect, connectMeta);
router.post('/integrations/:platform/disconnect', protect, disconnectIntegration);

// Stub for Shopify (to prevent 404s if frontend calls it)
router.post('/integrations/shopify/connect', protect, (req, res) => {
  res.json({ message: 'Shopify logic pending implementation' });
});

export default router;