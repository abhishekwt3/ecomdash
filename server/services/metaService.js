import axios from 'axios';

const GRAPH_API_URL = 'https://graph.facebook.com/v19.0';

/**
 * Exchange Auth Code for Access Token (OAuth Step 2)
 */
export const exchangeCodeForToken = async (code, redirectUri) => {
  try {
    const response = await axios.get(`${GRAPH_API_URL}/oauth/access_token`, {
      params: {
        client_id: process.env.META_APP_ID,
        client_secret: process.env.META_APP_SECRET,
        redirect_uri: redirectUri,
        code: code
      }
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Meta OAuth Error:', error.response?.data || error.message);
    throw new Error('Failed to exchange code for token');
  }
};

// ... (Keep getMe, getAdAccounts, getAccountInsights, getLongLivedToken from previous steps) ...
// (Include them here or ensure you append this function to the existing file)

/**
 * Validates a token and returns user info
 */
export const getMe = async (accessToken) => {
  try {
    const response = await axios.get(`${GRAPH_API_URL}/me`, {
      params: { access_token: accessToken, fields: 'id,name' }
    });
    return response.data;
  } catch (error) {
    throw new Error('Invalid Meta Access Token');
  }
};

/**
 * Fetch Insights (Spend, Impressions, Clicks, ROAS)
 */
export const getAccountInsights = async (accessToken, adAccountId, days = 30) => {
  try {
    const accountId = adAccountId.startsWith('act_') ? adAccountId : `act_${adAccountId}`;
    
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - days);
    
    const timeRange = {
      since: startDate.toISOString().split('T')[0],
      until: today.toISOString().split('T')[0]
    };

    const fields = 'account_id,account_name,spend,impressions,clicks,cpc,cpm,ctr,actions,action_values';

    const response = await axios.get(`${GRAPH_API_URL}/${accountId}/insights`, {
      params: {
        access_token: accessToken,
        level: 'account',
        fields: fields,
        time_range: JSON.stringify(timeRange),
        time_increment: 1 
      }
    });

    return response.data.data.map(transformInsightData);
  } catch (error) {
    console.error(`Meta Insights Error:`, error.response?.data?.error?.message || error.message);
    return []; 
  }
};

const transformInsightData = (dayData) => {
  const purchaseValue = dayData.action_values?.find(a => a.action_type === 'purchase')?.value || 0;
  const spend = parseFloat(dayData.spend || 0);
  const roas = spend > 0 ? (parseFloat(purchaseValue) / spend).toFixed(2) : 0;

  return {
    date: dayData.date_start,
    spend: spend,
    impressions: parseInt(dayData.impressions || 0),
    clicks: parseInt(dayData.clicks || 0),
    revenue: parseFloat(purchaseValue),
    roas: parseFloat(roas),
    ctr: parseFloat(dayData.ctr || 0),
    cpc: parseFloat(dayData.cpc || 0),
    cpm: parseFloat(dayData.cpm || 0)
  };
};