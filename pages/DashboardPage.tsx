import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import type { Page, Artisan, BargainRequest, Product, User, ConnectionRequest, Role } from '../types';
import Button from '../components/common/Button';
import Card, { CardHeader, CardContent, CardTitle } from '../components/common/Card';
import { useLocalization } from '../hooks/useLocalization';
import { AppContext } from '../contexts/AppContext';

interface DashboardPageProps {
  setActivePage: (page: Page) => void;
}

const FeatureIcon: React.FC<{ children: React.ReactNode; variant?: 'primary' | 'accent' | 'secondary' }> = ({ children, variant = 'primary' }) => {
  const variants = {
    primary: 'bg-gradient-to-br from-primary to-primary-glow',
    accent: 'bg-gradient-to-br from-accent to-primary',
    secondary: 'bg-gradient-to-br from-chart-3 to-chart-5',
  };
  
  return (
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 shadow-warm ${variants[variant]}`}>
      {children}
    </div>
  );
};

const StepCard: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  buttonText: string; 
  onClick: () => void; 
  index: number;
}> = ({ icon, title, description, buttonText, onClick, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
  >
    <Card className="h-full flex flex-col">
      {icon}
      <h3 className="font-display text-xl font-bold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground mb-6 flex-grow leading-relaxed">{description}</p>
      <Button variant="secondary" onClick={onClick} className="w-full justify-center">
        {buttonText}
      </Button>
    </Card>
  </motion.div>
);

const SpotlightCard: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  buttonText: string; 
  onClick: () => void; 
  index: number;
}> = ({ icon, title, description, buttonText, onClick, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    className="lg:col-span-2"
  >
    <Card gradient className="h-full">
      <div className="flex items-start gap-6">
        <div className="flex-shrink-0 p-4 bg-white/20 rounded-2xl">{icon}</div>
        <div>
          <h3 className="font-display text-3xl font-bold">{title}</h3>
          <p className="mt-2 text-primary-foreground/80 text-lg max-w-lg leading-relaxed">{description}</p>
        </div>
      </div>
      <div className="mt-8">
        <Button 
          className="bg-white text-primary hover:bg-white/90 font-semibold px-10 py-4 text-lg" 
          onClick={onClick}
        >
          {buttonText}
        </Button>
      </div>
    </Card>
  </motion.div>
);

const BargainRequests: React.FC = () => {
  const { currentUser, bargainRequests, updateBargainRequestStatus } = useContext(AppContext)!;
  const { t } = useLocalization();
  const pendingRequests = bargainRequests.filter(req => req.artisanId === currentUser?.id && req.status === 'pending');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-accent/20">
            <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <CardTitle>{t('dashboard.artisan.bargain.title', { count: pendingRequests.length })}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {pendingRequests.length > 0 ? (
          <div className="space-y-4">
            {pendingRequests.map((req, index) => (
              <motion.div 
                key={req.id} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col sm:flex-row items-center p-4 bg-muted rounded-xl gap-4 hover:bg-muted/80 transition-colors"
              >
                <img src={req.productImage} alt={req.productName} className="w-16 h-16 rounded-xl object-cover ring-2 ring-border" />
                <div className="flex-1 text-center sm:text-left">
                  <p><span className="font-bold text-foreground">{req.customerName}</span> offered <span className="font-semibold text-primary">₹{req.offerPrice.toLocaleString()}</span> for <span className="font-semibold">{req.productName}</span></p>
                  <p className="text-sm text-muted-foreground">Original Price: ₹{req.originalPrice.toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => updateBargainRequestStatus(req.id, 'accepted')}>Accept</Button>
                  <Button variant="secondary" size="sm" onClick={() => updateBargainRequestStatus(req.id, 'rejected')}>Reject</Button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-muted-foreground">{t('dashboard.artisan.bargain.empty')}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ConnectionRequests: React.FC = () => {
  const { currentUser, connectionRequests, respondToConnectionRequest } = useContext(AppContext)!;
  const { t } = useLocalization();
  const pendingRequests = connectionRequests.filter(req => req.receiverId === currentUser?.id && req.status === 'pending');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-chart-3/20">
            <svg className="w-6 h-6 text-chart-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <CardTitle>{t('dashboard.artisan.connectionRequests.title')} ({pendingRequests.length})</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {pendingRequests.length > 0 ? (
          <div className="space-y-4">
            {pendingRequests.map((req, index) => (
              <motion.div 
                key={req.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col sm:flex-row items-center p-4 bg-muted rounded-xl gap-4 hover:bg-muted/80 transition-colors"
              >
                <img src={req.senderAvatar} alt={req.senderName} className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/20" />
                <div className="flex-1 text-center sm:text-left">
                  <p><span className="font-bold text-foreground">{req.senderName}</span> wants to connect with you.</p>
                  <p className="text-sm text-muted-foreground capitalize">{t(`roles.${req.senderRole}`)}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => respondToConnectionRequest(req, 'accepted')}>Accept</Button>
                  <Button variant="secondary" size="sm" onClick={() => respondToConnectionRequest(req, 'rejected')}>Reject</Button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <p className="text-muted-foreground">{t('dashboard.artisan.connectionRequests.empty')}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ArtisanWelcomePage: React.FC<DashboardPageProps> = ({ setActivePage }) => {
  const { t } = useLocalization();
  const { currentUser } = useContext(AppContext)!;

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <span className="badge-warm inline-block mb-4">Welcome Back</span>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
          {t('dashboard.artisan.welcome', { name: currentUser!.name.split(' ')[0] })}
        </h1>
        <p className="text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
          {t('dashboard.artisan.subtitle')}
        </p>
      </motion.section>
      
      {/* Requests Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <BargainRequests />
        <ConnectionRequests />
      </div>

      {/* Getting Started Section */}
      <section>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-10"
        >
          <h2 className="font-display text-3xl font-bold text-foreground">{t('dashboard.artisan.getStarted.title')}</h2>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SpotlightCard
            index={0}
            icon={<svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
            title={t('dashboard.artisan.getStarted.step2_title')}
            description={t('dashboard.artisan.getStarted.step2_desc')}
            buttonText={t('dashboard.artisan.getStarted.step2_button')}
            onClick={() => setActivePage('volunteers')}
          />
          
          <StepCard
            index={1}
            icon={<FeatureIcon><svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg></FeatureIcon>}
            title={t('dashboard.artisan.getStarted.step1_title')}
            description={t('dashboard.artisan.getStarted.step1_desc')}
            buttonText={t('dashboard.artisan.getStarted.step1_button')}
            onClick={() => setActivePage('photo-studio')}
          />
          
          <StepCard
            index={2}
            icon={<FeatureIcon variant="accent"><svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg></FeatureIcon>}
            title={t('dashboard.artisan.getStarted.step3_title')}
            description={t('dashboard.artisan.getStarted.step3_desc')}
            buttonText={t('dashboard.artisan.getStarted.step3_button')}
            onClick={() => setActivePage('finance')}
          />
          
          <StepCard
            index={3}
            icon={<FeatureIcon variant="secondary"><svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg></FeatureIcon>}
            title={t('dashboard.artisan.getStarted.step4_title')}
            description={t('dashboard.artisan.getStarted.step4_desc')}
            buttonText={t('dashboard.artisan.getStarted.step4_button')}
            onClick={() => setActivePage('nft')}
          />
        </div>
      </section>
    </div>
  );
};

const VolunteerWelcomePage: React.FC<DashboardPageProps> = ({ setActivePage }) => {
  const { t } = useLocalization();
  const { currentUser, artisans, setSelectedPortfolioUser } = useContext(AppContext)!;
  const featuredArtisan = artisans.find(a => a.id === '102');

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-80 rounded-3xl overflow-hidden"
      >
        <img 
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6kaGFdq7VUXUQlDXz5UI5--6dfQW76OX3Bw&s" 
          alt="Hero" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-overlay" />
        <div className="pattern-overlay" />
        
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <span className="badge-accent mb-4">Volunteer Hub</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white">
            {t('dashboard.volunteer.heroTitle')}
          </h1>
          <p className="text-xl text-white/80 mt-4 max-w-2xl">
            {t('dashboard.volunteer.heroSubtitle', { name: currentUser!.name.split(' ')[0] })}
          </p>
        </div>
      </motion.section>

      <ConnectionRequests />

      {/* Main Action Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card gradient className="h-full flex flex-col justify-center">
            <h2 className="font-display text-4xl font-bold">{t('dashboard.volunteer.findNew')}</h2>
            <p className="mt-4 text-primary-foreground/80 text-lg max-w-lg leading-relaxed">
              {t('dashboard.volunteer.findNewDesc')}
            </p>
            <div className="mt-8">
              <Button 
                className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-3" 
                onClick={() => setActivePage('volunteers')}
              >
                {t('dashboard.volunteer.browseProjects')}
                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </div>
          </Card>
        </motion.div>
        
        {featuredArtisan && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full flex flex-col items-center text-center">
              <span className="badge-warm mb-4">{t('dashboard.volunteer.featuredArtisan')}</span>
              <div className="relative">
                <img 
                  src={featuredArtisan.avatar} 
                  alt={featuredArtisan.name} 
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-accent ring-offset-4 ring-offset-card mb-4" 
                />
              </div>
              <h4 className="font-display font-bold text-xl text-foreground">{featuredArtisan.name}</h4>
              <p className="text-sm text-muted-foreground">{featuredArtisan.location}</p>
              <p className="text-sm text-muted-foreground mt-4 flex-grow italic leading-relaxed">"{featuredArtisan.bio}"</p>
              <Button 
                variant="secondary" 
                className="w-full mt-6" 
                onClick={() => setSelectedPortfolioUser(featuredArtisan as Artisan)}
              >
                {t('dashboard.viewProfile')}
              </Button>
            </Card>
          </motion.div>
        )}
      </section>
    </div>
  );
};

const DashboardPage: React.FC<DashboardPageProps> = ({ setActivePage }) => {
  const { currentUser } = useContext(AppContext)!;
  
  return currentUser?.role === 'volunteer' 
    ? <VolunteerWelcomePage setActivePage={setActivePage} />
    : <ArtisanWelcomePage setActivePage={setActivePage} />;
};

export default DashboardPage;
