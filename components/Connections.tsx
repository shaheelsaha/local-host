





// FIX: Switched to namespace import for React to resolve JSX intrinsic element errors, which is necessary for this project's TypeScript configuration.
import * as React from 'react';
// FIX: Switched to firebase/compat/app to use v8 syntax with v9 SDK and resolve type errors.
// FIX: Use Firebase v8 compat imports to resolve type errors for `firestore`.
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { auth, db } from '../firebaseConfig';
import { 
    FacebookIcon, 
    InstagramIcon,
    LinkedInIcon, 
    TikTokIcon, 
    ThreadsIcon, 
    YouTubeIcon,
    CheckCircleIcon,
    SpinnerIcon,
    TrashIcon,
    ExternalLinkIcon,
    WhatsAppIcon,
    GmailIcon
} from './icons';

type SocialPlatformKey = 'meta' | 'instagram' | 'linkedin' | 'youtube' | 'tiktok' | 'threads' | 'whatsapp' | 'gmail';

const platforms: {
    id: SocialPlatformKey;
    name: string;
    description: string;
    icon: React.FC<any>;
    color: string;
    iconColorClass: string;
}[] = [
    { id: 'meta', name: 'Meta Page', description: 'Connect Facebook pages for posts.', icon: FacebookIcon, color: '#1877F2', iconColorClass: 'text-white' },
    { id: 'instagram', name: 'Instagram Business', description: 'Connect profiles for Reels & Stories.', icon: InstagramIcon, color: 'transparent', iconColorClass: '' },
    { id: 'linkedin', name: 'LinkedIn Page', description: 'Engage your professional network.', icon: LinkedInIcon, color: '#0A66C2', iconColorClass: 'text-white' },
    { id: 'youtube', name: 'YouTube Channel', description: 'Schedule and publish videos.', icon: YouTubeIcon, color: '#FF0000', iconColorClass: 'text-white' },
    { id: 'tiktok', name: 'TikTok', description: 'Share short-form videos.', icon: TikTokIcon, color: '#000000', iconColorClass: 'text-white' },
    { id: 'threads', name: 'Threads', description: 'Share text updates and join conversations.', icon: ThreadsIcon, color: '#000000', iconColorClass: 'text-white' },
    { id: 'whatsapp', name: 'WhatsApp', description: 'Connect for automated messaging.', icon: WhatsAppIcon, color: '#25D366', iconColorClass: 'text-white' },
    { id: 'gmail', name: 'Gmail', description: 'Connect for automated email follow-ups.', icon: GmailIcon, color: '#EA4335', iconColorClass: 'text-white' },
];

// Configuration for OAuth providers
const OAUTH_CONFIG: { [key in SocialPlatformKey]?: { url: string, clientId: string, redirectUri: string, scope: string } } = {
    meta: {
        url: 'https://www.facebook.com/v24.0/dialog/oauth',
        clientId: '1743080133238177',
        redirectUri: 'https://n8n.sahaai.online/webhook/facebook-login',
        scope: 'email,read_insights,publish_video,threads_business_basic,pages_show_list,ads_management,ads_read,business_management,pages_messaging,instagram_basic,instagram_manage_comments,instagram_manage_insights,instagram_content_publish,whatsapp_business_management,instagram_manage_messages,pages_read_engagement,pages_manage_metadata,pages_read_user_content,pages_manage_posts,pages_manage_engagement,whatsapp_business_messaging,instagram_branded_content_brand,instagram_branded_content_creator,instagram_branded_content_ads_brand,instagram_manage_upcoming_events,pages_utility_messaging,whatsapp_business_manage_events,public_profile'
    },
    linkedin: {
        url: 'https://www.linkedin.com/oauth/v2/authorization',
        clientId: '86sjtmizfmhbof',
        redirectUri: 'https://n8n.sahaai.online/webhook/facebook-login', // As provided by user
        scope: 'openid profile email w_member_social w_organization_social rw_organization_admin'
    },
    threads: {
        url: 'https://threads.net/oauth/authorize',
        clientId: '1892572211603273',
        redirectUri: 'https://n8n.sahaai.online/webhook/facebook-login',
        scope: 'threads_basic,threads_content_publish,threads_keyword_search,threads_manage_mentions,threads_manage_replies,threads_read_replies'
    },
    gmail: {
        url: 'https://accounts.google.com/o/oauth2/v2/auth',
        clientId: '846565674927-4k2l198f1t11b5853r22q8c4c7c8c7c.apps.googleusercontent.com',
        redirectUri: 'https://n8n.sahaai.online/webhook/facebook-login',
        scope: 'https://www.googleapis.com/auth/gmail.send'
    }
};

// Maps platform keys to their respective fields in Firestore
const PLATFORM_DB_CONFIG: { 
    [key in SocialPlatformKey]?: { 
        checkField: string, // The primary field to check to determine connection status
        fieldsToDelete: string[] // All fields to remove from Firestore on disconnect
    } 
} = {
    meta: { 
        checkField: 'Fb_ID', 
        fieldsToDelete: ['Fb_Access', 'Fb_ID', 'Fb_name', 'Insta_ID', 'Insta_name']
    },
    linkedin: { 
        checkField: 'LinkedIn_Access_token',
        fieldsToDelete: ['LinkedIn_Access_token', 'LinkedIn_refresh_token', 'Linkedin_ID', 'Linkedin_name']
    },
    threads: { 
        checkField: 'Thread_Access',
        fieldsToDelete: ['Thread_Access', 'Threads_ID', 'Threads_name']
    },
    whatsapp: {
        checkField: 'Whatsapp_Access_token',
        fieldsToDelete: ['Whatsapp_Access_token', 'Whatsapp_ID', 'Whatsapp_name']
    },
    gmail: {
        checkField: 'Gmail_Access_token',
        fieldsToDelete: ['Gmail_Access_token', 'Gmail_refresh_token', 'Gmail_ID', 'Gmail_name']
    }
};

export const Connections: React.FC = () => {
    const [connectedPlatforms, setConnectedPlatforms] = React.useState<string[]>([]);
    const [metaPageName, setMetaPageName] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [connectingPlatform, setConnectingPlatform] = React.useState<SocialPlatformKey | null>(null);
    const pollIntervalRef = React.useRef<number | null>(null);

    React.useEffect(() => {
        const user = auth.currentUser;
        if (!user) {
            setLoading(false);
            return;
        }

        const docRef = db.collection('users').doc(user.uid).collection('connection').doc('connection');
        
        const unsubscribe = docRef.onSnapshot(doc => {
            if (doc.exists) {
                const data = doc.data()!;
                const connected = Object.keys(PLATFORM_DB_CONFIG).filter(platformKey => {
                    const config = PLATFORM_DB_CONFIG[platformKey as SocialPlatformKey];
                    return config && data[config.checkField];
                });
                setConnectedPlatforms(connected);
                
                // Handle specific state updates if needed
                if (data.Fb_ID) {
                    setMetaPageName(data.Fb_name || null);
                } else {
                    setMetaPageName(null);
                }
            } else {
                setConnectedPlatforms([]);
                setMetaPageName(null);
            }
            setLoading(false);
        }, err => {
            console.error("Error fetching connections:", err);
            setLoading(false);
        });

        return () => {
            if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
            }
            unsubscribe();
        };
    }, []);

    React.useEffect(() => {
        // This effect handles the SUCCESS case for connection.
        // When the platform appears as connected, we stop the loading state.
        if (connectingPlatform && connectedPlatforms.includes(connectingPlatform)) {
            if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current!);
                pollIntervalRef.current = null;
            }
            setConnectingPlatform(null);
        }
    }, [connectedPlatforms, connectingPlatform]);


    const handleConnect = (platformId: SocialPlatformKey) => {
        if (connectingPlatform) return;

        const user = auth.currentUser;
        if (!user) {
            alert("You must be logged in to connect your account.");
            return;
        }

        const config = OAUTH_CONFIG[platformId];
        if (!config) {
            alert(`Connecting to ${platformId} is coming soon!`);
            return;
        }
            
        setConnectingPlatform(platformId);
        
        const safeUserId = encodeURIComponent(user.uid);
        const params = new URLSearchParams({
            response_type: 'code',
            client_id: config.clientId,
            redirect_uri: config.redirectUri,
            scope: config.scope,
            state: safeUserId,
        });
        
        // Add access_type=offline for Google services to request a refresh token
        if (platformId === 'gmail') {
            params.append('access_type', 'offline');
            params.append('prompt', 'consent');
        }

        const oauthUrl = `${config.url}?${params.toString()}`;
        
        const popup = window.open(oauthUrl, `${platformId}-auth-popup`, 'width=600,height=700');

        if (!popup) {
            alert("Popup blocked! Please allow popups for this site to connect your account.");
            setConnectingPlatform(null);
            return;
        }

        // Clear any previous interval
        if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
        }

        // This poller handles the FAILURE/CANCEL case by checking status after the popup closes.
        pollIntervalRef.current = window.setInterval(() => {
            if (!popup || popup.closed) {
                clearInterval(pollIntervalRef.current!);
                pollIntervalRef.current = null;
                
                setTimeout(() => {
                    const currentUser = auth.currentUser;
                    if (!currentUser) {
                        setConnectingPlatform(null);
                        return;
                    }

                    const docRef = db.collection('users').doc(currentUser.uid).collection('connection').doc('connection');
                    
                    docRef.get().then(doc => {
                        const config = PLATFORM_DB_CONFIG[connectingPlatform as SocialPlatformKey];
                        const isConnectedNow = doc.exists && config && doc.data()?.[config.checkField];
                        
                        if (connectingPlatform && !isConnectedNow) {
                             alert(`The ${connectingPlatform} connection attempt failed or was cancelled. If you saw an error message in the popup, it indicates a problem with the account authorization. Please try again, and if the issue persists, contact support.`);
                        }
                        
                        setConnectingPlatform(null);
                    }).catch(err => {
                        console.error("Failed to verify connection status:", err);
                        setConnectingPlatform(null);
                    });

                }, 1500);
            }
        }, 500);
    };
    
    const handleDisconnect = async (platformId: SocialPlatformKey) => {
        const platformName = platforms.find(p => p.id === platformId)?.name || 'this platform';
        if (!window.confirm(`Are you sure you want to disconnect ${platformName}?`)) {
            return;
        }
    
        const user = auth.currentUser;
        if (!user) {
            alert("You must be logged in to perform this action.");
            return;
        }

        const config = PLATFORM_DB_CONFIG[platformId];
        if (!config) {
            console.error(`Disconnect configuration not found for ${platformId}.`);
            alert("Cannot disconnect this platform: configuration missing.");
            return;
        }
    
        const docRef = db.collection('users').doc(user.uid).collection('connection').doc('connection');
        try {
            const doc = await docRef.get();
            if (!doc.exists) {
                console.warn("No connection data found to disconnect.");
                return;
            }

            const webhookPayload = {
                eventType: 'disconnect',
                timestamp: new Date().toISOString(),
                user: { uid: user.uid, email: user.email },
                connection: { platform: platformId, ...doc.data() }
            };

            const response = await fetch('https://n8n.sahaai.online/webhook/Disconnect-button', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(webhookPayload)
            });

            if (!response.ok) {
                console.error('Webhook failed:', response.status, await response.text());
                alert(`There was an error processing the disconnection (Webhook failed). Please try again.`);
                return;
            }
            
            const updates: { [key: string]: any } = {};
            config.fieldsToDelete.forEach(field => {
                 updates[field] = firebase.firestore.FieldValue.delete();
            });
            await docRef.update(updates);

            if (platformId === 'meta') {
                setMetaPageName(null);
            }
            
        } catch (error) {
            console.error("Error during disconnection:", error);
            alert("Failed to disconnect. Please check the console and try again.");
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold text-gray-800">Connections</h1>
            <p className="mt-1 text-gray-500">Link your accounts to unlock the full power of SAHA AI.</p>
    
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <SpinnerIcon className="w-12 h-12 animate-spin text-blue-600" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                    {platforms.map(platform => {
                        const isConnected = connectedPlatforms.includes(platform.id);
                        const isConnecting = connectingPlatform === platform.id;
                        const Icon = platform.icon;
                        
                        return (
                            <div 
                                key={platform.id} 
                                className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                            >
                                <div className="flex items-start justify-between">
                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center`} style={{ backgroundColor: platform.color }}>
                                        <Icon className={`w-7 h-7 ${platform.iconColorClass}`} />
                                    </div>
                                    {isConnected && (
                                        <div className="flex items-center text-xs font-medium bg-green-100 text-green-800 px-2.5 py-1 rounded-full">
                                            <CheckCircleIcon className="w-4 h-4 mr-1.5" />
                                            Connected
                                        </div>
                                    )}
                                </div>
                                
                                <div className="mt-4">
                                    <h3 className="font-bold text-lg text-gray-800">{platform.name}</h3>
                                    <p className="text-sm text-gray-500 mt-1 h-10">{platform.description}</p>
                                </div>
    
                                <div className="mt-6 flex items-center space-x-2">
                                    {isConnected ? (
                                        <button 
                                            onClick={() => handleDisconnect(platform.id)} 
                                            className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-800 transition-colors flex items-center justify-center"
                                        >
                                            <TrashIcon className="w-4 h-4 mr-2" />
                                            Disconnect
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => handleConnect(platform.id)} 
                                            disabled={isConnecting}
                                            className="w-full py-2.5 px-4 rounded-lg text-white text-sm bg-blue-600 font-semibold hover:bg-blue-700 transition-all disabled:bg-gray-400 disabled:cursor-wait flex items-center justify-center"
                                        >
                                            {isConnecting ? (
                                                <>
                                                    <SpinnerIcon className="w-4 h-4 mr-2 animate-spin" />
                                                    Connecting...
                                                </>
                                            ) : (
                                                <>
                                                    <ExternalLinkIcon className="w-4 h-4 mr-2"/>
                                                    Connect
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};