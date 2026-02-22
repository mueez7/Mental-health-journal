import React, { useState, useEffect } from 'react';
import { Search, Calendar, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../lib/api';
import GlobalLoader from './GlobalLoader';

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
        return <GlobalLoader message="Loading your timeline..." />;
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { ease: "easeOut" } }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-5xl mx-auto px-6 py-6 lg:px-12 lg:py-12 space-y-8"
        >
            {/* Header & Controls */}
            <div className="space-y-6 sticky top-0 bg-lumina-bg/95 dark:bg-lumina-dark/95 backdrop-blur-xl pt-6 lg:pt-12 pb-6 z-30 -mx-6 px-6 lg:-mx-12 lg:px-12 border-b border-gray-100 dark:border-gray-800 transition-colors">
                <div>
                    <h1 className="text-3xl font-semibold text-lumina-dark dark:text-gray-100 tracking-tight">Timeline</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Review your past reflections and insights.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    {/* Filter Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar w-full sm:w-auto">
                        <Filter size={16} className="text-gray-400 dark:text-gray-500 mr-2 shrink-0" />
                        {filters.map(filter => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border ${activeFilter === filter
                                    ? 'bg-lumina-dark dark:bg-gray-200 text-white dark:text-lumina-dark border-lumina-dark dark:border-gray-200 shadow-md'
                                    : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    {/* Search Bar */}
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 focus-within:border-lumina-blue-border dark:focus-within:border-gray-500 focus-within:ring-2 focus-within:ring-lumina-blue-bg/30 transition-all w-full sm:w-64">
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder="Search timeline..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm w-full text-lumina-dark dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        />
                    </div>
                </div>
            </div>

            {/* Entry Feed */}
            <div className="relative before:content-[''] before:absolute before:left-[19px] sm:before:left-[27px] before:top-4 before:bottom-0 before:w-0.5 before:bg-gray-200/60 dark:before:bg-gray-700 pb-12">
                {filteredEntries.length === 0 ? (
                    <div className="text-center py-20 bg-white/50 dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-700 border-dashed transition-colors">
                        <p className="text-gray-400 italic">No entries match your search or filter.</p>
                    </div>
                ) : (
                    filteredEntries.map((entry) => (
                        <motion.div variants={itemVariants} key={entry.id} className="relative flex gap-6 sm:gap-8 mb-10 group">
                            {/* Timeline dot */}
                            <div className="shrink-0 mt-5 w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white dark:bg-gray-900 border-4 border-gray-100 dark:border-gray-800 flex items-center justify-center relative z-10 shadow-sm transition-all group-hover:border-lumina-blue-border dark:group-hover:border-gray-600">
                                <Calendar size={16} className="text-gray-400 dark:text-gray-500 group-hover:text-lumina-blue-text dark:group-hover:text-gray-300" />
                            </div>

                            {/* Card content */}
                            <div className="flex-1 bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700/50 hover:shadow-md transition-all">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-2 mb-4">
                                    <h3 className="text-xl font-semibold text-lumina-dark dark:text-gray-100 group-hover:text-lumina-blue-text dark:group-hover:text-lumina-blue-bg transition-colors">{entry.title}</h3>
                                    <span className="text-sm font-medium text-gray-400 dark:text-gray-500 shrink-0">
                                        {entry.created_at ? new Date(entry.created_at).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        }) : 'Just now'}
                                    </span>
                                </div>

                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base sm:text-lg mb-6 line-clamp-4 hover:line-clamp-none transition-all cursor-pointer">
                                    {entry.text}
                                </p>

                                <div className="pt-4 border-t border-gray-50 dark:border-gray-700/50 flex flex-wrap gap-2">
                                    {entry.tags.map(tag => {
                                        // Assign colors based on tag semantics
                                        let style = "bg-gray-100 dark:bg-gray-900/50 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700";
                                        const lowerTag = tag.toLowerCase();
                                        if (['anxious', 'stressed'].includes(lowerTag)) style = "bg-lumina-yellow-bg/40 dark:bg-lumina-yellow-bg/10 text-lumina-yellow-text dark:text-yellow-400 border-lumina-yellow-border/30";
                                        else if (['hopeful', 'positive', 'joyful', 'relieved'].includes(lowerTag)) style = "bg-lumina-green-bg/40 dark:bg-lumina-green-bg/10 text-lumina-green-text dark:text-green-400 border-lumina-green-border/30";
                                        else if (['guitar', 'music', 'creative'].includes(lowerTag)) style = "bg-lumina-blue-bg/40 dark:bg-lumina-blue-bg/10 text-lumina-blue-text dark:text-blue-400 border-lumina-blue-border/30";
                                        else if (['social'].includes(lowerTag)) style = "bg-lumina-pink-bg/40 dark:bg-lumina-pink-bg/10 text-lumina-pink-text dark:text-pink-400 border-lumina-pink-border/30";

                                        return (
                                            <span key={tag} className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${style}`}>
                                                {tag}
                                            </span>
                                        )
                                    })}
                                    <span className="px-3 py-1.5 rounded-full text-xs font-semibold border bg-gray-50 dark:bg-gray-900/50 text-gray-400 border-gray-200 dark:border-gray-700 ml-auto uppercase tracking-wider transition-colors">
                                        {entry.entry_type || 'quick'} entry
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </motion.div>
    );
};

export default Timeline;
