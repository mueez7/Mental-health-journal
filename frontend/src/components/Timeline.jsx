import React, { useState, useEffect } from 'react';
import { Search, Calendar, Filter } from 'lucide-react';
import api from '../lib/api';

const filters = ['All', 'Positive', 'Anxious', 'Deep', 'Quick', 'Creative'];

const Timeline = () => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

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

    // Filtering logic
    const filteredEntries = entries.filter(entry => {
        const textToMatch = entry.text || '';
        const titleToMatch = entry.title || '';
        const matchesSearch = textToMatch.toLowerCase().includes(searchQuery.toLowerCase()) || titleToMatch.toLowerCase().includes(searchQuery.toLowerCase());

        let matchesFilter = true;
        if (activeFilter !== 'All') {
            const lowerFilter = activeFilter.toLowerCase();
            const tags = entry.tags || [];
            const type = entry.entry_type || 'quick';
            matchesFilter = tags.some(tag => tag.toLowerCase() === lowerFilter) || type.toLowerCase() === lowerFilter;
        }

        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return <div className="h-full w-full flex items-center justify-center p-12"><p className="text-gray-400">Loading timeline...</p></div>;
    }

    return (
        <div className="max-w-5xl mx-auto px-6 py-6 lg:px-12 lg:py-12 space-y-8">
            {/* Header & Controls */}
            <div className="space-y-6 sticky top-0 bg-lumina-bg/95 backdrop-blur-xl pt-6 lg:pt-12 pb-6 z-30 -mx-6 px-6 lg:-mx-12 lg:px-12 border-b border-gray-100">
                <div>
                    <h1 className="text-3xl font-semibold text-lumina-dark tracking-tight">Timeline</h1>
                    <p className="text-gray-500 mt-1">Review your past reflections and insights.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    {/* Filter Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar w-full sm:w-auto">
                        <Filter size={16} className="text-gray-400 mr-2" />
                        {filters.map(filter => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border ${activeFilter === filter
                                    ? 'bg-lumina-dark text-white border-lumina-dark shadow-md'
                                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    {/* Search Bar */}
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-full text-gray-500 border border-gray-200 focus-within:border-lumina-blue-border focus-within:ring-2 focus-within:ring-lumina-blue-bg/30 transition-all w-full sm:w-64">
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder="Search timeline..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm w-full text-lumina-dark placeholder:text-gray-400"
                        />
                    </div>
                </div>
            </div>

            {/* Entry Feed */}
            <div className="relative before:content-[''] before:absolute before:left-[19px] sm:before:left-[27px] before:top-4 before:bottom-0 before:w-0.5 before:bg-gray-200/60 pb-12">
                {filteredEntries.length === 0 ? (
                    <div className="text-center py-20 bg-white/50 rounded-3xl border border-gray-100 border-dashed">
                        <p className="text-gray-400 italic">No entries match your search or filter.</p>
                    </div>
                ) : (
                    filteredEntries.map((entry) => (
                        <div key={entry.id} className="relative flex gap-6 sm:gap-8 mb-10 group">
                            {/* Timeline dot */}
                            <div className="shrink-0 mt-5 w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white border-4 border-gray-100 flex items-center justify-center relative z-10 shadow-sm transition-all group-hover:border-lumina-blue-border">
                                <Calendar size={16} className="text-gray-400 group-hover:text-lumina-blue-text" />
                            </div>

                            {/* Card content */}
                            <div className="flex-1 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-2 mb-4">
                                    <h3 className="text-xl font-semibold text-lumina-dark group-hover:text-lumina-blue-text transition-colors">{entry.title}</h3>
                                    <span className="text-sm font-medium text-gray-400 shrink-0">
                                        {entry.created_at ? new Date(entry.created_at).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        }) : 'Just now'}
                                    </span>
                                </div>

                                <p className="text-gray-600 leading-relaxed text-base sm:text-lg mb-6 line-clamp-4 hover:line-clamp-none transition-all cursor-pointer">
                                    {entry.text}
                                </p>

                                <div className="pt-4 border-t border-gray-50 flex flex-wrap gap-2">
                                    {entry.tags.map(tag => {
                                        // Assign colors based on tag semantics
                                        let style = "bg-gray-100 text-gray-600 border-gray-200";
                                        const lowerTag = tag.toLowerCase();
                                        if (['anxious', 'stressed'].includes(lowerTag)) style = "bg-lumina-yellow-bg/40 text-lumina-yellow-text border-lumina-yellow-border/30";
                                        else if (['hopeful', 'positive', 'joyful', 'relieved'].includes(lowerTag)) style = "bg-lumina-green-bg/40 text-lumina-green-text border-lumina-green-border/30";
                                        else if (['guitar', 'music', 'creative'].includes(lowerTag)) style = "bg-lumina-blue-bg/40 text-lumina-blue-text border-lumina-blue-border/30";
                                        else if (['social'].includes(lowerTag)) style = "bg-lumina-pink-bg/40 text-lumina-pink-text border-lumina-pink-border/30";

                                        return (
                                            <span key={tag} className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${style}`}>
                                                {tag}
                                            </span>
                                        )
                                    })}
                                    <span className="px-3 py-1.5 rounded-full text-xs font-semibold border bg-gray-50 text-gray-400 border-gray-200 ml-auto uppercase tracking-wider">
                                        {entry.entry_type || 'quick'} entry
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Timeline;
