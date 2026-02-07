import React, { useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../contexts/AppContext';
import { LogoIcon } from '../components/common/Icons';
import Button from '../components/common/Button';
import { useLocalization, type Language } from '../hooks/useLocalization';

// Feature Card Component
const Feature: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; index: number }> = ({ icon, title, children, index }) => (
  <motion.div 
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    className="feature-card group"
  >
    <div className="icon-warm mb-6">
      {icon}
    </div>
    <h3 className="font-display text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
      {title}
    </h3>
    <p className="text-muted-foreground leading-relaxed">{children}</p>
  </motion.div>
);

// Step Component
const Step: React.FC<{ number: string; title: string; children: React.ReactNode; index: number }> = ({ number, title, children, index }) => (
  <motion.div 
    initial={{ opacity: 0, x: -30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.15, duration: 0.5 }}
    className="flex group"
  >
    <div className="flex flex-col items-center mr-6">
      <motion.div 
        whileHover={{ scale: 1.1 }}
        className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground font-display font-bold text-xl shadow-warm"
      >
        {number}
      </motion.div>
      <div className="w-0.5 h-full bg-gradient-to-b from-primary/50 to-transparent mt-4" />
    </div>
    <div className="pb-12">
      <h4 className="mb-2 font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">
        {title}
      </h4>
      <p className="text-muted-foreground leading-relaxed">{children}</p>
    </div>
  </motion.div>
);

// Hero Slideshow Images
const slideshowImages = [
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6kaGFdq7VUXUQlDXz5UI5--6dfQW76OX3Bw&s',
  'https://images.hindustantimes.com/rf/image_size_630x354/HT/p2/2020/05/20/Pictures/_10059fa6-9a46-11ea-b5cf-22f71a9413fe.jpg',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwFtGM9yvqXs3horfgXSPe4EiOSGi_BxuJEA&s',
];

const LandingPage: React.FC = () => {
  const { setAuthPage, bypassLogin, language, setLanguage } = useContext(AppContext)!;
  const { t } = useLocalization();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const languages: { code: Language; label: string; name: string; }[] = [
    { code: 'en', label: 'A', name: 'English' },
    { code: 'hi', label: 'अ', name: 'Hindi' },
    { code: 'bn', label: 'অ', name: 'Bengali' },
    { code: 'ta', label: 'அ', name: 'Tamil' },
    { code: 'mr', label: 'म', name: 'Marathi' },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % slideshowImages.length);
    }, 5000);
    return () => clearTimeout(timer);
  }, [currentImageIndex]);

  return (
    <div className="bg-background text-foreground font-sans">
      {/* Navbar */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 navbar-glass"
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-primary-glow shadow-warm">
              <LogoIcon />
            </div>
            <div>
              <span className="font-display text-2xl font-bold text-gradient">{t('landing.title')}</span>
              <p className="text-xs text-muted-foreground hidden sm:block">Handcrafted Excellence</p>
            </div>
          </div>
          
          <div className="space-x-4 hidden sm:flex items-center">
            {/* Language Selector */}
            <div className="flex items-center gap-1 p-1 rounded-full bg-muted">
              {languages.map(lang => (
                <motion.button
                  key={lang.code}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setLanguage(lang.code)}
                  aria-label={`Switch to ${lang.name}`}
                  className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 text-sm font-semibold ${
                    language === lang.code 
                      ? 'bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-warm' 
                      : 'text-muted-foreground hover:bg-card'
                  }`}
                >
                  {lang.label}
                </motion.button>
              ))}
            </div>
            
            <div className="w-px h-6 bg-border"></div>
            
            <div className="space-x-2 flex items-center">
              <Button variant="ghost" onClick={bypassLogin}>{t('landing.guest')}</Button>
              <Button variant="ghost" onClick={() => setAuthPage('login')}>{t('landing.login')}</Button>
              <Button onClick={() => setAuthPage('signup')}>{t('landing.getStarted')}</Button>
            </div>
          </div>
        </div>
      </motion.header>
      
      {/* Mobile Guest Button */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="sm:hidden fixed top-4 right-4 z-50"
      >
        <Button variant="secondary" onClick={bypassLogin}>
          {t('landing.guest')}
        </Button>
      </motion.div>

      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Slideshow Background */}
          <AnimatePresence mode="wait">
            {slideshowImages.map((src, index) => (
              index === currentImageIndex && (
                <motion.img
                  key={src}
                  src={src}
                  alt="Artisan crafts"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )
            ))}
          </AnimatePresence>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 hero-overlay z-10" />
          
          {/* Pattern Overlay */}
          <div className="pattern-overlay z-10" />
          
          {/* Content */}
          <div className="relative z-20 text-center px-6 max-w-5xl mx-auto pt-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <span className="badge-accent mb-6 inline-block">
                <svg className="w-4 h-4 mr-2 inline" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Empowering Traditional Artisans
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight"
            >
              {t('landing.title')}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-6 text-xl md:text-2xl font-medium text-accent"
            >
              {t('landing.subtitle')}
            </motion.p>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="mt-4 text-lg text-white/80 max-w-2xl mx-auto"
            >
              {t('landing.description')}
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
            >
              <Button size="lg" onClick={() => setAuthPage('signup')} className="text-lg">
                {t('landing.join')}
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
              <Button variant="ghost" size="lg" onClick={bypassLogin} className="text-lg text-white border-2 border-white/30 hover:bg-white/10">
                Explore as Guest
              </Button>
            </motion.div>
            
            {/* Scroll indicator */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2"
            >
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-8 h-12 rounded-full border-2 border-white/30 flex items-start justify-center p-2"
              >
                <div className="w-1.5 h-3 bg-white/60 rounded-full" />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-6 bg-card section-divider">
          <div className="container mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <span className="badge-warm mb-4 inline-block">Platform Features</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
                {t('landing.toolkitTitle')}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                {t('landing.toolkitDescription')}
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Feature 
                index={0}
                icon={<svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5Z" /></svg>} 
                title={t('landing.feature1Title')}
              >
                {t('landing.feature1Description')}
              </Feature>
              <Feature 
                index={1}
                icon={<svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.776 48.776 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" /></svg>} 
                title={t('landing.feature2Title')}
              >
                {t('landing.feature2Description')}
              </Feature>
              <Feature 
                index={2}
                icon={<svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} 
                title={t('landing.feature3Title')}
              >
                {t('landing.feature3Description')}
              </Feature>
              <Feature 
                index={3}
                icon={<svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><rect x="3" y="7" width="15" height="10" rx="1.5" /><rect x="6" y="4" width="15" height="10" rx="1.5" /></svg>} 
                title={t('landing.feature4Title')}
              >
                {t('landing.feature4Description')}
              </Feature>
              <Feature 
                index={4}
                icon={<svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} 
                title={t('landing.feature5Title')}
              >
                {t('landing.feature5Description')}
              </Feature>
              <Feature 
                index={5}
                icon={<svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>} 
                title={t('landing.feature6Title')}
              >
                {t('landing.feature6Description')}
              </Feature>
            </div>
          </div>
        </section>

        {/* Volunteer Section */}
        <section className="py-24 px-6 bg-muted">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="badge-warm mb-4 inline-block">{t('landing.usp')}</span>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
                  {t('landing.collaborationTitle')}
                </h2>
                <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                  {t('landing.collaborationDescription')}
                </p>
                <Button className="mt-8" onClick={() => setAuthPage('signup')}>
                  {t('landing.becomeVolunteer')}
                  <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl" />
                <img 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=500&fit=crop&q=80" 
                  alt="Volunteer collaborating" 
                  className="relative rounded-3xl shadow-elevated w-full h-96 object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Customer Section */}
        <section className="py-24 px-6 bg-card">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative order-last md:order-first"
              >
                <div className="absolute -inset-4 bg-gradient-to-r from-accent/20 to-primary/20 rounded-3xl blur-2xl" />
                <img 
                  src="https://content.jdmagicbox.com/v2/comp/chennai/p8/044pxx44.xx44.091117143649.w8p8/catalogue/handkraft-treasures-anna-nagar-chennai-handicraft-item-dealers-mw3ln7n5t0.jpg" 
                  alt="Handcrafted products" 
                  className="relative rounded-3xl shadow-elevated w-full h-96 object-cover"
                />
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="badge-accent mb-4 inline-block">{t('landing.forShoppers')}</span>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
                  {t('landing.treasuresTitle')}
                </h2>
                <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                  {t('landing.treasuresDescription')}
                </p>
                <Button variant="secondary" className="mt-8" onClick={() => setAuthPage('signup')}>
                  {t('landing.startExploring')}
                  <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 px-6 bg-muted section-divider">
          <div className="container mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <span className="badge-warm mb-4 inline-block">Getting Started</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
                {t('landing.howItWorksTitle')}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                {t('landing.howItWorksDescription')}
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-12">
              <div>
                <h3 className="font-display text-2xl font-bold mb-8 text-primary">{t('landing.forArtisans')}</h3>
                <Step number="1" title={t('landing.artisansStep1Title')} index={0}>{t('landing.artisansStep1Description')}</Step>
                <Step number="2" title={t('landing.artisansStep2Title')} index={1}>{t('landing.artisansStep2Description')}</Step>
                <Step number="3" title={t('landing.artisansStep3Title')} index={2}>{t('landing.artisansStep3Description')}</Step>
              </div>
              
              <div>
                <h3 className="font-display text-2xl font-bold mb-8 text-chart-3">{t('landing.forVolunteers')}</h3>
                <Step number="1" title={t('landing.volunteersStep1Title')} index={0}>{t('landing.volunteersStep1Description')}</Step>
                <Step number="2" title={t('landing.volunteersStep2Title')} index={1}>{t('landing.volunteersStep2Description')}</Step>
                <Step number="3" title={t('landing.volunteersStep3Title')} index={2}>{t('landing.volunteersStep3Description')}</Step>
              </div>
              
              <div>
                <h3 className="font-display text-2xl font-bold mb-8 text-chart-5">{t('landing.forCustomers')}</h3>
                <Step number="1" title={t('landing.customersStep1Title')} index={0}>{t('landing.customersStep1Description')}</Step>
                <Step number="2" title={t('landing.customersStep2Title')} index={1}>{t('landing.customersStep2Description')}</Step>
                <Step number="3" title={t('landing.customersStep3Title')} index={2}>{t('landing.customersStep3Description')}</Step>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-32 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-glow to-accent" />
          <div className="pattern-overlay" />
          
          <div className="relative z-10 container mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-4xl md:text-6xl font-bold text-white">
                {t('landing.ctaTitle')}
              </h2>
              <p className="mt-6 text-xl text-white/80 max-w-2xl mx-auto">
                {t('landing.ctaDescription')}
              </p>
              <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  size="lg" 
                  onClick={() => setAuthPage('signup')} 
                  className="bg-white text-primary hover:bg-white/90 text-lg"
                >
                  {t('landing.getStarted')}
                </Button>
                <Button 
                  variant="ghost" 
                  size="lg" 
                  onClick={bypassLogin}
                  className="text-white border-2 border-white/30 hover:bg-white/10 text-lg"
                >
                  {t('landing.guest')}
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-16 px-6 bg-foreground text-background">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-primary-glow">
                  <LogoIcon />
                </div>
                <div>
                  <span className="font-display text-xl font-bold">{t('landing.title')}</span>
                  <p className="text-sm text-background/60">Handcrafted Excellence</p>
                </div>
              </div>
              
              <p className="text-background/60 text-center">
                © 2024 Apna Udyog. Empowering artisans, preserving traditions.
              </p>
              
              <div className="flex gap-4">
                <motion.a 
                  whileHover={{ scale: 1.1 }} 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </motion.a>
                <motion.a 
                  whileHover={{ scale: 1.1 }} 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </motion.a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default LandingPage;
