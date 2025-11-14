
// FIX: Switched to namespace import for React to resolve JSX intrinsic element errors, which is necessary for this project's TypeScript configuration.
import * as React from 'react';
import { Link } from 'react-router-dom';
import firebase from 'firebase/app';
import { LogoutIcon, SearchIcon, BellIcon, MessageIcon, ChevronDownIcon, SettingsIcon, UserIcon, MenuIcon } from './icons';

interface HeaderProps {
    user: firebase.User;
    onLogout: () => void;
    toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, toggleSidebar }) => {
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);
    const userAvatar = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email || 'U')}&background=EBF4FF&color=4299E1&bold=true&rounded=true`;

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/75 h-20 flex items-center justify-between px-4 sm:px-8 flex-shrink-0 sticky top-0 z-30">
            {/* Left side: Hamburger and Search */}
            <div className="flex items-center">
                <button onClick={toggleSidebar} className="md:hidden text-gray-500 hover:text-gray-800 mr-4" aria-label="Open sidebar">
                    <MenuIcon className="w-6 h-6"/>
                </button>
                <div className="relative w-full max-w-[180px] sm:max-w-xs lg:max-w-sm">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search anything..."
                        className="pl-12 pr-4 py-2.5 w-full bg-gray-100 border-transparent rounded-full text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                    />
                </div>
            </div>
            
            {/* Right side icons and profile */}
            <div className="flex items-center space-x-3 sm:space-x-6">
                <button className="relative text-gray-500 hover:text-gray-900 transition-colors hidden sm:block">
                    <BellIcon className="w-6 h-6" />
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                </button>
                <button className="text-gray-500 hover:text-gray-900 transition-colors hidden sm:block">
                    <MessageIcon className="w-6 h-6" />
                </button>

                <div className="relative" ref={dropdownRef}>
                    <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center space-x-3 group">
                        <img className="h-10 w-10 rounded-full ring-2 ring-offset-2 ring-gray-200 group-hover:ring-blue-500 transition-all" src={userAvatar} alt="User" />
                        <div className="text-left hidden md:block">
                             <div className="text-sm font-semibold text-gray-800">{user.displayName || 'John Doe'}</div>
                             <div className="text-xs text-gray-500">Pro Member</div>
                        </div>
                        <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform duration-300 hidden sm:block ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isProfileOpen && (
                         <div
                            className="origin-top-right absolute right-0 mt-3 w-56 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 transition ease-out duration-100 transform opacity-100 scale-100"
                        >
                            <div className="p-2">
                                <Link to="/settings" className="flex items-center w-full px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900" role="menuitem">
                                    <UserIcon className="w-4 h-4 mr-3 text-gray-400" />
                                    Your Profile
                                </Link>
                                <Link to="/settings" className="flex items-center w-full px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900" role="menuitem">
                                    <SettingsIcon className="w-4 h-4 mr-3 text-gray-400" />
                                    Settings
                                </Link>
                                <div className="border-t border-gray-100 my-1"></div>
                                <button onClick={onLogout} className="w-full text-left flex items-center px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50 hover:text-red-700" role="menuitem">
                                    <LogoutIcon className="w-4 h-4 mr-3" />
                                    Sign out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;