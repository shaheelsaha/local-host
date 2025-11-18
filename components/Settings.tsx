// FIX: Switched to namespace import for React to resolve JSX intrinsic element errors, which is necessary for this project's TypeScript configuration.
import * as React from 'react';
// FIX: Refactor Firebase calls to v8 compat syntax.
// FIX: Switched to firebase/compat/app to use v8 syntax with v9 SDK and resolve type errors.
// FIX: Use Firebase v8 compat import to resolve type error for `User`.
import firebase from 'firebase/compat/app';
import { SpinnerIcon } from './icons';

interface SettingsProps {
    user: firebase.User;
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
}

const Settings: React.FC<SettingsProps> = ({ user, theme, setTheme }) => {
    const [fullName, setFullName] = React.useState(user.displayName || '');
    const [newPassword, setNewPassword] = React.useState('');
    const [message, setMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [loading, setLoading] = React.useState(false);

    const userAvatar = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email || 'U')}&background=e0f2fe&color=0284c7&bold=true&rounded=true`;

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const updatePromises: Promise<void>[] = [];

        if (fullName.trim() !== (user.displayName || '').trim() && fullName.trim() !== '') {
            // FIX: Refactor Firebase calls to v8 compat syntax.
            updatePromises.push(user.updateProfile({ displayName: fullName.trim() }));
        }

        if (newPassword) {
            if (newPassword.length < 6) {
                setMessage({ type: 'error', text: "New password must be at least 6 characters long." });
                setLoading(false);
                return;
            }
            // FIX: Refactor Firebase calls to v8 compat syntax.
            updatePromises.push(user.updatePassword(newPassword));
        }
        
        if (updatePromises.length === 0) {
            setMessage({ type: 'success', text: 'No changes to save.' });
            setLoading(false);
            setTimeout(() => setMessage(null), 5000);
            return;
        }

        try {
            await Promise.all(updatePromises);
            setMessage({ type: 'success', text: 'Your settings have been saved successfully!' });
            setNewPassword('');
        } catch (error: any) {
             let errorMessage = 'An error occurred. Please try again.';
             if (error.code === 'auth/requires-recent-login') {
                 errorMessage = 'This action is sensitive and requires recent authentication. Please log out and log back in to update your password.';
             } else if (error.message) {
                 errorMessage = error.message;
             }
             setMessage({ type: 'error', text: errorMessage });
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(null), 5000);
        }
    };

    const ThemeOption: React.FC<{ value: 'light' | 'dark', label: string, icon: React.ReactNode }> = ({ value, label, icon }) => (
        <label className={`flex flex-col items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-colors w-full ${theme === value ? 'border-blue-500 bg-blue-500/10' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
            <input 
                type="radio" 
                name="theme" 
                value={value} 
                checked={theme === value} 
                onChange={() => setTheme(value)}
                className="sr-only"
            />
            <div className="mb-2">{icon}</div>
            <span className="font-semibold text-sm text-gray-700 dark:text-gray-200">{label}</span>
        </label>
    );

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">Manage your profile and password information.</p>
            
            <div className="mt-8 max-w-3xl">
                <form onSubmit={handleSave} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
                    <div className="p-6 sm:p-8 space-y-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                            <img src={userAvatar} alt="Profile" className="h-20 w-20 rounded-full object-cover" />
                            <div>
                                <button type="button" className="px-4 py-2 text-sm font-semibold text-blue-600 dark:text-blue-300 bg-blue-100 dark:bg-blue-500/10 rounded-lg hover:bg-blue-200/70 dark:hover:bg-blue-500/20 transition-colors disabled:opacity-50" disabled>
                                    Change Photo
                                </button>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">JPG, GIF or PNG. 1MB max. (Feature coming soon)</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                                <input type="text" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1 block w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition"/>
                            </div>
                             <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                                <input type="email" id="email" value={user.email || ''} disabled className="mt-1 block w-full px-4 py-2.5 bg-gray-100/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-500 dark:text-gray-500 cursor-not-allowed"/>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-800 p-6 sm:p-8">
                         <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Change Password</h3>
                         <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Update your password for enhanced security.</p>
                         <div className="max-w-sm">
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                            <input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Leave blank to keep current" className="mt-1 block w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition"/>
                        </div>
                    </div>
                    
                    <div className="border-t border-gray-200 dark:border-gray-800 p-6 sm:p-8">
                         <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Appearance</h3>
                         <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Choose how SAHA AI looks to you.</p>
                         <div className="flex gap-4 max-w-sm">
                            <ThemeOption 
                                value="light" 
                                label="Light"
                                icon={
                                    <svg width="40" height="24" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded-sm border border-gray-300">
                                        <rect width="40" height="24" fill="#F9FAFB"/>
                                        <rect x="4" y="4" width="10" height="16" rx="2" fill="#E5E7EB"/>
                                        <rect x="16" y="4" width="20" height="4" rx="1" fill="#D1D5DB"/>
                                        <rect x="16" y="10" width="16" height="2" rx="1" fill="#E5E7EB"/>
                                        <rect x="16" y="14" width="12" height="2" rx="1" fill="#E5E7EB"/>
                                    </svg>
                                }
                            />
                             <ThemeOption 
                                value="dark" 
                                label="Dark"
                                icon={
                                    <svg width="40" height="24" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded-sm border border-gray-600">
                                        <rect width="40" height="24" fill="#111827"/>
                                        <rect x="4" y="4" width="10" height="16" rx="2" fill="#1F2937"/>
                                        <rect x="16" y="4" width="20" height="4" rx="1" fill="#374151"/>
                                        <rect x="16" y="10" width="16" height="2" rx="1" fill="#4B5563"/>
                                        <rect x="16" y="14" width="12" height="2" rx="1" fill="#4B5563"/>
                                    </svg>
                                }
                            />
                         </div>
                    </div>

                    {message && (
                        <div className="px-6 sm:px-8 pb-4">
                            <div className={`p-4 border rounded-lg text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-600 dark:text-green-300 border-green-500/20' : 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'}`}>
                               {message.text}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800 rounded-b-2xl">
                        <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-lg text-white bg-blue-600 font-semibold text-sm hover:bg-blue-700 transition-all shadow-sm shadow-blue-500/20 disabled:bg-gray-400 disabled:shadow-none disabled:cursor-not-allowed flex items-center">
                            {loading && <SpinnerIcon className="w-4 h-4 mr-2 animate-spin" />}
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Settings;