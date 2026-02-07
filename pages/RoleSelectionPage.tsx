import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { AppContext } from '../contexts/AppContext';
import { useLocalization } from '../hooks/useLocalization';
import { LogoIcon } from '../components/common/Icons';
import type { Role, User, Artisan, Volunteer } from '../types';
import { getRandomProfileImage } from '../lib/initialData';

const RoleSelectionPage: React.FC = () => {
  const { setCurrentUser, firebaseUser } = useContext(AppContext)!;
  const { t } = useLocalization();

  const handleRoleSelect = (role: Role) => {
    if (!firebaseUser) return;

    const baseUser: User = {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || 'New User',
      avatar: firebaseUser.photoURL || getRandomProfileImage(firebaseUser.uid),
      role: role,
      profileComplete: false,
    };

    let fullUserProfile: User | Artisan | Volunteer = baseUser;

    if (role === 'artisan') {
      fullUserProfile = {
        ...baseUser,
        role: 'artisan',
        location: '',
        bio: '',
        story: '',
        storyVideoUrl: '',
      } as Artisan;
    } else if (role === 'volunteer') {
      fullUserProfile = {
        ...baseUser,
        role: 'volunteer',
        skills: [],
        bio: '',
        motivation: '',
        projectsCompleted: 0,
        completedProjects: [],
        testimonials: [],
      } as Volunteer;
    }

    setCurrentUser(fullUserProfile);
  };

  const roles = [
    {
      role: 'artisan' as Role,
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2 1m0 0l-2-1m2 1V2M4 7l2 1M4 7l2-1M4 7v2.5M12 21l-2-1m0 0l-2 1m2-1v-2.5M6 18l-2-1m2 1l-2 1m2-1V14m6 4l2 1m-2-1l2-1m-2 1v-2.5" />
        </svg>
      ),
      gradient: 'from-primary to-accent',
      bgGlow: 'bg-primary/30',
    },
    {
      role: 'volunteer' as Role,
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      gradient: 'from-accent to-primary-glow',
      bgGlow: 'bg-accent/30',
    },
    {
      role: 'customer' as Role,
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      gradient: 'from-primary-glow to-primary',
      bgGlow: 'bg-primary-glow/30',
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-8 font-sans relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/30 to-background" />
      
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.15, 0.35, 0.15]
        }}
        transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-accent/20 rounded-full blur-3xl" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.25, 0.1]
        }}
        transition={{ duration: 12, repeat: Infinity, delay: 4 }}
        className="absolute top-3/4 left-1/4 w-[300px] h-[300px] bg-primary-glow/15 rounded-full blur-3xl" 
      />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-primary/40 rounded-full"
          style={{
            left: `${20 + i * 12}%`,
            top: `${15 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 z-10"
      >
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
          className="flex items-center justify-center gap-4 mb-6"
        >
          <div className="p-4 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-warm">
            <LogoIcon />
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground">
            {t('login.title')}
          </h1>
        </motion.div>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-muted-foreground text-lg sm:text-xl max-w-md mx-auto"
        >
          {t('login.subtitle')}
        </motion.p>
      </motion.div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl w-full z-10">
        {roles.map((item, index) => (
          <motion.div
            key={item.role}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.15, duration: 0.5 }}
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleRoleSelect(item.role)}
            className="relative group cursor-pointer"
          >
            {/* Glow effect */}
            <div className={`absolute inset-0 ${item.bgGlow} rounded-3xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500`} />
            
            {/* Card */}
            <div className="relative bg-card/80 backdrop-blur-xl rounded-3xl border border-border/50 shadow-card hover:shadow-elevated transition-all duration-300 overflow-hidden">
              {/* Top gradient bar */}
              <div className={`h-1.5 bg-gradient-to-r ${item.gradient}`} />
              
              <div className="p-8 text-center">
                {/* Icon */}
                <motion.div 
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                  className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-warm mb-6`}
                >
                  {item.icon}
                </motion.div>
                
                {/* Title */}
                <h3 className="font-display text-2xl font-bold text-foreground mb-3">
                  {t(`roles.${item.role}`)}
                </h3>
                
                {/* Description */}
                <p className="text-muted-foreground leading-relaxed">
                  {t(`login.${item.role}Description`)}
                </p>

                {/* CTA hint */}
                <div className="mt-6 flex items-center justify-center gap-2 text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>Get Started</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom decorative line */}
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent rounded-full"
      />
    </div>
  );
};

export default RoleSelectionPage;