"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { CheckCircle2, Facebook, Loader2, ExternalLink, ShoppingBag, BarChart3, AlertCircle } from "lucide-react"
import { apiClient } from "@/lib/api/client"
import { useAuth } from "@/contexts/AuthContext"

// Add types for the window object to support FB SDK
declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: any;
  }
}

interface IntegrationState {
  shopify: boolean
  meta: boolean
  google: boolean
}

export function IntegrationsSettings() {
  const { user } = useAuth()
  const [status, setStatus] = useState<IntegrationState>({ shopify: false, meta: false, google: false })
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState(false)

  useEffect(() => {
    loadStatus()
    loadFacebookSDK()
  }, [])

  const loadStatus = async () => {
    try {
      const data = await apiClient.getIntegrationStatus(user?.activeWorkspace?._id)
      setStatus(data)
    } catch (error) {
      console.error("Failed to load integrations", error)
    } finally {
      setLoading(false)
    }
  }

  // --- FACEBOOK SDK LOGIC START ---
  const loadFacebookSDK = () => {
    if (window.FB) return;

    window.fbAsyncInit = function() {
      window.FB.init({
        appId      : process.env.NEXT_PUBLIC_META_APP_ID,
        cookie     : true,
        xfbml      : true,
        version    : 'v19.0'
      });
    };

    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s) as HTMLScriptElement; 
       js.id = id;
       js.src = "https://connect.facebook.net/en_US/sdk.js";
       fjs.parentNode?.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));
  }

  const handleConnectMeta = () => {
    setConnecting(true)
    
    if (!window.FB) {
      toast.error("Facebook SDK loading... please wait 2 seconds and try again.")
      setConnecting(false)
      return
    }

    window.FB.login(function(response: any) {
      if (response.authResponse) {
        // User authorized! Send token to backend
        const accessToken = response.authResponse.accessToken;
        connectToBackend(accessToken);
      } else {
        toast.error("Login cancelled or permissions denied.");
        setConnecting(false)
      }
    }, { scope: 'ads_read,read_insights' });
  }

  const connectToBackend = async (accessToken: string) => {
    try {
      await apiClient.connectMeta(user?.activeWorkspace?._id, {
        accessToken: accessToken,
        adAccountId: "" // Backend will auto-detect the ad account
      })
      toast.success("Meta Ads connected successfully!")
      setStatus(prev => ({ ...prev, meta: true }))
    } catch (error) {
      toast.error("Failed to connect. Please try again.")
    } finally {
      setConnecting(false)
    }
  }
  // --- FACEBOOK SDK LOGIC END ---

  const handleDisconnect = async (platform: string) => {
    try {
      await apiClient.disconnectIntegration(user?.activeWorkspace?._id, platform)
      toast.success(`${platform} disconnected`)
      setStatus(prev => ({ ...prev, [platform]: false }))
    } catch (error) {
      toast.error(`Failed to disconnect ${platform}`)
    }
  }

  if (loading) {
    return <div className="flex h-96 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Integrations</h2>
        <p className="text-muted-foreground mt-1">Connect your marketing and sales platforms.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Meta Ads Card */}
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${status.meta ? 'bg-[#1877F2]/20 text-[#1877F2]' : 'bg-muted text-muted-foreground'}`}>
                <Facebook className="w-6 h-6" />
              </div>
              <Badge variant={status.meta ? "default" : "outline"} className={status.meta ? "bg-[#1877F2] hover:bg-[#1877F2]/90 text-white" : ""}>
                {status.meta ? "Connected" : "Not Connected"}
              </Badge>
            </div>
            <CardTitle className="mt-4">Meta Ads</CardTitle>
            <CardDescription>Track ad spend, ROAS, and campaign performance.</CardDescription>
          </CardHeader>
          <CardContent>
            {status.meta ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-[#1877F2]" />
                <span>Syncing daily</span>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Connect your Facebook account to analyze marketing efficiency.</p>
            )}
          </CardContent>
          <CardFooter>
            {status.meta ? (
              <Button variant="outline" className="w-full text-destructive hover:text-destructive" onClick={() => handleDisconnect('meta')}>
                Disconnect
              </Button>
            ) : (
              <Button 
                className="w-full bg-[#1877F2] hover:bg-[#1877F2]/90 text-white"
                onClick={handleConnectMeta}
                disabled={connecting}
              >
                {connecting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ExternalLink className="mr-2 h-4 w-4" />}
                Connect Facebook
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Shopify Placeholder */}
        <Card className="border-border bg-card opacity-70">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-muted text-muted-foreground">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <Badge variant="outline">Coming Soon</Badge>
            </div>
            <CardTitle className="mt-4">Shopify</CardTitle>
            <CardDescription>Direct store integration.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="secondary" disabled className="w-full">Available Soon</Button>
          </CardFooter>
        </Card>

        {/* GA4 Placeholder */}
        <Card className="border-border bg-card opacity-70">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-muted text-muted-foreground">
                <BarChart3 className="w-6 h-6" />
              </div>
              <Badge variant="outline">Coming Soon</Badge>
            </div>
            <CardTitle className="mt-4">Google Analytics</CardTitle>
            <CardDescription>Traffic and conversion data.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="secondary" disabled className="w-full">Available Soon</Button>
          </CardFooter>
        </Card>

      </div>
    </div>
  )
}