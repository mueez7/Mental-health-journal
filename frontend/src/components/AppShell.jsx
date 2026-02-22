import React, { useState } from 'react';
import Logo from '../assets/Logo.svg';
import {
    LayoutDashboard,
    PenTool,
    Clock,
    BarChart2,
    Settings,
    LogOut,
    Menu,
    Search,
    Bell,
    User,
    X
} from 'lucide-react';

const navLinks = [
    { id: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'WRITE', label: 'Write Entry', icon: PenTool },
    { id: 'TIMELINE', label: 'Timeline', icon: Clock },
    { id: 'INSIGHTS', label: 'Insights', icon: BarChart2 },
    { id: 'SETTINGS', label: 'Settings', icon: Settings },
];

const AppShell = ({ children, currentView, onNavigate, onLogout, user }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

    return (
        <div className="flex h-screen bg-lumina-bg dark:bg-lumina-dark text-lumina-dark dark:text-gray-100 overflow-hidden">
            {/* Sidebar Overlay for Mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-lumina-dark text-white flex flex-col transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                    }`}
            >
                <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
                    <div className="flex items-center">
                        <img src={Logo} alt="Lumina Logo" className="h-8 object-contain" />
                    </div>
                    <button className="md:hidden" onClick={() => setIsSidebarOpen(false)}>
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-4">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = currentView === link.id;
                        return (
                            <button
                                key={link.id}
                                onClick={() => {
                                    onNavigate(link.id);
                                    setIsSidebarOpen(false);
                                }}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${isActive
                                    ? 'bg-white/10 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Icon size={18} />
                                {link.label}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium"
                    >
                        <LogOut size={18} />
                        Log out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Header */}
                <header className="h-16 bg-gradient-to-r from-blue-50/80 via-purple-50/80 to-teal-50/80 dark:from-lumina-dark dark:via-gray-900/80 dark:to-lumina-dark bg-[length:200%_200%] animate-[gradientFlow_8s_ease-in-out_infinite] backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-4 lg:px-8 z-10 sticky top-0">
                    <div className="flex items-center gap-4">
                        <button
                            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu size={20} />
                        </button>

                        <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-100/80 dark:bg-gray-800/80 rounded-lg text-gray-500 w-64 border border-transparent focus-within:border-lumina-blue-border focus-within:bg-white dark:focus-within:bg-gray-700 transition-all">
                            <Search size={16} />
                            <input
                                type="text"
                                placeholder="Search entries, tags..."
                                className="bg-transparent border-none outline-none text-sm w-full text-lumina-dark dark:text-gray-200"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-gray-600">
                        <div className="relative">
                            <button
                                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
                            >
                                <Bell size={18} />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-lumina-pink-border rounded-full ring-2 ring-white"></span>
                            </button>

                            {/* Notifications Dropdown */}
                            {isNotificationsOpen && (
                                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 shadow-xl rounded-2xl border border-gray-100 dark:border-gray-700 z-50 animate-[slideDown_0.2s_ease-out] overflow-hidden">
                                    <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-700/50">
                                        <h3 className="font-semibold text-lumina-dark dark:text-gray-100 text-sm">Notifications</h3>
                                        <span className="text-xs bg-lumina-blue-bg/40 text-gray-500 dark:text-gray-300 px-2 py-1 rounded-full font-medium">0 New</span>
                                    </div>
                                    <div className="max-h-80 overflow-y-auto hide-scrollbar w-full p-6 flex flex-col items-center justify-center text-center">
                                        <Bell size={24} className="text-gray-300 mb-2" />
                                        <p className="text-sm font-medium text-gray-500">You're all caught up!</p>
                                        <p className="text-xs text-gray-400 mt-1">No new notifications at this time.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center border hover:ring-2 ring-offset-1 ring-blue-300 cursor-pointer transition-all focus:outline-none overflow-hidden"
                            >
                                {user?.user_metadata?.avatar_url ? (
                                    <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={16} className="text-blue-600" />
                                )}
                            </button>

                            {/* Profile Dropdown */}
                            {isProfileDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-gray-800 shadow-xl rounded-2xl border border-gray-100 dark:border-gray-700 z-50 animate-[slideDown_0.2s_ease-out] overflow-hidden">
                                    {/* User Info */}
                                    <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/50 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0 overflow-hidden">
                                            {user?.user_metadata?.avatar_url ? (
                                                <img src={user.user_metadata.avatar_url} alt="Profile Avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                <User size={18} className="text-blue-600 dark:text-blue-400" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-lumina-dark dark:text-gray-100 text-sm leading-tight">
                                                {user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Lumina User'}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{user?.email}</p>
                                        </div>
                                    </div>

                                    {/* Options */}
                                    <div className="p-2">
                                        <button
                                            onClick={() => {
                                                setIsProfileDropdownOpen(false);
                                                onNavigate('SETTINGS');
                                            }}
                                            className="w-full text-left px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-colors flex items-center gap-3 group"
                                        >
                                            <div className="p-1.5 bg-gray-100 dark:bg-gray-900 rounded-lg text-gray-500 dark:text-gray-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/50 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                                <Settings size={14} />
                                            </div>
                                            Profile Settings
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsProfileDropdownOpen(false);
                                                onNavigate('INSIGHTS');
                                            }}
                                            className="w-full text-left px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors flex items-center gap-3 group mt-1"
                                        >
                                            <div className="p-1.5 bg-gray-100 dark:bg-gray-900 rounded-lg text-gray-500 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-600">
                                                <BarChart2 size={14} />
                                            </div>
                                            Your Insights
                                        </button>
                                    </div>

                                    {/* Logout */}
                                    <div className="p-2 border-t border-gray-100 dark:border-gray-700">
                                        <button
                                            onClick={() => {
                                                setIsProfileDropdownOpen(false);
                                                onLogout();
                                            }}
                                            className="w-full text-left px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-colors flex items-center gap-3 group"
                                        >
                                            <div className="p-1.5 bg-red-100/50 dark:bg-red-900/50 rounded-lg text-red-500 dark:text-red-400 group-hover:bg-red-200/50 dark:group-hover:bg-red-800/50">
                                                <LogOut size={14} />
                                            </div>
                                            Log out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Dynamic Content */}
                <main className="flex-1 overflow-y-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AppShell;
