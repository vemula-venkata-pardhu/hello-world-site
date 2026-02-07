import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { AppContext } from '../contexts/AppContext';
import Card, { CardContent } from '../components/common/Card';
import Button from '../components/common/Button';
import { LogoIcon } from '../components/common/Icons';
import type { Artisan, Volunteer } from '../types';

const ProfileSetupPage: React.FC = () => {
    const { currentUser, updateUserProfile } = useContext(AppContext)!;
    const [formData, setFormData] = useState({
        name: currentUser?.name || '',
        location: (currentUser as Artisan)?.location || '',
        bio: (currentUser as Artisan)?.bio || '',
        story: (currentUser as Artisan)?.story || '',
        skills: (currentUser as Volunteer)?.skills?.join(', ') || '',
        motivation: (currentUser as Volunteer)?.motivation || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalData = {
            ...currentUser,
            ...formData,
            skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        };
        updateUserProfile(finalData);
    };

    const inputClasses = "w-full px-4 py-3 bg-muted/50 text-foreground border-2 border-border rounded-xl transition-all duration-300 focus:bg-card focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none placeholder:text-muted-foreground";
    const labelClasses = "font-semibold text-foreground block mb-2";

    const renderArtisanForm = () => (
        <>
            <div className="text-center mb-8">
                <h2 className="font-display text-2xl font-bold text-foreground">Welcome, Artisan!</h2>
                <p className="text-muted-foreground mt-2">Let's set up your public profile. Tell the world your story.</p>
            </div>
            <div>
                <label htmlFor="name" className={labelClasses}>Your Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={inputClasses} placeholder="Enter your full name" />
            </div>
            <div>
                <label htmlFor="location" className={labelClasses}>Location</label>
                <input type="text" name="location" id="location" placeholder="e.g., Jaipur, Rajasthan" value={formData.location} onChange={handleChange} className={inputClasses} />
            </div>
            <div>
                <label htmlFor="bio" className={labelClasses}>Short Bio</label>
                <textarea name="bio" id="bio" placeholder="A short, catchy bio to appear on your profile." value={formData.bio} onChange={handleChange} className={`${inputClasses} h-24 resize-none`} />
            </div>
            <div>
                <label htmlFor="story" className={labelClasses}>Your Story (Optional)</label>
                <textarea name="story" id="story" placeholder="Share the story behind your craft, your inspiration, or your heritage." value={formData.story} onChange={handleChange} className={`${inputClasses} h-32 resize-none`} />
            </div>
        </>
    );

    const renderVolunteerForm = () => (
        <>
            <div className="text-center mb-8">
                <h2 className="font-display text-2xl font-bold text-foreground">Welcome, Volunteer!</h2>
                <p className="text-muted-foreground mt-2">Let's build your profile so artisans can find you.</p>
            </div>
            <div>
                <label htmlFor="name" className={labelClasses}>Your Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={inputClasses} placeholder="Enter your full name" />
            </div>
            <div>
                <label htmlFor="skills" className={labelClasses}>Your Skills</label>
                <input type="text" name="skills" id="skills" placeholder="e.g., Photography, Graphic Design, Marketing" value={formData.skills} onChange={handleChange} className={inputClasses} />
                <p className="text-xs text-muted-foreground mt-2">Enter skills separated by commas.</p>
            </div>
            <div>
                <label htmlFor="bio" className={labelClasses}>Short Bio</label>
                <textarea name="bio" id="bio" placeholder="Tell us a little about yourself and your experience." value={formData.bio} onChange={handleChange} className={`${inputClasses} h-24 resize-none`} />
            </div>
            <div>
                <label htmlFor="motivation" className={labelClasses}>Your Motivation (Optional)</label>
                <textarea name="motivation" id="motivation" placeholder="What inspires you to volunteer with artisans?" value={formData.motivation} onChange={handleChange} className={`${inputClasses} h-24 resize-none`} />
            </div>
        </>
    );

    const renderCustomerForm = () => (
         <>
            <div className="text-center mb-8">
                <h2 className="font-display text-2xl font-bold text-foreground">Welcome!</h2>
                <p className="text-muted-foreground mt-2">Just one step before you start exploring.</p>
            </div>
            <div>
                <label htmlFor="name" className={labelClasses}>Confirm Your Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={inputClasses} placeholder="Enter your full name" />
            </div>
        </>
    );

    const renderForm = () => {
        switch (currentUser?.role) {
            case 'artisan': return renderArtisanForm();
            case 'volunteer': return renderVolunteerForm();
            case 'customer': return renderCustomerForm();
            default: return <p className="text-muted-foreground">Loading form...</p>;
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
                className="absolute top-1/4 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl" 
            />
            <motion.div 
                animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ duration: 10, repeat: Infinity, delay: 1 }}
                className="absolute bottom-1/4 -right-24 w-96 h-96 bg-accent/20 rounded-full blur-3xl" 
            />

            {/* Header */}
            <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="flex items-center space-x-3 mb-8 z-10"
            >
                <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-warm">
                    <LogoIcon />
                </div>
                <h1 className="font-display text-3xl font-bold text-foreground">
                    Complete Your Profile
                </h1>
            </motion.div>

            {/* Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="w-full max-w-lg z-10 relative"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-xl opacity-50" />
                <div className="relative bg-card/90 backdrop-blur-xl rounded-3xl shadow-elevated border border-border/50 overflow-hidden">
                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {renderForm()}
                            <Button type="submit" className="w-full !mt-8 py-3 text-base">
                                Save and Continue
                            </Button>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ProfileSetupPage;