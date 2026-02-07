import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { AppContext } from '../../contexts/AppContext';
import Button from '../common/Button';
import type { Role } from '../../types';

interface HeaderProps {
  title: string;
}

const RoleSwitcher: React.FC = () => {
  const { currentUser, switchUserRole } = useContext(AppContext)!;

  if (!currentUser) return null;

  const roles: Role[] = ['artisan', 'volunteer', 'customer'];
  const otherRoles = roles.filter(r => r !== currentUser.role);

  const roleColors: Record<Role, string> = {
    artisan: 'from-primary to-primary-glow',
    volunteer: 'from-blue-500 to-cyan-500',
    customer: 'from-violet-500 to-purple-500',
  };

  const roleIcons: Record<Role, React.ReactNode> = {
    artisan: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    ),
    volunteer: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    customer: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-muted-foreground hidden sm:inline">Switch View:</span>
      <div className="flex gap-2">
        {otherRoles.map(role => (
          <motion.button
            key={role}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => switchUserRole(role)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold capitalize text-white bg-gradient-to-r ${roleColors[role]} shadow-warm transition-shadow hover:shadow-elevated`}
          >
            {roleIcons[role]}
            <span className="hidden sm:inline">{role}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="navbar-glass p-4 sm:p-6 flex items-center justify-between sticky top-0 z-10"
    >
      <div className="flex items-center gap-4">
        <motion.h1 
          key={title}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="font-display text-2xl sm:text-3xl font-bold text-foreground truncate"
        >
          {title}
        </motion.h1>
      </div>
      <RoleSwitcher />
    </motion.header>
  );
};

export default Header;
