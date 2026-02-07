import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = true,
  gradient = false,
  onClick,
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={hover ? { y: -4 } : undefined}
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-2xl 
        ${gradient 
          ? 'bg-gradient-to-br from-primary to-primary-glow text-primary-foreground' 
          : 'bg-card text-card-foreground'
        }
        shadow-card hover:shadow-elevated
        transition-shadow duration-300
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {/* Subtle pattern overlay */}
      <div className="pattern-overlay" />
      
      {/* Content */}
      <div className="relative z-10 p-6 sm:p-8">
        {children}
      </div>
    </motion.div>
  );
};

interface CardSubProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardSubProps> = ({ children, className = '' }) => {
  return (
    <div className={`border-b border-border pb-4 mb-6 ${className}`}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<CardSubProps> = ({ children, className = '' }) => {
  return (
    <h3 className={`font-display text-2xl font-bold text-foreground ${className}`}>
      {children}
    </h3>
  );
};

export const CardDescription: React.FC<CardSubProps> = ({ children, className = '' }) => {
  return (
    <p className={`mt-1 text-muted-foreground ${className}`}>
      {children}
    </p>
  );
};

export const CardContent: React.FC<CardSubProps> = ({ children, className = '' }) => {
  return <div className={className}>{children}</div>;
};

export const CardFooter: React.FC<CardSubProps> = ({ children, className = '' }) => {
  return (
    <div className={`mt-6 pt-4 border-t border-border ${className}`}>
      {children}
    </div>
  );
};

export default Card;
