import MetricSnapshot from '../models/MetricSnapshot.js';

// Helper to generate mock data if no real data exists
const generateMockMetrics = (period) => {
  return {
    revenue: { value: 428500, change: 12.5, history: [45000, 52000, 48000, 61000, 55000, 67000, 72000] },
    profit: { value: 119500, change: 8.2, history: [12000, 15000, 13500, 18000, 16000, 21000, 24000] },
    orders: { value: 3847, change: 15.3 },
    roi: { value: 42.8, change: 5.1 },
    conversionRate: { value: 3.2, change: 12.8 },
    aov: { value: 114.28, change: 7.5 }
  };
};

export const getMainMetrics = async (req, res) => {
  const { workspaceId, period = '30d' } = req.query;
  
  // In a real scenario, we fetch from MetricSnapshot DB
  // const metrics = await MetricSnapshot.find({ workspace: workspaceId, platform: 'summary' })...
  
  // For now, return the structure the frontend expects
  const mockData = generateMockMetrics(period);
  res.json(mockData);
};

export const getAdsMetrics = async (req, res) => {
  const { workspaceId } = req.query;
  
  // Mock Ads Data
  res.json({
    roas: { value: 3.8, change: 12.4 },
    cac: { value: 31.50, change: -8.2 },
    spend: { value: 55000, change: 5.8 },
    platforms: [
      { name: 'Meta', spend: 25000, roas: 3.8 },
      { name: 'Google', spend: 18000, roas: 4.0 },
      { name: 'TikTok', spend: 8000, roas: 3.0 }
    ]
  });
};

export const getWebsiteMetrics = async (req, res) => {
  const { workspaceId } = req.query;
  
  res.json({
    sessions: 125000,
    bounceRate: 42.5,
    returningRate: 28.5,
    funnel: [
      { stage: "Sessions", value: 125000 },
      { stage: "Product Views", value: 87500 },
      { stage: "Add to Cart", value: 11250 },
      { stage: "Checkout", value: 6875 },
      { stage: "Purchase", value: 3750 }
    ]
  });
};