import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Page } from '../../types';
import { NavIcon, LogoIcon } from '../common/Icons';
import { useLocalization, type Language } from '../../hooks/useLocalization';
import { AppContext } from '../../contexts/AppContext';

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
  theme: string;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (language: Language) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage, theme, toggleTheme, language, setLanguage }) => {
  const { t } = useLocalization();
  const { currentUser, logout, selectedPortfolioUser, setSelectedPortfolioUser, artisans, volunteers } = useContext(AppContext)!;

  const allNavItems: { id: Page; title: string; icon: React.ReactElement; roles: ('artisan' | 'volunteer')[] }[] = [
    { id: 'dashboard', title: t('sidebar.dashboard'), icon: <NavIcon type="dashboard" />, roles: ['artisan', 'volunteer'] },
    { id: 'marketplace', title: t('sidebar.marketplace'), icon: <NavIcon type="marketplace" />, roles: ['artisan'] },
    { id: 'photo-studio', title: t('sidebar.photoStudio'), icon: <NavIcon type="photostudio" />, roles: ['artisan'] },
    { id: 'volunteers', title: t('sidebar.volunteers'), icon: <NavIcon type="volunteers" />, roles: ['artisan', 'volunteer'] },
    { id: 'finance', title: t('sidebar.finance'), icon: <NavIcon type="finance" />, roles: ['artisan'] },
    { id: 'nft', title: t('sidebar.nft'), icon: <NavIcon type="nft" />, roles: ['artisan'] },
    { id: 'training', title: t('sidebar.training'), icon: <NavIcon type="training" />, roles: ['artisan', 'volunteer'] },
    { id: 'chat', title: t('sidebar.chat'), icon: <NavIcon type="community" />, roles: ['artisan', 'volunteer'] },
  ];

  const navItems = allNavItems.filter(item => currentUser && item.roles.includes(currentUser.role as 'artisan' | 'volunteer'));

  const languages: { code: Language; label: string; name: string; }[] = [
    { code: 'en', label: 'A', name: 'English' },
    { code: 'hi', label: 'अ', name: 'Hindi' },
    { code: 'bn', label: 'অ', name: 'Bengali' },
    { code: 'ta', label: 'அ', name: 'Tamil' },
    { code: 'mr', label: 'म', name: 'Marathi' },
  ];

  const handleLogout = () => {
    logout();
  };

  const handleViewProfile = () => {
    if (!currentUser) return;
    const fullUser = currentUser.role === 'artisan'
      ? artisans.find(a => a.id === currentUser.id)
      : volunteers.find(v => v.id === currentUser.id);
    if (fullUser) setSelectedPortfolioUser(fullUser);
  };

  return (
    <aside className="w-72 bg-sidebar flex-col hidden sm:flex border-r border-border">
      {/* Logo Section */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={logout} 
        className="p-6 border-b border-border flex items-center space-x-3 cursor-pointer group"
      >
        <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-primary-glow shadow-warm">
          <LogoIcon />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold text-gradient">Apna Udyog</h1>
          <p className="text-xs text-muted-foreground">Handcrafted Excellence</p>
        </div>
      </motion.div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item, index) => {
          const isActive = activePage === item.id && !selectedPortfolioUser;
          return (
            <motion.a
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setActivePage(item.id);
                setSelectedPortfolioUser(null);
              }}
              className={`relative flex items-center px-4 py-3 rounded-xl transition-all duration-300 group ${
                isActive
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <AnimatePresence>
                {isActive && (
                  <motion.span 
                    layoutId="activeIndicator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-primary to-primary-glow rounded-r-full"
                  />
                )}
              </AnimatePresence>
              <span className={`transition-colors duration-300 ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`}>
                {item.icon}
              </span>
              <span className="ml-4">{item.title}</span>
            </motion.a>
          );
        })}
      </nav>

      {/* User & Settings Section */}
      <div className="p-4 border-t border-border space-y-4">
        {/* User Card */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="flex items-center p-3 rounded-xl bg-muted/50 hover:bg-muted cursor-pointer transition-colors duration-300" 
          onClick={handleViewProfile}
        >
          <div className="relative">
            <img 
              src={currentUser?.avatar} 
              alt="User" 
              className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20 ring-offset-2 ring-offset-sidebar" 
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-chart-3 rounded-full border-2 border-sidebar" />
          </div>
          <div className="ml-3 flex-1">
            <p className="font-semibold text-foreground">{currentUser?.name}</p>
            <p className="text-sm text-muted-foreground capitalize">{t(`roles.${currentUser?.role}`)}</p>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); handleLogout(); }} 
            className="p-2 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors duration-300" 
            title="Logout"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </motion.div>

        {/* Language Selector */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
          <span className="text-sm font-medium text-muted-foreground">{t('sidebar.language')}</span>
          <div className="flex gap-1">
            {languages.map(lang => (
              <motion.button
                key={lang.code}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setLanguage(lang.code)}
                aria-label={`Switch to ${lang.name}`}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-all duration-300 ${
                  language === lang.code 
                    ? 'bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-warm' 
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                {lang.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Theme Toggle */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
          <span className="text-sm font-medium text-muted-foreground">{t('sidebar.theme')}</span>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="p-1.5 rounded-full flex items-center bg-card border border-border"
          >
            <span className={`p-1.5 rounded-full transition-all duration-300 ${
              theme === 'light' 
                ? 'bg-gradient-to-br from-primary to-primary-glow text-primary-foreground' 
                : 'text-muted-foreground'
            }`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </span>
            <span className={`p-1.5 rounded-full transition-all duration-300 ${
              theme === 'dark' 
                ? 'bg-gradient-to-br from-primary to-primary-glow text-primary-foreground' 
                : 'text-muted-foreground'
            }`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </span>
          </motion.button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
