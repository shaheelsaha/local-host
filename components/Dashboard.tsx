// FIX: Switched to namespace import for React to resolve JSX intrinsic element errors, which is necessary for this project's TypeScript configuration.
import * as React from 'react';
import { AnalyticsIcon } from './icons';

const Dashboard: React.FC = () => {
    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="mt-1 text-gray-500">A high-level overview of your social media performance.</p>

            <div className="mt-8">
                 <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-12 text-center text-gray-500 flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px]">
                    <AnalyticsIcon className="w-16 h-16 text-gray-300 mb-4" />
                    <h2 className="text-xl font-semibold text-gray-700">Analytics Coming Soon</h2>
                    <p className="mt-2 max-w-sm">
                        This is where you'll find powerful insights, engagement metrics, and audience growth charts. Stay tuned!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
