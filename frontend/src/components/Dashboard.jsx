import React, { useState, useMemo, useEffect } from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { Calendar, Clock, ChevronRight, Tag as TagIcon, Zap, PenTool, Activity } from 'lucide-react';
import api from '../lib/api';

const Dashboard = ({ onNavigate }) => {
    const [entries, setEntries] = useState([]);
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEntries = async () => {
            try {
                setLoading(true);
                const res = await api.get('/entries/');
                const data = res.data || [];
                setEntries(data);
                if (data.length > 0) setSelectedEntry(data[0]);
            } catch (error) {
                console.error('Failed to fetch entries', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEntries();
    }, []);

    const stats = useMemo(() => {
        if (!entries || entries.length === 0) {
            return {
                total: 0, deepReflections: 0, topTags: [], hours: "0.0", recentMoods: [], activeDays: [], todaysEntries: []
            };
        }

        const total = entries.length;
        const deepReflections = entries.filter(e => e.entry_type === 'deep').length;

        // Group tags
        const tagCounts = {};
        entries.forEach(e => {
            (e.tags || []).forEach(t => {
                tagCounts[t] = (tagCounts[t] || 0) + 1;
            });
        });
        const topTags = Object.entries(tagCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3);

        // Time spent (mins -> hours)
        const totalMins = entries.reduce((acc, curr) => acc + (curr.time_spent || 0), 0);
        const hours = (totalMins / 60).toFixed(1);

        // Emotion trends (last 7 recorded days)
        const recentMoods = [...entries].reverse().slice(-7).map((e) => ({
            name: new Date(e.created_at).toLocaleDateString('en-US', { weekday: 'short' }),
            value: e.mood_score || 5
        }));

        // Active days for calendar (current month)
        const currentMonth = new Date().getMonth();
        const activeDays = entries
            .map(e => new Date(e.created_at))
            .filter(d => d.getMonth() === currentMonth)
            .map(d => d.getDate());

        // Today's flow
        const todayStr = new Date().toDateString();
        const todaysEntries = entries.filter(e => new Date(e.created_at).toDateString() === todayStr);

        return { total, deepReflections, topTags, hours, recentMoods, activeDays, todaysEntries };
    }, [entries]);

    if (loading) {
        return <div className="h-full w-full flex items-center justify-center p-12"><p className="text-gray-400">Loading dashboard...</p></div>;
    }

    return (
        <div className="flex flex-col xl:flex-row gap-6 p-6 max-w-[1600px] mx-auto">
            {/* Main Content */}
            <div className="flex-1 space-y-8">
                <div>
                    <h1 className="text-3xl font-semibold text-lumina-dark dark:text-gray-100 tracking-tight">Good morning.</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Here is a snapshot of your recent reflections.</p>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Card 1: Yellow - Entries Summary */}
                    <div className="bg-lumina-yellow-bg border border-lumina-yellow-border rounded-3xl p-6 shadow-sm flex flex-col justify-between h-48 hover:-translate-y-1 transition-transform cursor-pointer" onClick={() => onNavigate('TIMELINE')}>
                        <div>
                            <div className="flex items-center gap-2 text-lumina-black-text font-medium mb-1">
                                <PenToolIcon /> Entries Summary
                            </div>
                            <p className="text-lumina-dark/70 text-sm">Your journaling streak is active</p>
                        </div>
                        <div className="flex items-baseline gap-2 mt-4">
                            <span className="text-5xl font-bold text-lumina-dark tracking-tighter">{stats.total}</span>
                            <span className="text-lumina-dark/80 font-medium">total</span>
                        </div>
                        <div className="mt-2 text-sm text-lumina-dark/70 font-medium bg-white/30 self-start px-3 py-1 rounded-full">
                            {stats.deepReflections} deep reflections
                        </div>
                    </div>

                    {/* Card 2: Pink - Emotion Trends */}
                    <div className="bg-lumina-pink-bg border border-lumina-pink-border rounded-3xl p-6 shadow-sm flex flex-col justify-between h-48 hover:-translate-y-1 transition-transform cursor-pointer" onClick={() => onNavigate('INSIGHTS')}>
                        <div className="flex justify-between items-center mb-2 z-10 relative">
                            <div className="flex items-center gap-2 text-lumina-black-text font-medium">
                                <ActivityIcon /> Emotion Trends
                            </div>
                            <span className="text-xs font-semibold bg-white/40 text-lumina-dark px-2 py-1 rounded-md">Last 7 entries</span>
                        </div>
                        <div className="flex-1 -mx-6 -mb-6 mt-2 relative overflow-hidden rounded-b-3xl">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats.recentMoods}>
                                    <defs>
                                        <linearGradient id="colorPink" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#E09CC3" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#E09CC3" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                    <Area type="monotone" dataKey="value" stroke="#E09CC3" strokeWidth={3} fillOpacity={1} fill="url(#colorPink)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Card 3: Green - By Context */}
                    <div className="bg-lumina-green-bg border border-lumina-green-border rounded-3xl p-6 shadow-sm flex flex-col justify-between h-48 hover:-translate-y-1 transition-transform">
                        <div>
                            <div className="flex items-center gap-2 text-lumina-black-text font-medium mb-1">
                                <TagIcon size={18} /> By Context
                            </div>
                            <p className="text-lumina-dark/70 text-sm">Most frequent topics</p>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4">
                            {stats.topTags.map(([tag, count]) => (
                                <span key={tag} className="bg-white/40 text-lumina-dark font-medium px-4 py-2 rounded-full text-sm">
                                    {tag} ({count})
                                </span>
                            ))}
                            {stats.topTags.length === 0 && <span className="text-gray-500 text-sm italic">No topics yet</span>}
                        </div>
                    </div>

                    {/* Card 4: Blue - Writing Sessions */}
                    <div className="bg-lumina-blue-bg border border-lumina-blue-border rounded-3xl p-6 shadow-sm flex flex-col justify-between h-48 hover:-translate-y-1 transition-transform">
                        <div>
                            <div className="flex items-center gap-2 text-lumina-black-text font-medium mb-1">
                                <Clock size={18} /> Writing Sessions
                            </div>
                            <p className="text-lumina-dark/70 text-sm">Time spent reflecting</p>
                        </div>
                        <div className="flex items-baseline gap-2 mt-4">
                            <span className="text-5xl font-bold text-lumina-dark">{stats.hours}</span>
                            <span className="text-lumina-dark/80 font-medium">hours</span>
                        </div>
                    </div>

                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Recent Entries List */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-lg text-lumina-dark dark:text-gray-100">Recent entries</h3>
                            <button
                                onClick={() => onNavigate('TIMELINE')}
                                className="text-sm font-medium text-gray-500 hover:text-lumina-dark flex items-center"
                            >
                                View all <ChevronRight size={16} />
                            </button>
                        </div>
                        <div className="space-y-3">
                            {entries.slice(0, 3).map((entry) => (
                                <div
                                    key={entry.id}
                                    onClick={() => setSelectedEntry(entry)}
                                    className={`p-4 rounded-2xl cursor-pointer transition-all border ${selectedEntry?.id === entry.id
                                        ? 'bg-white dark:bg-gray-800 shadow-md border-gray-200 dark:border-gray-700'
                                        : 'bg-white/50 dark:bg-gray-800/50 border-transparent hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm'
                                        }`}
                                >
                                    <p className="text-xs text-gray-400 mb-1">{entry.created_at ? new Date(entry.created_at).toLocaleDateString() : 'Just now'}</p>
                                    <h4 className="font-semibold text-lumina-dark dark:text-gray-100 mb-1">{entry.title}</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{entry.text}</p>
                                </div>
                            ))}
                            {entries.length === 0 && (
                                <p className="text-sm text-gray-400 italic">No entries yet. Start writing!</p>
                            )}
                        </div>
                    </div>

                    {/* Detail Panel */}
                    <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col transition-colors">
                        <h3 className="font-semibold text-lg text-lumina-dark dark:text-gray-100 mb-4">Entry Insights</h3>
                        {selectedEntry ? (
                            <div className="space-y-6 flex-1">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">Automated Summary</h4>
                                    <p className="text-gray-700 dark:text-gray-300 bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700/50 italic transition-colors">
                                        "{selectedEntry.text}"
                                    </p>
                                </div>

                                {(selectedEntry.tags && selectedEntry.tags.length > 0) && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">Dominant Emotions</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedEntry.tags.map(tag => (
                                                <span key={tag} className="px-3 py-1 bg-lumina-pink-bg/30 text-lumina-pink-text border border-lumina-pink-border/30 rounded-full text-sm font-medium">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedEntry.suggestion && (
                                    <div className="mt-auto bg-lumina-yellow-bg/20 dark:bg-lumina-yellow-bg/10 border border-lumina-yellow-border/30 rounded-xl p-4 transition-colors">
                                        <div className="flex gap-2 items-center text-lumina-yellow-text dark:text-yellow-400 font-semibold mb-2">
                                            <Zap size={16} /> AI Suggestion
                                        </div>
                                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                            {selectedEntry.suggestion}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-400 italic">
                                Select an entry to view insights
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-full xl:w-80 space-y-6">
                {/* Mini Calendar */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lumina-dark dark:text-gray-100">Calendar</h3>
                        <Calendar size={18} className="text-gray-400" />
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center mb-2">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                            <span key={i} className="text-xs font-medium text-gray-400">{d}</span>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: 31 }, (_, i) => {
                            const num = i + 1;
                            const hasEntry = stats.activeDays.includes(num);
                            const isToday = num === new Date().getDate();
                            return (
                                <div
                                    key={i}
                                    className={`w-full aspect-square rounded-full flex items-center justify-center text-sm transition-colors ${isToday
                                        ? 'bg-lumina-dark dark:bg-gray-100 text-white dark:text-lumina-dark font-semibold'
                                        : hasEntry
                                            ? 'bg-lumina-blue-bg/30 dark:bg-lumina-blue-bg/50 text-lumina-dark dark:text-gray-200 font-medium'
                                            : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {num}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Daily Timeline Tracker */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 transition-colors">
                    <h3 className="font-semibold text-lumina-dark dark:text-gray-100 mb-4 text-center">Today's Flow</h3>
                    <div className="space-y-6">
                        <div className="relative pl-6 before:content-[''] before:absolute before:left-[7px] before:top-2 before:bottom-0 before:w-0.5 before:bg-gray-100 dark:before:bg-gray-700">
                            {stats.todaysEntries.map((entry, idx) => (
                                <div key={entry.id || idx} className="relative mb-6">
                                    <span className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-4 border-white dark:border-gray-800 shadow-sm z-10 transition-colors ${entry.entry_type === 'deep' ? 'bg-lumina-blue-bg' : 'bg-lumina-yellow-bg'}`}></span>
                                    <p className="text-xs font-semibold text-gray-400 mb-1">
                                        {new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-3 border border-gray-100 dark:border-gray-700/50 transition-colors">
                                        <p className="text-sm font-medium text-lumina-dark dark:text-gray-200">{entry.title || "Quick Note"}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 capitalize">{entry.entry_type || 'quick'} • {entry.time_spent || 5}m</p>
                                    </div>
                                </div>
                            ))}

                            {/* Timeline Item (Current) */}
                            <div className="relative mt-6">
                                <span className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-lumina-dark dark:bg-gray-100 border-4 border-white dark:border-gray-800 shadow-sm z-10 animate-pulse transition-colors"></span>
                                <p className="text-xs font-semibold text-lumina-dark dark:text-gray-200 mb-1">Now</p>
                                <button
                                    onClick={() => onNavigate('WRITE')}
                                    className="w-full border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm font-medium text-gray-400 hover:text-lumina-dark dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    + Add new reflection
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

// Helper components missing from Lucide standard imports used inline
const PenToolIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19 7-7 3 3-7 7-3-3z" /><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="m2 2 7.586 7.586" /><circle cx="11" cy="11" r="2" /></svg>;
const ActivityIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>;

export default Dashboard;
