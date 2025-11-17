// FIX: Switched to namespace import for React to resolve JSX intrinsic element errors, which is necessary for this project's TypeScript configuration.
import * as React from 'react';
import { db, auth } from '../firebaseConfig';
import { AnalyticsData } from '../types';
import {
    BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { AnalyticsIcon, SpinnerIcon, FileIcon, HeartIcon, TrendingUpIcon } from './icons';

// A reusable component for displaying key stats
const StatCard: React.FC<{ icon: React.ReactElement, title: string, value: string, change?: string, changeType?: 'increase' | 'decrease' }> = ({ icon, title, value, change, changeType }) => (
    <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
        <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gray-400">{title}</div>
            <div className="p-2 bg-zinc-700 rounded-lg">
                {/* FIX: Explicitly provide the type for the props in React.cloneElement to resolve a TypeScript inference issue where 'className' was not recognized on the icon prop. */}
                {React.cloneElement<{ className?: string }>(icon, { className: 'w-5 h-5 text-gray-300' })}
            </div>
        </div>
        <div className="mt-2 flex items-baseline">
            <p className="text-3xl font-bold text-white">{value}</p>
            {change && (
                <span className={`ml-2 text-sm font-semibold ${changeType === 'increase' ? 'text-green-400' : 'text-red-400'}`}>
                    {change}
                </span>
            )}
        </div>
    </div>
);


const Dashboard: React.FC = () => {
    const [data, setData] = React.useState<AnalyticsData | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const user = auth.currentUser;
        if (!user) {
            setLoading(false);
            return;
        }

        const analyticsRef = db.collection('analytics').doc(user.uid);

        const unsubscribe = analyticsRef.onSnapshot(doc => {
            if (doc.exists) {
                const docData = doc.data() as AnalyticsData;
                // Sort engagement data by date for the line chart
                if (docData.engagementOverTime) {
                    docData.engagementOverTime.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                }
                setData(docData);
            } else {
                setData(null);
            }
            setLoading(false);
        }, err => {
            console.error("Error fetching analytics data:", err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full p-8">
                <SpinnerIcon className="w-16 h-16 animate-spin text-blue-500" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="container mx-auto p-4 md:p-8">
                 <div className="bg-zinc-800/50 border border-zinc-700 rounded-2xl p-6 sm:p-12 text-center flex flex-col items-center justify-center">
                    <AnalyticsIcon className="w-16 h-16 text-zinc-600 mb-4" />
                    <h2 className="text-2xl font-semibold text-white">Your Dashboard is Almost Ready!</h2>
                    <p className="mt-2 max-w-2xl text-gray-400">
                        To visualize your data from BigQuery, you need to set up a workflow in **n8n** to sync the data to your app's database.
                    </p>
                    <div className="mt-6 text-left bg-zinc-800 border border-zinc-700 rounded-lg p-6 w-full max-w-2xl">
                        <h3 className="font-semibold text-gray-300 mb-3">n8n Workflow Setup:</h3>
                        <ol className="list-decimal list-inside text-sm text-gray-400 space-y-2">
                            <li>Create a workflow that runs on a schedule (e.g., daily).</li>
                            <li>Use the **BigQuery Node** to query and aggregate your analytics data.</li>
                            <li>Use the **Firestore Node** to write the results to the `analytics` collection.</li>
                            <li>Set the Document ID in the Firestore node to your User ID.</li>
                            <li>Ensure the output JSON matches this structure:</li>
                        </ol>
                        <pre className="text-xs bg-black/50 border border-zinc-600 text-white p-4 rounded-md mt-4 overflow-x-auto">
                            <code>
{`{
  "totalPosts": 152,
  "totalEngagement": 23450,
  "followerGrowthPercentage": 12.5,
  "postsByPlatform": [
    { "name": "Instagram", "value": 75 },
    { "name": "Facebook", "value": 40 }
  ],
  "engagementOverTime": [
    { "date": "2023-10-01", "value": 520 },
    { "date": "2023-10-02", "value": 610 }
  ]
}`}
                            </code>
                        </pre>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="container mx-auto p-4 md:p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <p className="mt-1 text-gray-400">A high-level overview of your social media performance.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard 
                    icon={<FileIcon />} 
                    title="Total Posts" 
                    value={data.totalPosts.toLocaleString()} 
                />
                <StatCard 
                    icon={<HeartIcon />} 
                    title="Total Engagement" 
                    value={data.totalEngagement.toLocaleString()} 
                />
                <StatCard 
                    icon={<TrendingUpIcon />} 
                    title="Follower Growth" 
                    value={`${data.followerGrowthPercentage}%`} 
                    change="+2.5% this month" 
                    changeType="increase"
                />
            </div>
            
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 bg-zinc-800/50 border border-zinc-700 rounded-xl p-6 shadow-sm">
                    <h3 className="font-semibold text-white mb-4">Engagement Over Time</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data.engagementOverTime} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                            <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#a1a1aa' }} stroke="#52525b" />
                            <YAxis tick={{ fontSize: 12, fill: '#a1a1aa' }} stroke="#52525b" />
                            <Tooltip contentStyle={{ backgroundColor: '#27272a', border: '1px solid #404040', borderRadius: '0.5rem' }} itemStyle={{ color: '#e4e4e7' }} labelStyle={{ color: '#a1a1aa' }} />
                            <Legend wrapperStyle={{fontSize: "14px", color: '#a1a1aa'}}/>
                            <Line type="monotone" dataKey="value" name="Engagement" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 6, fill: '#3b82f6' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                 <div className="lg:col-span-2 bg-zinc-800/50 border border-zinc-700 rounded-xl p-6 shadow-sm">
                     <h3 className="font-semibold text-white mb-4">Posts by Platform</h3>
                    <ResponsiveContainer width="100%" height={300}>
                         <BarChart data={data.postsByPlatform} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                            <XAxis type="number" tick={{ fontSize: 12, fill: '#a1a1aa' }} stroke="#52525b" />
                            <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#a1a1aa' }} stroke="#52525b" width={80} />
                            <Tooltip contentStyle={{ backgroundColor: '#27272a', border: '1px solid #404040', borderRadius: '0.5rem' }} itemStyle={{ color: '#e4e4e7' }} labelStyle={{ color: '#a1a1aa' }} cursor={{fill: 'rgba(128,128,128,0.1)'}}/>
                            <Legend wrapperStyle={{fontSize: "14px", color: '#a1a1aa'}}/>
                            <Bar dataKey="value" name="Posts" fill="#3b82f6" barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;