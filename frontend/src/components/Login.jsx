import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Logo from '../assets/Logo.svg';

const Login = ({ onLogin }) => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState(null);
    const [isSignUp, setIsSignUp] = useState(false);

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
        <div className="flex flex-col lg:flex-row h-screen w-full bg-lumina-bg">
            {/* Left Side */}
            <div className="flex-1 bg-lumina-dark flex flex-col items-center justify-center p-8 text-white relative">
                <div className="max-w-md text-center">
                    <div className="flex justify-center mb-6">
                        <img src={Logo} alt="Lumina Logo" className="h-16 object-contain" />
                    </div>
                    <p className="text-[#a0a0a0] text-lg font-light leading-relaxed">
                        Your natural language path to self-reflection and mental clarity.
                    </p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            </div>

            {/* Right Side */}
            <div className="flex-1 flex items-center justify-center p-8 lg:p-12 bg-white shadow-2xl z-10">
                <div className="w-full max-w-sm space-y-8">
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
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-lumina-blue-border focus:border-transparent transition-all"
                                required
                            />
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
