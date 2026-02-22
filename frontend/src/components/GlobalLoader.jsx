import React from 'react';
import loadGif from '../assets/load.gif';

const GlobalLoader = ({ message = "Loading your journal..." }) => {
    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-lumina-bg relative overflow-hidden">
            {/* Subtle background glow effect equivalent to Lumina's styling */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[40%] -left-[20%] w-[70%] h-[70%] bg-lumina-primary/10 blur-[120px] rounded-full mix-blend-multiply" />
                <div className="absolute top-[60%] -right-[10%] w-[60%] h-[60%] bg-lumina-accent/10 blur-[100px] rounded-full mix-blend-multiply" />
            </div>

            <div className="z-10 flex flex-col items-center">
                <img
                    src={loadGif}
                    alt="Loading animation"
                    className="w-24 h-24 object-contain mb-6 opacity-90 drop-shadow-md"
                />
                <p className="text-gray-500 font-medium tracking-wide animate-pulse">
                    {message}
                </p>
            </div>
        </div>
    );
};

export default GlobalLoader;
