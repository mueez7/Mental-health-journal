import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../lib/api';

const prompts = [
    "What is taking up the most space in your mind right now?",
    "Describe a moment today that brought you unexpected joy.",
    "What is a challenge you faced recently, and how did you handle it?",
    "If you could give yourself one piece of advice today, what would it be?"
];

const WriteEntry = () => {
    const [text, setText] = useState('');
    const [prompt, setPrompt] = useState(prompts[0]);
    const textareaRef = useRef(null);
    const startTimeRef = useRef(Date.now());
    const navigate = useNavigate();

    useEffect(() => {
        // Select a random prompt on mount
        setPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
    }, []);

    const handleInput = (e) => {
        setText(e.target.value);

        // Auto-expand textarea
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!text.trim() || isSaving) return;
        setIsSaving(true);
        try {
            const entryData = {
                text,
                time_spent: Math.max(1, Math.floor((Date.now() - startTimeRef.current) / 60000))
            };
            await api.post('/entries/', entryData);
            navigate('/timeline');
        } catch (error) {
            console.error('Failed to save entry', error);
            alert('Failed to save entry. Please ensure backend is running.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="max-w-4xl mx-auto p-6 lg:p-12 space-y-8 min-h-[calc(100vh-4rem)] flex flex-col"
        >
            {/* Top Prompter Banner */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="bg-lumina-yellow-bg/50 dark:bg-lumina-yellow-bg/10 border border-lumina-yellow-border/50 text-lumina-dark dark:text-gray-200 rounded-2xl p-5 flex items-start gap-4 shadow-sm transition-colors"
            >
                <div className="w-10 h-10 rounded-full bg-lumina-yellow-text/20 dark:bg-yellow-500/20 flex items-center justify-center shrink-0">
                    <Sparkles size={20} className="text-lumina-yellow-text dark:text-yellow-400" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-lumina-dark/60 dark:text-gray-400 uppercase tracking-widest mb-1">AI Prompt</h3>
                    <p className="text-lg font-medium text-lumina-dark dark:text-gray-200">{prompt}</p>
                </div>
            </motion.div>

            {/* Writing Area */}
            <div className="flex-1 flex flex-col relative group">
                <textarea
                    ref={textareaRef}
                    value={text}
                    onInput={handleInput}
                    placeholder="What's on your mind today? Write freely..."
                    className="w-full flex-1 bg-transparent text-xl lg:text-3xl font-light text-lumina-dark dark:text-gray-100 placeholder:text-gray-300 dark:placeholder:text-gray-600 resize-none outline-none leading-relaxed transition-all"
                    style={{ minHeight: '300px' }}
                    autoFocus
                />

                {/* Character count / status */}
                <div className="absolute bottom-4 left-0 text-sm font-medium text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {text.length} characters
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end pt-6 border-t border-gray-100 dark:border-gray-800 mt-auto transition-colors">
                <button
                    onClick={handleSave}
                    disabled={!text.trim() || isSaving}
                    className="bg-lumina-dark dark:bg-gray-100 text-white dark:text-lumina-dark px-8 py-4 rounded-xl font-medium flex items-center gap-3 hover:bg-black dark:hover:bg-white hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                >
                    <Save size={20} />
                    {isSaving ? 'Analyzing...' : 'Save Entry & Analyze'}
                </button>
            </div>
        </motion.div>
    );
};

export default WriteEntry;
