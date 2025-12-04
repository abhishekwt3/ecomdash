import Integration from '../models/Integration.js';
import { encrypt } from '../lib/encryption.js';
import * as metaService from '../services/metaService.js';
import * as syncService from '../services/syncService.js';

export const connectMeta = async (req, res) => {
  const { accessToken } = req.body; // Received from Frontend SDK
  const workspaceId = req.query.workspaceId;

  if (!workspaceId) return res.status(400).json({ message: 'Workspace ID required' });

  try {
    // 1. Exchange User Token for Long-Lived Token (60 days)
    const longLivedToken = await metaService.getLongLivedToken(accessToken);

    // 2. Get User Info
    const metaUser = await metaService.getMe(longLivedToken);

    // 3. AUTO-DETECT AD ACCOUNT
    // Fetch all ad accounts attached to this user
    const adAccounts = await metaService.getAdAccounts(longLivedToken);
    
    // Look for the first active account (account_status 1 = active)
    const activeAccount = adAccounts.find(acc => acc.account_status === 1) || adAccounts[0];

    if (!activeAccount) {
      return res.status(400).json({ message: 'No Ad Accounts found for this Facebook user' });
    }

    // 4. Encrypt
    const encryptedToken = encrypt(longLivedToken);

    // 5. Save to DB
    const integration = await Integration.findOneAndUpdate(
      { workspace: workspaceId, platform: 'meta-ads' },
      {
        isActive: true,
        platformId: metaUser.id,
        credentials: {
          accessToken: encryptedToken.encryptedData,
          iv: encryptedToken.iv,
          adAccountId: activeAccount.id // Saved automatically
        },
        lastSyncAt: new Date()
      },
      { new: true, upsert: true }
    );

    // 6. Trigger Background Sync
    syncService.syncIntegration(integration).catch(err => 
      console.error('Background sync error:', err)
    );

    res.json({ 
      success: true, 
      message: `Connected to ${activeAccount.name} (${activeAccount.id})` 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ... keep getIntegrationStatus and disconnectIntegration ...
export const getIntegrationStatus = async (req, res) => {
  const { workspaceId } = req.query;
  try {
    const integrations = await Integration.find({ workspace: workspaceId });
    const status = {
      shopify: integrations.some(i => i.platform === 'shopify' && i.isActive),
      meta: integrations.some(i => i.platform === 'meta-ads' && i.isActive),
      google: integrations.some(i => i.platform === 'google-analytics' && i.isActive),
    };
    res.json(status);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const disconnectIntegration = async (req, res) => {
  const { platform } = req.params;
  const { workspaceId } = req.query;
  try {
    await Integration.findOneAndDelete({ workspace: workspaceId, platform });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};