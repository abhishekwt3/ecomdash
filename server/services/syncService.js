import Integration from '../models/Integration.js';
import MetricSnapshot from '../models/MetricSnapshot.js';
import { decrypt } from '../lib/encryption.js';
import * as metaService from './metaService.js';

/**
 * Syncs data for a specific integration record
 */
export const syncIntegration = async (integration) => {
  if (integration.platform === 'meta-ads') {
    await syncMetaAds(integration);
  }
  // Add shopify/google syncs here later
};

/**
 * Sync logic specifically for Meta Ads
 */
const syncMetaAds = async (integration) => {
  console.log(`🔄 Syncing Meta Ads for Workspace: ${integration.workspace}`);
  
  try {
    // 1. Decrypt the Access Token
    const accessToken = decrypt({
      iv: integration.credentials.iv,
      encryptedData: integration.credentials.accessToken
    });

    const adAccountId = integration.credentials.adAccountId;
    if (!accessToken || !adAccountId) {
      console.warn('Skipping sync: Missing credentials');
      return;
    }

    // 2. Fetch last 30 days of insights
    // Note: Ensure getAccountInsights exists in your metaService.js
    const insights = await metaService.getAccountInsights(accessToken, adAccountId, 30);

    if (!insights || insights.length === 0) {
      console.log('No data returned from Meta.');
      return;
    }

    // 3. Upsert into Database (MetricSnapshot)
    for (const day of insights) {
      await MetricSnapshot.findOneAndUpdate(
        { 
          workspace: integration.workspace, 
          platform: 'meta-ads', 
          date: new Date(day.date) 
        },
        { 
          data: day // Save the clean data object
        },
        { upsert: true, new: true }
      );
    }

    // 4. Update Integration Status
    await Integration.findByIdAndUpdate(integration._id, {
      lastSyncAt: new Date(),
      isActive: true
    });

    console.log(`✅ Synced ${insights.length} days of data for ${integration.platform}`);

  } catch (error) {
    console.error(`❌ Sync Failed for ${integration._id}:`, error.message);
    // Optionally mark integration as error state if auth fails
  }
};

/**
 * Run Sync for ALL Integrations (Called by Cron/Scheduler)
 */
export const syncAll = async () => {
  console.log('🚀 Starting Global Sync...');
  try {
    const integrations = await Integration.find({ isActive: true });
    
    for (const integration of integrations) {
      await syncIntegration(integration);
    }
    console.log('🏁 Global Sync Complete');
  } catch (error) {
    console.error('Global Sync Error:', error);
  }
};