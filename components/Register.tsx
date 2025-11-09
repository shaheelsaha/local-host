// FIX: Switched to namespace import for React to resolve JSX intrinsic element errors, which is necessary for this project's TypeScript configuration.
import * as React from 'react';
import { Link } from 'react-router-dom';
// FIX: Refactor Firebase calls to v8 compat syntax.
// import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, googleProvider } from '../firebaseConfig';
import { UserIcon, EmailIcon, LockIcon, EyeIcon, EyeOffIcon, GoogleIcon } from './icons';
import ParticleNetwork from './ParticleNetwork';

interface RegisterProps {}

const Register: React.FC<RegisterProps> = () => {
    const [fullName, setFullName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [passwordVisible, setPasswordVisible] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [googleLoading, setGoogleLoading] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length < 6) {
            setError("Password should be at least 6 characters.");
            return;
        }
        setError(null);
        setLoading(true);
        try {
            // FIX: Refactor Firebase calls to v8 compat syntax.
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            if (userCredential.user) {
                await userCredential.user.updateProfile({
                    displayName: fullName
                });
            }
            // onAuthStateChanged in App.tsx will handle the redirect
        } catch (err: any) {
             switch (err.code) {
                case 'auth/email-already-in-use':
                    setError('This email address is already in use.');
                    break;
                case 'auth/invalid-email':
                    setError('Please enter a valid email address.');
                    break;
                case 'auth/weak-password':
                    setError('Password is too weak. Please choose a stronger one.');
                    break;
                default:
                    setError('Failed to create account. Please try again.');
                    console.error(err);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        setError(null);
        setGoogleLoading(true);
        try {
            await auth.signInWithPopup(googleProvider);
            // onAuthStateChanged will handle the rest, including creating a new user if one doesn't exist
        } catch (err: any) {
             if (err.code !== 'auth/popup-closed-by-user') {
                 setError(`Google sign-up failed: ${err.message}`);
                 console.error(err);
             }
        } finally {
            setGoogleLoading(false);
        }
    };
    
    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-[#0D1117] text-gray-200 p-4 font-sans overflow-hidden">
             <ParticleNetwork />
             <div className="relative z-10 w-full flex flex-col items-center">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                        Create Your <span className="text-[#00FFC2]">SAHA AI</span> Account
                    </h1>
                    <p className="text-gray-400 mt-4 max-w-md mx-auto">
                        Join us and unlock the future of social media management.
                    </p>
                </div>

                <div className="w-full max-w-md p-6 sm:p-8 space-y-6 bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl shadow-black/30">
                     <div className="text-center">
                        <h2 className="text-2xl font-bold text-white">Sign Up</h2>
                        <p className="text-gray-400 text-sm mt-1">It's quick and easy</p>
                    </div>

                    {error && <p className="text-red-400 text-sm text-center bg-red-500/20 p-3 rounded-lg border border-red-500/30">{error}</p>}
                    
                     <button type="button" onClick={handleGoogleSignUp} disabled={googleLoading || loading} className="w-full flex items-center justify-center py-3 px-4 rounded-lg bg-white text-gray-800 font-semibold text-base hover:bg-gray-200 transition-all duration-300 border border-gray-300 shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed">
                        {googleLoading ? (
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <>
                                <GoogleIcon className="w-5 h-5 mr-3" />
                                Sign Up with Google
                            </>
                        )}
                    </button>

                     <div className="relative flex items-center py-2">
                        <div className="flex-grow border-t border-white/20"></div>
                        <span className="flex-shrink mx-4 text-xs text-gray-400 uppercase">Or continue with</span>
                        <div className="flex-grow border-t border-white/20"></div>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="name" className="text-sm font-medium text-gray-300 sr-only">Full Name</label>
                            <div className="relative">
                                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                <input id="name" name="name" type="text" autoComplete="name" required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="pl-12 w-full bg-white/5 border border-white/20 rounded-lg py-3 px-4 text-gray-200 focus:ring-2 focus:ring-[#00FFC2]/50 focus:border-[#00FFC2] outline-none transition duration-300"
                                placeholder="Enter your full name" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email" className="text-sm font-medium text-gray-300 sr-only">Email</label>
                            <div className="relative">
                                <EmailIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                <input id="email" name="email" type="email" autoComplete="email" required 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-12 w-full bg-white/5 border border-white/20 rounded-lg py-3 px-4 text-gray-200 focus:ring-2 focus:ring-[#00FFC2]/50 focus:border-[#00FFC2] outline-none transition duration-300"
                                placeholder="Enter your email" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password" className="text-sm font-medium text-gray-300 sr-only">Password</label>
                            <div className="relative">
                                <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                <input
                                    id="password"
                                    name="password"
                                    type={passwordVisible ? "text" : "password"}
                                    autoComplete="new-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-12 pr-12 w-full bg-white/5 border border-white/20 rounded-lg py-3 px-4 text-gray-200 focus:ring-2 focus:ring-[#00FFC2]/50 focus:border-[#00FFC2] outline-none transition duration-300"
                                    placeholder="Create a password (min. 6 characters)"
                                />
                                <button type="button" onClick={() => setPasswordVisible(!passwordVisible)} className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-[#00FFC2] transition-colors">
                                    {passwordVisible ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <button type="submit" disabled={loading || googleLoading} className="w-full mt-2 py-3 px-4 rounded-lg text-black bg-[#00FFC2] font-bold text-base hover:bg-teal-300 transition-all duration-300 shadow-[0_0_20px_theme(colors.teal.400/50%)] disabled:bg-gray-600 disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center">
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating Account...
                                    </>
                                ) : 'Sign Up'}
                            </button>
                        </div>
                    </form>
                    <p className="text-sm text-center text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-[#00FFC2] hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
                <p className="text-center text-xs text-gray-500 mt-12">
                    Copyright © 2025 SAHA AI. All Rights Reserved.
                </p>
            </div>
        </div>
    );
};

export default Register;