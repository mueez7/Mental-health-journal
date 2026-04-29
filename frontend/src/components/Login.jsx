import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import LuminaGif from '../assets/Lumina.gif';
import Logo from '../assets/Logo.svg';
import SplitText from './SplitText';
import LightRays from './LightRays';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Eye, EyeOff } from 'lucide-react';

const Login = ({ onLogin }) => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState(null);
    const [isSignUp, setIsSignUp] = useState(false);
    const [showGif, setShowGif] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const containerRef = useRef(null);

    useGSAP(() => {
        // Left capsule animation
        gsap.from('.left-capsule', {
            x: -50,
            opacity: 0,
            duration: 1.5,
            ease: 'power3.out'
        });

        // Right form elements stagger
        gsap.from('.right-form > *', {
            y: 30,
            opacity: 0,
            duration: 1,
            stagger: 0.15,
            ease: 'power3.out',
            delay: 0.5
        });
    }, { scope: containerRef });

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowGif(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    const handleAnimationComplete = () => {
        console.log('All letters have animated!');
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            display_name: displayName || null,
                        }
                    }
                });
                if (error) throw error;
                alert('Success! Check your email to confirm your account, or login directly if auto-confirm is enabled.');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                onLogin();
            }
        } catch (err) {
            setError(err.message || 'An error occurred during authentication');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div ref={containerRef} className="flex flex-col lg:flex-row h-screen w-full bg-white">
            {/* Left Side */}
            <div className="left-capsule hidden lg:flex lg:w-[55%] xl:w-[60%] p-3 lg:p-5">
                <div className="w-full h-full bg-lumina-dark rounded-[2.5rem] flex flex-col items-center justify-center relative overflow-hidden">
                    {/* WebGL Light Rays background */}
                    <LightRays
                        raysOrigin="top-center"
                        raysColor="#ffffff"
                        raysSpeed={1}
                        lightSpread={0.5}
                        rayLength={3}
                        followMouse={true}
                        mouseInfluence={0.1}
                        noiseAmount={0}
                        distortion={0}
                        pulsating={false}
                        fadeDistance={1}
                        saturation={1}
                    />
                    <div className="max-w-md text-center z-10 flex flex-col items-center">
                        <div className="flex justify-center mb-6 h-[5rem] items-center">
                            {showGif ? (
                                <img
                                    src={LuminaGif}
                                    alt="Lumina Logo Animation"
                                    className="h-25 xl:h-33 object-contain"
                                />
                            ) : (
                                <img
                                    src={Logo}
                                    alt="Lumina Logo"
                                    className="h-16 xl:h-20 object-contain"
                                />
                            )}
                        </div>
                        <SplitText
                            text="Your natural language path to self-reflection and mental clarity."
                            className="text-[#a0a0a0] text-lg font-light leading-relaxed px-4 pt-4 text-center mt-2 max-w-md"
                            delay={18}
                            duration={0.55}
                            ease="power3.out"
                            splitType="chars"
                            from={{ opacity: 0, y: 18 }}
                            to={{ opacity: 1, y: 0 }}
                            threshold={0.1}
                            rootMargin="0px"
                            textAlign="center"
                            onLetterAnimationComplete={handleAnimationComplete}
                            showCallback
                        />
                    </div>
                </div>
            </div>

            {/* Right Side */}
            <div className="flex-1 flex items-center justify-center p-8 lg:p-12 xl:p-16 bg-white z-10">
                <div className="w-full max-w-sm space-y-8 right-form">
                    <div>
                        <h2 className="text-3xl font-semibold text-lumina-dark tracking-tight">
                            {isSignUp ? 'Create an account' : 'Welcome back'}
                        </h2>
                        <p className="text-gray-500 mt-2 text-sm">
                            {isSignUp ? 'Sign up for a new account' : 'Sign in to your account'}
                        </p>
                    </div>

                    <form className="space-y-5" onSubmit={handleAuth}>
                        {error && (
                            <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg border border-red-100">
                                {error}
                            </div>
                        )}
                        {isSignUp && (
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Display Name</label>
                                <input
                                    type="text"
                                    placeholder="Jordan Doe"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-lumina-blue-border focus:border-transparent transition-all"
                                />
                            </div>
                        )}
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Email address</label>
                            <input
                                type="email"
                                placeholder="jordan@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-lumina-blue-border focus:border-transparent transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-lumina-blue-border focus:border-transparent transition-all pr-12"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-lumina-dark text-white font-medium py-3 rounded-lg hover:bg-black transition-colors shadow-lg hover:shadow-xl mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500">
                        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                        <button
                            type="button"
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="font-semibold text-lumina-dark hover:underline"
                        >
                            {isSignUp ? 'Sign In' : 'Create Account'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
