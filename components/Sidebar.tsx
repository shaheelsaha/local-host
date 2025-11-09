// FIX: Switched to namespace import for React to resolve JSX intrinsic element errors, which is necessary for this project's TypeScript configuration.
import * as React from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { ConnectionsIcon, DashboardIcon, ScheduleIcon, SettingsIcon, SparklesIcon, XIcon, ChevronDoubleLeftIcon, CommandLineIcon } from './icons';

interface SidebarProps {
    onLinkClick: () => void;
    isOpen: boolean;
    toggle: () => void;
    isCollapsed: boolean;
    toggleCollapse: () => void;
}

const NavLink: React.FC<{
    to: string,
    icon: React.ReactElement,
    label: string,
    isCollapsed: boolean,
    onClick: () => void,
}> = ({ to, icon, label, isCollapsed, onClick }) => {
    return (
        <RouterNavLink
            to={to}
            title={isCollapsed ? label : undefined}
            onClick={onClick}
            className={({ isActive }) => `w-full flex items-center text-left py-2.5 rounded-lg transition-colors duration-200 text-sm font-medium ${
                isCollapsed ? 'px-2 justify-center' : 'px-4'
            } ${
                isActive
                ? 'bg-zinc-800 text-white'
                : 'text-gray-400 hover:bg-zinc-800/60 hover:text-gray-200'
            }`}
        >
            {/* Fix: Explicitly provide the type for the props in React.cloneElement to resolve a TypeScript inference issue. */}
            {React.cloneElement<{ className?: string }>(icon, { className: `w-5 h-5 flex-shrink-0 ${isCollapsed ? '' : 'mr-3'}` })}
            <span className={isCollapsed ? 'sr-only' : 'inline-block'}>{label}</span>
        </RouterNavLink>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ onLinkClick, isOpen, toggle, isCollapsed, toggleCollapse }) => {
    return (
        <>
            {/* Overlay for mobile */}
            <div
                className={`fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={toggle}
                aria-hidden="true"
            ></div>
            <aside className={`fixed inset-y-0 left-0 bg-zinc-900 text-white p-4 flex flex-col z-50 transform transition-all duration-300 ease-in-out md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} ${isCollapsed ? 'md:w-20' : 'md:w-64'}`}>
                <div className="flex items-center justify-between mb-10 px-2">
                     <div className="flex items-center overflow-hidden">
                        <div className="bg-white/10 rounded-lg p-2 mr-3 flex-shrink-0">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                                <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" stroke="currentColor" strokeWidth="1.5"/>
                                {/* FIX: Corrected typo in SVG path data for the logo's inner circle. */}
                                <path d="M15.5 12C15.5 13.933 13.933 15.5 12 15.5C10.067 15.5 8.5 13.933 8.5 12C8.5 10.067 10.067 8.5 12 8.5C13.933 8.5 15.5 10.067 15.5 12Z" stroke="currentColor" strokeWidth="1.5"/>
                                <path d="M12 4.5V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                <path d="M12 22V19.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                <path d="M19.5 12H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                <path d="M2 12H4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                        </div>
                        <h1 className={`text-xl font-bold tracking-tight whitespace-nowrap transition-opacity duration-200 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>SAHA AI</h1>
                    </div>
                    <button onClick={toggle} className="md:hidden p-1 text-gray-400 hover:text-white" aria-label="Close sidebar">
                        <XIcon className="w-6 h-6"/>
                    </button>
                </div>

                <nav className="flex-1 space-y-2">
                    <p className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ${isCollapsed ? 'text-center' : 'px-4'}`}>
                        <span className={isCollapsed ? 'sr-only' : 'inline'}>Menu</span>
                    </p>
                    <NavLink to="/dashboard" onClick={onLinkClick} icon={<DashboardIcon />} label="Dashboard" isCollapsed={isCollapsed} />
                    <NavLink to="/schedule" onClick={onLinkClick} icon={<ScheduleIcon />} label="Schedule" isCollapsed={isCollapsed}/>
                    
                    <div className="pt-6 space-y-2">
                        <p className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ${isCollapsed ? 'text-center' : 'px-4'}`}>
                           <span className={isCollapsed ? 'sr-only' : 'inline'}>Configuration</span>
                        </p>
                        <NavLink to="/connections" onClick={onLinkClick} icon={<ConnectionsIcon />} label="Connections" isCollapsed={isCollapsed}/>
                        <NavLink to="/command" onClick={onLinkClick} icon={<CommandLineIcon />} label="Command" isCollapsed={isCollapsed}/>
                        <NavLink to="/persona" onClick={onLinkClick} icon={<SparklesIcon />} label="AI Persona" isCollapsed={isCollapsed}/>
                        <NavLink to="/settings" onClick={onLinkClick} icon={<SettingsIcon />} label="Settings" isCollapsed={isCollapsed}/>
                    </div>
                </nav>

                <div className="flex flex-col space-y-2">
                    {isCollapsed ? (
                        <button className="w-10 h-10 mx-auto flex items-center justify-center bg-blue-600/50 hover:bg-blue-600 rounded-full text-white transition-colors" title="Upgrade to Pro">
                            <SparklesIcon className="w-5 h-5"/>
                        </button>
                    ) : (
                        <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl p-5 text-center relative overflow-hidden">
                            <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full"></div>
                            <div className="absolute -bottom-8 -left-2 w-24 h-24 bg-white/10 rounded-full"></div>
                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-full bg-white/20 mx-auto flex items-center justify-center mb-3 ring-4 ring-white/10">
                                    <SparklesIcon className="w-6 h-6 text-white"/>
                                </div>
                                <h3 className="font-bold text-white text-md">Upgrade to Pro</h3>
                                <p className="text-xs text-blue-100/80 mt-1 mb-4">Unlock all features and get unlimited access.</p>
                                <button className="w-full bg-white text-blue-700 font-bold text-sm py-2 px-4 rounded-lg hover:bg-opacity-90 transition-all transform hover:scale-105">
                                    Upgrade Now
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="border-t border-zinc-800/50 pt-2">
                        <button
                            onClick={toggleCollapse}
                            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                            className={`w-full flex items-center text-left py-2 rounded-lg text-sm font-medium text-gray-400 hover:bg-zinc-800/60 hover:text-gray-200 transition-colors ${isCollapsed ? 'justify-center' : 'px-4'}`}
                        >
                            {/* FIX: Corrected typo in Tailwind CSS class for icon rotation. */}
                            <ChevronDoubleLeftIcon className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
                            <span className={`ml-3 transition-opacity duration-200 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>Collapse</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

// FIX: Added default export to make the component available for import in other files.
export default Sidebar;
