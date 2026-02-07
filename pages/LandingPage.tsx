import React, { useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../contexts/AppContext';
import { LogoIcon } from '../components/common/Icons';
import Button from '../components/common/Button';
import { useLocalization, type Language } from '../hooks/useLocalization';

// Animated background particles
const IceParticle: React.FC<{ delay: number; size: number; left: string; duration: number }> = ({ delay, size, left, duration }) => (
  <motion.div
    initial={{ y: '100vh', opacity: 0 }}
    animate={{ y: '-100vh', opacity: [0, 1, 1, 0] }}
    transition={{ 
      duration, 
      delay, 
      repeat: Infinity,
      ease: 'linear'
    }}
    className="absolute rounded-full bg-gradient-to-b from-white/30 to-primary/20 backdrop-blur-sm"
    style={{ 
      width: size, 
      height: size, 
      left,
    }}
  />
);

// Feature Card Component
const Feature: React.FC<{ icon: React.ReactNode; title: string; description: string; index: number }> = ({ icon, title, description, index }) => (
  <motion.div 
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    className="group relative"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="relative p-8 rounded-3xl bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-elevated">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white mb-6 shadow-warm group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="font-display text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

// Role Card Component
const RoleCard: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  features: string[];
  gradient: string;
  index: number;
}> = ({ icon, title, description, features, gradient, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.15, duration: 0.6 }}
    className="group"
  >
    <div className={`relative h-full p-8 rounded-3xl overflow-hidden ${gradient}`}>
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
      </div>
      
      <div className="relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="font-display text-2xl font-bold text-white mb-3">{title}</h3>
        <p className="text-white/80 mb-6 leading-relaxed">{description}</p>
        <ul className="space-y-2">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2 text-white/90 text-sm">
              <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </motion.div>
);

// Stats Component
const Stat: React.FC<{ value: string; label: string; index: number }> = ({ value, label, index }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    className="text-center"
  >
    <div className="font-display text-4xl md:text-5xl font-bold text-gradient">{value}</div>
    <div className="text-muted-foreground mt-2">{label}</div>
  </motion.div>
);

const LandingPage: React.FC = () => {
  const { setAuthPage, bypassLogin, language, setLanguage } = useContext(AppContext)!;
  const { t } = useLocalization();
  const [isScrolled, setIsScrolled] = useState(false);

  const languages: { code: Language; label: string; name: string; }[] = [
    { code: 'en', label: 'EN', name: 'English' },
    { code: 'hi', label: 'हि', name: 'Hindi' },
    { code: 'bn', label: 'বা', name: 'Bengali' },
    { code: 'ta', label: 'த', name: 'Tamil' },
    { code: 'mr', label: 'म', name: 'Marathi' },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-background text-foreground font-sans overflow-x-hidden">
      {/* Floating Navbar */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'py-3' : 'py-5'
        }`}
      >
        <div className={`mx-4 md:mx-8 px-6 py-3 rounded-2xl transition-all duration-500 ${
          isScrolled 
            ? 'bg-card/95 backdrop-blur-xl shadow-elevated border border-border/50' 
            : 'bg-transparent'
        }`}>
          <div className="flex justify-between items-center">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent shadow-warm">
                <LogoIcon />
              </div>
              <div>
                <span className="font-display text-xl font-bold text-foreground">Apna Udyog</span>
                <p className="text-xs text-muted-foreground hidden sm:block">Empowering Artisans</p>
              </div>
            </motion.div>
            
            <div className="hidden md:flex items-center space-x-6">
              {/* Language Selector */}
              <div className="flex items-center gap-1 p-1 rounded-full bg-muted/50 backdrop-blur-sm">
                {languages.map(lang => (
                  <motion.button
                    key={lang.code}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setLanguage(lang.code)}
                    aria-label={`Switch to ${lang.name}`}
                    className={`px-3 py-1.5 rounded-full transition-all duration-300 text-xs font-semibold ${
                      language === lang.code 
                        ? 'bg-gradient-to-br from-primary to-accent text-white shadow-warm' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {lang.label}
                  </motion.button>
                ))}
              </div>
              
              <div className="h-6 w-px bg-border/50" />
              
              <div className="flex items-center gap-3">
                <Button variant="ghost" onClick={() => setAuthPage('login')} className="text-sm">
                  {t('landing.login')}
                </Button>
                <Button onClick={() => setAuthPage('signup')} className="text-sm">
                  {t('landing.getStarted')}
                </Button>
              </div>
            </div>

            {/* Mobile menu */}
            <div className="md:hidden flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setAuthPage('login')}>
                Login
              </Button>
              <Button size="sm" onClick={() => setAuthPage('signup')}>
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/30 to-background" />
          
          {/* Animated gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl" />
          
          {/* Ice particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <IceParticle 
                key={i} 
                delay={i * 0.8} 
                size={Math.random() * 8 + 4} 
                left={`${Math.random() * 100}%`}
                duration={Math.random() * 10 + 15}
              />
            ))}
          </div>
          
          {/* Content */}
          <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 text-primary text-sm font-medium mb-8">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Powered by AI • Built for Artisans
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-tight"
            >
              <span className="text-foreground">Craft Your</span>
              <br />
              <span className="text-gradient">Digital Future</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-8 text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              A complete digital ecosystem bridging traditional craftsmanship with the global economy through AI-powered tools.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="mt-12 flex flex-col sm:flex-row justify-center gap-4"
            >
              <Button size="lg" onClick={() => setAuthPage('signup')} className="text-lg px-8">
                Start Free
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
              <Button variant="secondary" size="lg" onClick={bypassLogin} className="text-lg px-8">
                Explore Platform
              </Button>
            </motion.div>
            
            {/* Scroll indicator */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-8 h-12 rounded-full border-2 border-primary/30 flex items-start justify-center p-2"
              >
                <div className="w-1.5 h-3 bg-primary/60 rounded-full" />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-6 bg-muted/30">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <Stat index={0} value="10K+" label="Artisans Empowered" />
              <Stat index={1} value="5K+" label="Volunteers Connected" />
              <Stat index={2} value="50K+" label="Products Listed" />
              <Stat index={3} value="₹2Cr+" label="Revenue Generated" />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-6 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
          <div className="container mx-auto relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
                AI-Powered Platform
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
                Everything You Need to Succeed
              </h2>
              <p className="mt-6 text-lg text-muted-foreground">
                Leverage cutting-edge AI tools designed specifically for artisans, volunteers, and conscious consumers.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Feature 
                index={0}
                icon={<svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>}
                title="AI Market Assistant"
                description="Generate compelling product names and descriptions in multiple languages from a simple photo or voice note."
              />
              <Feature 
                index={1}
                icon={<svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.776 48.776 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" /></svg>}
                title="AI Photo Studio"
                description="Transform basic product photos into professional, e-commerce-ready images with AI-powered backgrounds."
              />
              <Feature 
                index={2}
                icon={<svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                title="AI Pricing Advisor"
                description="Get data-driven price suggestions based on real-time web comparisons for similar products."
              />
              <Feature 
                index={3}
                icon={<svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /></svg>}
                title="AI Video Creator"
                description="Generate short, engaging promotional videos from simple text stories about products or journeys."
              />
              <Feature 
                index={4}
                icon={<svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>}
                title="Digital Provenance"
                description="Mint unique digital certificates of authenticity for each craft, protecting intellectual property."
              />
              <Feature 
                index={5}
                icon={<svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>}
                title="Volunteer Hub"
                description="Connect with skilled volunteers who can help grow your business with design, marketing, and more."
              />
            </div>
          </div>
        </section>

        {/* Roles Section */}
        <section className="py-24 px-6 bg-muted/30">
          <div className="container mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                Multi-Role Platform
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
                Built for Everyone
              </h2>
              <p className="mt-6 text-lg text-muted-foreground">
                Whether you're an artisan, volunteer, or customer — we've designed experiences tailored just for you.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <RoleCard
                index={0}
                icon={<svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" /></svg>}
                title="For Artisans"
                description="Your complete digital toolkit to showcase, sell, and scale your craft business."
                features={['AI-powered product listings', 'Professional photo studio', 'Crowdfunding campaigns', 'Direct customer chat']}
                gradient="bg-gradient-to-br from-primary to-chart-3"
              />
              <RoleCard
                index={1}
                icon={<svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>}
                title="For Volunteers"
                description="Make a real impact by contributing your skills to help artisans thrive."
                features={['Browse skill-based projects', 'Build impact portfolio', 'Earn digital certificates', 'Connect with artisans']}
                gradient="bg-gradient-to-br from-accent to-chart-4"
              />
              <RoleCard
                index={2}
                icon={<svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>}
                title="For Customers"
                description="Discover authentic, handcrafted products with verified stories and provenance."
                features={['Curated marketplace', 'Meet the artisan stories', 'AI styling assistant', 'Verified authenticity']}
                gradient="bg-gradient-to-br from-chart-5 to-primary"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-chart-3" />
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="container mx-auto relative z-10 text-center"
          >
            <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-6">
              Ready to Transform Your Craft?
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10">
              Join thousands of artisans, volunteers, and customers building a sustainable future for traditional craftsmanship.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                size="lg" 
                onClick={() => setAuthPage('signup')} 
                className="bg-white text-primary hover:bg-white/90 text-lg px-10"
              >
                Get Started Free
              </Button>
              <Button 
                variant="ghost" 
                size="lg" 
                onClick={bypassLogin}
                className="text-white border-2 border-white/30 hover:bg-white/10 text-lg px-10"
              >
                Explore as Guest
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 bg-card border-t border-border">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent">
                  <LogoIcon />
                </div>
                <div>
                  <span className="font-display text-lg font-bold text-foreground">Apna Udyog</span>
                  <p className="text-xs text-muted-foreground">Empowering Traditional Artisans</p>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                © 2024 Apna Udyog. Built with ❄️ for artisans worldwide.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default LandingPage;
