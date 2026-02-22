import React, { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Cell } from 'recharts';
import { Target, TrendingUp, AlertCircle, Smile } from 'lucide-react';
import api from '../lib/api';

const Insights = () => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEntries = async () => {
            try {
                setLoading(true);
                const res = await api.get('/entries/');
                setEntries(res.data || []);
            } catch (error) {
                console.error('Failed to fetch entries', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEntries();
    }, []);

    const insightData = useMemo(() => {
        // Default empty states
        if (!entries || entries.length === 0) {
            return {
                moodData: [],
                themes: [],
                growthArea: "Keep journaling to build insights.",
                growthSuggestion: "Write more entries to see your growth areas.",
                positiveHighlight: "You've successfully set up your journal!",
                positiveSuggestion: "Consistency is key."
            };
        }

        // 1. Mood & Stress stability over time (Chronological)
        const recentEntries = [...entries].reverse().slice(-30); // Max 30
        const moodData = recentEntries.map((e, i) => ({
            day: new Date(e.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) || `Entry ${i + 1}`,
            mood: e.mood_score || 0,
            stress: e.stress_score || 0,
        }));

        // 2. Extract and count real Themes/Tags
        const tagCounts = {};
        recentEntries.forEach(e => {
            (e.tags || []).forEach(t => {
                const lower = t.toLowerCase();
                tagCounts[lower] = (tagCounts[lower] || 0) + 1;
            });
        });

        const colors = ['#E8C84D', '#8AA2C8', '#E09CC3', '#808E53', '#A892C8'];
        const themes = Object.entries(tagCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 4) // Top 4 themes
            .map(([name, score], index) => ({
                name: name.charAt(0).toUpperCase() + name.slice(1),
                score: score * 10, // Just multiplying by 10 for a visual chart score metric
                color: colors[index % colors.length]
            }));

        // 3. Simple Dynamic Insights based on actual recent entries
        // Since we don't have the async LLM worker running yet, we extract recent suggestions
        const entriesWithSuggestions = recentEntries.filter(e => e.suggestion && e.suggestion.length > 5);

        let growthArea = "Your entries are being logged. Continue reflecting on your daily experiences.";
        let growthSuggestion = "Try noting specifically what triggered your stress levels today.";
        let positiveHighlight = "You are taking the time to write down your thoughts.";
        let positiveSuggestion = "Maintain this habit to improve emotional awareness.";

        if (entriesWithSuggestions.length > 0) {
            // Pick a recent deep entry for growth
            const deepEntries = entriesWithSuggestions.filter(e => e.entry_type === 'deep' || (e.tags && e.tags.some(t => ['anxious', 'stressed', 'tired'].includes(t.toLowerCase()))));
            if (deepEntries.length > 0) {
                const latestDeep = deepEntries[deepEntries.length - 1];
                growthArea = `In a recent entry, you discussed: "${latestDeep.title || 'complex emotions'}" which correlates with higher stress markers.`;
                growthSuggestion = latestDeep.suggestion;
            } else {
                growthArea = `Recently you reflected on: "${entriesWithSuggestions[entriesWithSuggestions.length - 1].title}".`;
                growthSuggestion = entriesWithSuggestions[entriesWithSuggestions.length - 1].suggestion;
            }

            // Pick a recent positive entry
            const positiveEntries = entriesWithSuggestions.filter(e => e.tags && e.tags.some(t => ['joyful', 'hopeful', 'positive', 'excited'].includes(t.toLowerCase())));
            if (positiveEntries.length > 0) {
                const latestPos = positiveEntries[positiveEntries.length - 1];
                positiveHighlight = `You experienced a positive boost around: "${latestPos.title}". These moments consistently result in higher mood scores.`;
                positiveSuggestion = latestPos.suggestion;
            }
        }

        return { moodData, themes, growthArea, growthSuggestion, positiveHighlight, positiveSuggestion };
    }, [entries]);

    if (loading) {
        return <div className="h-full w-full flex items-center justify-center p-12"><p className="text-gray-400">Loading insights...</p></div>;
    }

    return (
        <div className="max-w-[1600px] mx-auto p-6 lg:p-12 space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-semibold text-lumina-dark tracking-tight">Insights & Patterns</h1>
                <p className="text-gray-500 mt-1">AI-driven analysis of your long-term emotional landscape.</p>
            </div>

            {/* Main Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Large Chart: Mood Stability (Spans 2 columns) */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col h-[500px]">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3 text-lumina-dark font-semibold text-lg">
                            <TrendingUp className="text-lumina-blue-text" />
                            Mood Stability (Recent Entries)
                        </div>
                        <select className="bg-gray-50 border border-gray-200 text-gray-500 text-sm rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-lumina-blue-border">
                            <option>Recent Data</option>
                        </select>
                    </div>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={insightData.moodData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} minTickGap={30} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} domain={[0, 10]} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: '1px solid #F3F4F6', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    labelStyle={{ fontWeight: 'bold', color: '#374151' }}
                                />
                                <Line type="stepAfter" dataKey="mood" stroke="#8AA2C8" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#8AA2C8', stroke: '#fff', strokeWidth: 2 }} name="General Mood" />
                                <Line type="monotone" dataKey="stress" stroke="#E8C84D" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Stress Level" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex items-center gap-6 mt-6 justify-center text-sm font-medium text-gray-500">
                        <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-lumina-blue-text"></div> General Mood</span>
                        <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-lumina-yellow-text"></div> Stress Level</span>
                    </div>
                </div>

                {/* Small Chart: Recurring Themes */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col h-[500px]">
                    <div className="flex items-center gap-3 text-lumina-dark font-semibold text-lg mb-6">
                        <Target className="text-lumina-pink-text" />
                        Dominant Themes
                    </div>
                    <p className="text-sm text-gray-500 mb-6">AI identified subjects frequently appearing in your recent reflections.</p>

                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={insightData.themes} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#4B5563', fontSize: 13, fontWeight: 500 }} width={120} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={24}>
                                    {insightData.themes.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                        {insightData.themes.length === 0 && (
                            <div className="flex items-center justify-center h-full text-gray-400 italic text-sm">Not enough data to calculate themes.</div>
                        )}
                    </div>

                    {insightData.themes.length > 0 && (
                        <div className="mt-6 bg-lumina-pink-bg/20 border border-lumina-pink-border/30 rounded-xl p-4">
                            <div className="flex gap-2 items-center text-lumina-pink-text font-semibold mb-2 text-sm">
                                <AlertCircle size={16} /> Theme Noticed
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed">
                                "{insightData.themes[0].name}" is currently your most frequent topic.
                            </p>
                        </div>
                    )}
                </div>

            </div>

            {/* Week in Review Summaries */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                {/* Areas for Growth Card */}
                <div className="bg-lumina-yellow-bg/20 rounded-3xl p-6 md:p-8 border border-lumina-yellow-border/20 shadow-sm hover:shadow-lg hover:shadow-lumina-yellow-bg/30 hover:-translate-y-1 hover:border-lumina-yellow-border/50 transition-all duration-300">
                    <h3 className="flex items-center gap-3 text-lg font-semibold text-lumina-dark mb-4 tracking-tight">
                        <div className="p-2 bg-lumina-yellow-bg/50 rounded-xl text-lumina-yellow-text">
                            <AlertCircle size={20} strokeWidth={2.5} />
                        </div>
                        Areas for Growth
                    </h3>

                    <p className="text-gray-700 leading-relaxed text-sm md:text-base mb-4">
                        {insightData.growthArea}
                    </p>
                    <p className="text-sm md:text-base text-gray-700">
                        <strong className="text-lumina-dark">Suggestion: </strong>
                        {insightData.growthSuggestion}
                    </p>
                </div>

                {/* Positive Highlights Card */}
                <div className="bg-lumina-green-bg/20 rounded-3xl p-6 md:p-8 border border-lumina-green-border/20 shadow-sm hover:shadow-lg hover:shadow-lumina-green-bg/30 hover:-translate-y-1 hover:border-lumina-green-border/50 transition-all duration-300">
                    <h3 className="flex items-center gap-3 text-lg font-semibold text-lumina-dark mb-4 tracking-tight">
                        <div className="p-2 bg-lumina-green-bg/50 rounded-xl text-lumina-green-text">
                            <Smile size={20} strokeWidth={2.5} />
                        </div>
                        Positive Highlights
                    </h3>

                    <p className="text-gray-700 leading-relaxed text-sm md:text-base mb-4">
                        {insightData.positiveHighlight}
                    </p>
                    <p className="text-sm md:text-base text-gray-700">
                        <strong className="text-lumina-dark">Suggestion: </strong>
                        {insightData.positiveSuggestion}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Insights;
