import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { AppContext } from '../contexts/AppContext';
import { useLocalization } from '../hooks/useLocalization';
import { LogoIcon, GoogleIcon } from '../components/common/Icons';
import Button from '../components/common/Button';

const SignUpPage: React.FC = () => {
    const { signup, loginWithGoogle, setAuthPage, bypassLogin } = useContext(AppContext)!;
    const { t } = useLocalization();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [error, setError] = useState('');

    const getUnauthorizedDomainError = () => {
        const hostname = window.location.hostname;
        return `Firebase Authorization Error: This app's domain is not authorized for sign-in.

This is a required security step. Please add the correct domain to the "Authorized domains" list in your Firebase project settings.

How to Fix:
1. Go to your Firebase Console for project 'artisan-ally-4a1b2'.
2. Go to Authentication -> Settings tab -> Authorized domains.
3. Click "Add domain".
4. Add the following domain:
   • ${hostname}

After adding the domain, wait a minute, then refresh this app.`;
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await signup(name, email, password);
        } catch (err: any) {
            if (err.code === 'auth/unauthorized-domain') {
                setError(getUnauthorizedDomainError());
            } else if (err.code === 'auth/email-already-in-use') {
                setError('This email address is already in use.');
            } else if (err.code === 'auth/weak-password') {
                setError('Password should be at least 6 characters.');
            } else {
                setError('Failed to create an account. Check the console for details.');
            }
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        setError('');
        setIsGoogleLoading(true);
        try {
            await loginWithGoogle();
        } catch (err: any) {
            if (err.code === 'auth/unauthorized-domain') {
                setError(getUnauthorizedDomainError());
            } else {
                setError('Failed to sign up with Google. Check the console for details.');
            }
            console.error(err);
        } finally {
            setIsGoogleLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/20 to-background" />
            <motion.div 
                animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute top-1/4 -left-24 w-96 h-96 bg-accent/20 rounded-full blur-3xl" 
            />
            <motion.div 
                animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ duration: 10, repeat: Infinity, delay: 1 }}
                className="absolute bottom-1/4 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl" 
            />

            {/* Floating particles */}
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1.5 h-1.5 bg-accent/30 rounded-full"
                    style={{
                        left: `${15 + i * 18}%`,
                        top: `${20 + (i % 3) * 20}%`,
                    }}
                    animate={{
                        y: [0, -15, 0],
                        opacity: [0.2, 0.6, 0.2],
                    }}
                    transition={{
                        duration: 3 + i * 0.4,
                        repeat: Infinity,
                        delay: i * 0.2,
                    }}
                />
            ))}

            {/* Guest button */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute top-6 right-6 z-20"
            >
                <Button variant="ghost" onClick={bypassLogin} className="text-sm">
                    Continue as Guest
                </Button>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Logo */}
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="flex justify-center items-center space-x-3 mb-8"
                >
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-warm">
                        <LogoIcon />
                    </div>
                    <h1 className="font-display text-3xl font-bold text-foreground">
                        Apna Udyog
                    </h1>
                </motion.div>

                {/* Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 rounded-3xl blur-xl opacity-50" />
                    <div className="relative bg-card/90 backdrop-blur-xl rounded-3xl shadow-elevated border border-border/50 overflow-hidden">
                        <div className="p-8">
                            <div className="text-center mb-8">
                                <h2 className="font-display text-2xl font-bold text-foreground">Create Your Account</h2>
                                <p className="text-muted-foreground mt-2">Join a community of creators and supporters.</p>
                            </div>

                            <form onSubmit={handleSignUp} className="space-y-5">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 bg-muted/50 text-foreground border-2 border-border rounded-xl transition-all duration-300 focus:bg-card focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none placeholder:text-muted-foreground"
                                        placeholder="Your full name"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 bg-muted/50 text-foreground border-2 border-border rounded-xl transition-all duration-300 focus:bg-card focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none placeholder:text-muted-foreground"
                                        placeholder="you@example.com"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block text-sm font-semibold text-foreground mb-2">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 bg-muted/50 text-foreground border-2 border-border rounded-xl transition-all duration-300 focus:bg-card focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none placeholder:text-muted-foreground"
                                        placeholder="••••••••"
                                    />
                                </div>
                                
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl"
                                    >
                                        <pre className="text-sm text-destructive whitespace-pre-wrap font-sans">{error}</pre>
                                    </motion.div>
                                )}
                                
                                <Button type="submit" className="w-full py-3 text-base" isLoading={isLoading}>
                                    Create Account
                                </Button>
                            </form>

                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-border" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="bg-card px-4 text-muted-foreground">Or continue with</span>
                                </div>
                            </div>

                            <Button 
                                variant="secondary" 
                                type="button" 
                                onClick={handleGoogleSignUp} 
                                className="w-full py-3" 
                                isLoading={isGoogleLoading}
                            >
                                <GoogleIcon className="w-5 h-5 mr-3" />
                                Sign Up with Google
                            </Button>

                            <p className="text-center text-sm text-muted-foreground mt-8">
                                Already have an account?{' '}
                                <button 
                                    onClick={() => setAuthPage('login')} 
                                    className="font-semibold text-primary hover:text-primary/80 transition-colors"
                                >
                                    Log In
                                </button>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default SignUpPage;
