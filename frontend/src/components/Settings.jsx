import React, { useState } from 'react';
import { User, Bell, Shield, Moon, Palette, Crown, ChevronRight } from 'lucide-react';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('account');

    const tabs = [
        { id: 'account', label: 'Account', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'privacy', label: 'Privacy & Security', icon: Shield },
        { id: 'appearance', label: 'Appearance', icon: Palette },
        { id: 'subscription', label: 'Subscription', icon: Crown },
    ];

    return (
        <div className="max-w-5xl mx-auto p-6 lg:p-12 min-h-full flex flex-col md:flex-row gap-8">

            {/* Settings Navigation Sidebar */}
            <div className="w-full md:w-64 shrink-0 space-y-8 animate-[fadeIn_0.5s_ease-out]">
                <div>
                    <h1 className="text-3xl font-semibold text-lumina-dark tracking-tight">Settings</h1>
                    <p className="text-gray-500 mt-1 text-sm">Manage your preferences.</p>
                </div>

                <nav className="flex flex-col gap-2">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium w-full text-left ${isActive
                                    ? 'bg-lumina-dark text-white shadow-md transform scale-[1.02]'
                                    : 'text-gray-500 hover:bg-gray-100 hover:text-lumina-dark'
                                    }`}
                            >
                                <Icon size={18} className={isActive ? 'text-white' : 'text-gray-400'} />
                                {tab.label}
                                <ChevronRight size={16} className={`ml-auto transition-transform ${isActive ? 'translate-x-1 opacity-100' : 'opacity-0'}`} />
                            </button>
                        )
                    })}
                </nav>
            </div>

            {/* Settings Content Area */}
            <div className="flex-1 bg-white rounded-3xl border border-gray-100 shadow-sm p-8 min-h-[500px] animate-[slideIn_0.4s_ease-out]">

                {activeTab === 'account' && (
                    <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
                        <div>
                            <h2 className="text-xl font-semibold text-lumina-dark mb-4">Account Information</h2>
                            <div className="flex items-center gap-6 mb-8">
                                <div className="w-20 h-20 rounded-full bg-lumina-blue-bg/40 text-lumina-blue-text flex items-center justify-center border-2 border-white shadow-sm text-3xl font-bold">
                                    J
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-lumina-dark">Jordan Doe</h3>
                                    <p className="text-gray-500 text-sm">jordan@example.com</p>
                                    <button className="text-xs font-semibold text-lumina-blue-border uppercase tracking-wider mt-2 hover:text-lumina-dark transition-colors">
                                        Change Avatar
                                    </button>
                                </div>
                            </div>

                            <form className="space-y-5 max-w-md">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Display Name</label>
                                    <input type="text" defaultValue="Jordan Doe" className="w-full px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-lumina-blue-border transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                                    <input type="email" defaultValue="jordan@example.com" className="w-full px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-lumina-blue-border transition-all" />
                                </div>
                                <button type="button" className="bg-lumina-dark text-white px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-black transition-all shadow-sm">
                                    Save Changes
                                </button>
                            </form>
                        </div>

                        <div className="pt-8 mt-8 border-t border-gray-100">
                            <div className="bg-red-50/50 border border-red-100 rounded-3xl p-8 max-w-2xl">
                                <h3 className="text-red-500 font-semibold text-lg mb-2">Danger Zone</h3>
                                <p className="text-sm text-red-400 mb-8 leading-relaxed">Permanently delete your account and all journaling data. This action is absolutely irreversible and will wipe all your custom insights instantly.</p>
                                <button className="px-8 py-3 bg-white border border-red-200 text-red-500 rounded-xl text-sm font-semibold hover:bg-red-50 hover:border-red-300 transition-all shadow-sm">
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'notifications' && (
                    <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
                        <h2 className="text-xl font-semibold text-lumina-dark mb-6">Notification Preferences</h2>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                                <div>
                                    <h3 className="font-medium text-lumina-dark text-sm">Daily Reflection Reminder</h3>
                                    <p className="text-xs text-gray-500 mt-1">Get an email prompt to write your daily entry.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lumina-dark"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                                <div>
                                    <h3 className="font-medium text-lumina-dark text-sm">Weekly Insights Report</h3>
                                    <p className="text-xs text-gray-500 mt-1">Receive AI-generated summaries of your emotional trends weekly.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" defaultChecked />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lumina-dark"></div>
                                </label>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                                <div>
                                    <h3 className="font-medium text-lumina-dark text-sm">Theme Shifts Alerts</h3>
                                    <p className="text-xs text-gray-500 mt-1">Get notified immediately if the AI detects a major mood shift.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lumina-dark"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {/* Dummy states for other tabs to show fluidity */}
                {['privacy', 'appearance', 'subscription'].includes(activeTab) && (
                    <div className="h-full flex flex-col items-center justify-center text-center animate-[fadeIn_0.3s_ease-out] gap-4 py-20">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                            {activeTab === 'privacy' && <Shield size={32} />}
                            {activeTab === 'appearance' && <Palette size={32} />}
                            {activeTab === 'subscription' && <Crown size={32} />}
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-lumina-dark capitalize">{activeTab} Settings</h2>
                            <p className="text-sm text-gray-400 mt-1 max-w-sm mx-auto">This section is currently under construction for the prototype visualization.</p>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Settings;
