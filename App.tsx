import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DashboardPage from './pages/DashboardPage';
import MarketplacePage from './pages/MarketplacePage';
import VolunteerPage from './pages/VolunteerPage';
import FinancePage from './pages/FinancePage';
import NftPage from './pages/NftPage';
import TrainingPage from './pages/TrainingPage';
import ChatPage from './pages/ChatPage';
import PhotoStudioPage from './pages/PhotoStudioPage';
import CartPage from './pages/CartPage';
import RoleSelectionPage from './pages/RoleSelectionPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import CustomerApp from './pages/CustomerApp';
import ArtisanProfilePage from './pages/ArtisanProfilePage';
import VolunteerProfilePage from './pages/VolunteerProfilePage';
import CustomerProductDetailPage from './pages/customer/CustomerProductDetailPage';
import type { Page, Artisan, Volunteer } from './types';
import { AppProvider, AppContext } from './contexts/AppContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';

const DashboardApp: React.FC = () => {
  const {
    activePage,
    setActivePage,
    theme,
    toggleTheme,
    language,
    setLanguage,
    t,
    selectedPortfolioUser,
    isInitialLogin,
    setIsInitialLogin,
    currentUser,
    setSelectedPortfolioUser,
    artisans,
    volunteers,
    firestoreError,
    selectedProduct
  } = useContext(AppContext)!;

  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (firestoreError) {
      setShowError(true);
    }
  }, [firestoreError]);

  useEffect(() => {
    if (isInitialLogin && currentUser && (artisans.length > 0 || volunteers.length > 0)) {
      const fullUser = currentUser.role === 'artisan'
        ? artisans.find(a => a.id === currentUser.id)
        : volunteers.find(v => v.id === currentUser.id);
      if (fullUser) {
        setSelectedPortfolioUser(fullUser);
        setIsInitialLogin(false);
      }
    }
  }, [isInitialLogin, currentUser, artisans, volunteers, setSelectedPortfolioUser, setIsInitialLogin]);

  const pageTitles: Record<Page, string> = {
    dashboard: t('sidebar.dashboard'),
    marketplace: t('sidebar.marketplace'),
    'photo-studio': t('sidebar.photoStudio'),
    volunteers: t('sidebar.volunteers'),
    finance: t('sidebar.finance'),
    nft: t('sidebar.nft'),
    training: t('sidebar.training'),
    chat: t('sidebar.chat'),
    cart: t('cart.title'),
    'customer-marketplace': '',
    'customer-cart': '',
    'customer-favorites': '',
    'customer-profile': '',
    'customer-checkout': '',
    'customer-chat': t('sidebar.chat'),
    'customer-orders': 'My Orders',
    'customer-offers': 'My Offers',
  };

  const renderPageTitle = () => {
    if (selectedProduct) return selectedProduct.name;
    if (selectedPortfolioUser) return selectedPortfolioUser.name;
    return pageTitles[activePage] || "Dashboard";
  };

  const renderContent = () => {
    if (selectedProduct) {
      const artisan = artisans.find(a => a.id === selectedProduct.artisanId);
      return <CustomerProductDetailPage product={selectedProduct} artisan={artisan} />;
    }
    if (selectedPortfolioUser) {
      if (selectedPortfolioUser.role === 'artisan') {
        return <ArtisanProfilePage artisan={selectedPortfolioUser as Artisan} />;
      }
      if (selectedPortfolioUser.role === 'volunteer') {
        return <VolunteerProfilePage volunteer={selectedPortfolioUser as Volunteer} />;
      }
    }

    switch (activePage) {
      case 'dashboard':
        return <DashboardPage setActivePage={setActivePage} />;
      case 'marketplace':
        return <MarketplacePage />;
      case 'photo-studio':
        return <PhotoStudioPage />;
      case 'volunteers':
        return <VolunteerPage />;
      case 'finance':
        return <FinancePage />;
      case 'nft':
        return <NftPage />;
      case 'training':
        return <TrainingPage />;
      case 'chat':
        return <ChatPage />;
      case 'cart':
        return <CartPage />;
      default:
        return <DashboardPage setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="flex h-screen bg-background font-sans">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        theme={theme}
        toggleTheme={toggleTheme}
        language={language}
        setLanguage={setLanguage}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={renderPageTitle()} />
        
        {showError && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-accent text-accent-foreground text-sm flex items-center justify-between p-4 flex-shrink-0 shadow-warm z-10"
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{firestoreError}</span>
            </div>
            <button 
              onClick={() => setShowError(false)} 
              className="p-1.5 rounded-full hover:bg-white/20 focus:outline-none transition-colors" 
              aria-label="Dismiss"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </motion.div>
        )}
        
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10">
          <motion.div
            key={activePage + (selectedPortfolioUser?.id || '')}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

const AppContent: React.FC = () => {
  const { isAuthenticated, authPage, currentUser, authLoading, bypassLogin } = useContext(AppContext)!;

  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      bypassLogin();
    }
  }, [authLoading, isAuthenticated, bypassLogin]);

  if (authLoading || !isAuthenticated) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-warm"
          >
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </motion.div>
          <p className="text-muted-foreground font-medium">Loading Apna Udyog...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <RoleSelectionPage />;
  }

  if (!currentUser.profileComplete) {
    return <ProfileSetupPage />;
  }

  if (currentUser.role === 'customer') {
    return <CustomerApp />;
  }

  return <DashboardApp />;
}

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
