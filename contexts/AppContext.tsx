import React, { createContext, useState, useEffect, ReactNode, useRef } from 'react';
import type { User, Page, Project, Volunteer, Artisan, Product, CartItem, Conversation, ChatMessage, Role, ParticipantDetails, BargainRequest, Notification, ConnectionRequest, ProjectApplication, Collaboration, CompletedProject, Certificate, CustomOrderRequest } from '../types';
import { useLocalization, type Language, LocalizationProvider } from '../hooks/useLocalization';
import { initialArtisans, initialVolunteers, initialProducts, initialProjects } from '../lib/initialData';

type AuthPage = 'landing' | 'login' | 'signup';

interface AppContextType {
    currentUser: User | null;
    setCurrentUser: (user: User | Artisan | Volunteer | null | ((prev: User | null) => User | Artisan | Volunteer | null)) => void;
    updateUserProfile: (profileData: Partial<Artisan | Volunteer | User>) => Promise<void>;
    activePage: Page;
    setActivePage: (page: Page) => void;
    theme: string;
    toggleTheme: () => void;
    language: Language;
    setLanguage: (language: Language) => void;
    projects: Project[];
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
    postNewProject: (projectData: { title: string; description: string; skillsNeeded: string[] }) => Promise<void>;
    volunteers: Volunteer[];
    setVolunteers: React.Dispatch<React.SetStateAction<Volunteer[]>>;
    artisans: Artisan[];
    products: Product[];
    addProduct: (productData: Omit<Product, 'id' | 'artisanId' | 'dateAdded'>, certificateId?: string) => Promise<void>;
    selectedProduct: Product | null;
    setSelectedProduct: (product: Product | null) => void;
    selectedPortfolioUser: User | null;
    setSelectedPortfolioUser: (user: User | null) => void;
    cart: CartItem[];
    addToCart: (product: Product, offerPrice: number) => void;
    removeFromCart: (productId: string) => void;
    updateCartQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    favorites: string[]; // Array of product IDs
    toggleFavorite: (productId: string) => void;
    isFavorite: (productId: string) => boolean;
    conversations: Conversation[];
    sendMessage: (conversationId: string, messageText: string) => Promise<void>;
    startChatWith: ParticipantDetails | null;
    startChat: (participant: ParticipantDetails) => void;
    createOrSelectConversation: (participant: ParticipantDetails) => Promise<string>;

    // Auth
    firebaseUser: any | null; // Placeholder for legacy type compatibility
    authLoading: boolean;
    isAuthenticated: boolean;
    isInitialLogin: boolean;
    setIsInitialLogin: (isInitial: boolean) => void;
    login: (email: string, pass: string) => Promise<any>;
    signup: (name: string, email: string, pass: string) => Promise<any>;
    loginWithGoogle: () => Promise<any>;
    logout: () => void;
    bypassLogin: () => void;
    authPage: AuthPage;
    setAuthPage: (page: AuthPage) => void;
    switchUserRole: (role: Role) => void;

    // Bargaining
    bargainRequests: BargainRequest[];
    createBargainRequest: (product: Product, offerPrice: number) => Promise<void>;
    updateBargainRequestStatus: (requestId: string, status: 'accepted' | 'rejected') => Promise<void>;
    completeBargainRequest: (requestId: string) => Promise<void>;

    // Custom Orders
    customOrders: CustomOrderRequest[];
    createCustomOrder: (request: Omit<CustomOrderRequest, 'id' | 'requestDate' | 'status'>) => Promise<void>;

    // Connection Requests
    connectionRequests: ConnectionRequest[];
    sendConnectionRequest: (receiver: User) => Promise<void>;
    respondToConnectionRequest: (request: ConnectionRequest, response: 'accepted' | 'rejected') => Promise<void>;

    // Project Applications & Collaborations
    projectApplications: ProjectApplication[];
    collaborations: Collaboration[];
    applyForProject: (project: Project) => Promise<void>;
    respondToApplication: (application: ProjectApplication, response: 'accepted' | 'declined') => Promise<void>;
    endCollaboration: (collaboration: Collaboration, feedback: string, rating: number) => Promise<void>;
    issueCertificate: (collaboration: Collaboration) => Promise<void>;
    addCertificate: (certificate: Certificate) => Promise<void>;
    certificates: Certificate[];
    getCertificate: (certificateId: string) => Promise<Certificate | null>;

    // Notifications
    notifications: Notification[];
    removeNotification: (id: string) => void;

    clearStartChat: () => void;
    t: (key: string, replacements?: { [key: string]: string | number }) => string;
    firestoreError: string | null;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

const AppProviderContent: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { t, language, setLanguage } = useLocalization();
    const [activePage, setActivePage] = useState<Page>('dashboard');
    const [theme, setTheme] = useState('light');

    // Auth state - LOCAL ONLY
    const [firebaseUser, setFirebaseUser] = useState<any | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authLoading, setAuthLoading] = useState(false);
    const [authPage, setAuthPage] = useState<AuthPage>('landing');
    const [isInitialLogin, setIsInitialLogin] = useState(false);

    // Data state - LOCAL ONLY
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [volunteers, setVolunteers] = useState<Volunteer[]>(initialVolunteers);
    const prevVolunteersRef = useRef<Volunteer[]>([]);
    const [artisans, setArtisans] = useState<Artisan[]>(initialArtisans);
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [firestoreError, setFirestoreError] = useState<string | null>(null);

    // UI State
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedPortfolioUser, setSelectedPortfolioUser] = useState<User | null>(null);

    // Cart & Favorites
    const [cart, setCart] = useState<CartItem[]>([
        { product: initialProducts[0], quantity: 1, offerPrice: initialProducts[0].price }
    ]);
    const [favorites, setFavorites] = useState<string[]>([]);

    // Chat
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [startChatWith, setStartChatWith] = useState<ParticipantDetails | null>(null);

    // Bargaining, Connections & Notifications
    const [bargainRequests, setBargainRequests] = useState<BargainRequest[]>([]);
    const [customOrders, setCustomOrders] = useState<CustomOrderRequest[]>([]);
    const [connectionRequests, setConnectionRequests] = useState<ConnectionRequest[]>([]);
    const [projectApplications, setProjectApplications] = useState<ProjectApplication[]>([]);
    const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // #region Notification Functions
    const removeNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const addNotification = (message: string, type: 'success' | 'info' | 'error', link?: Notification['link']) => {
        const id = Date.now().toString() + Math.random();
        setNotifications(prev => [...prev, { id, message, type, link }]);
        setTimeout(() => {
            removeNotification(id);
        }, 6000);
    };
    // #endregion

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    useEffect(() => {
        if (currentUser?.profileComplete) {
            if (currentUser.role === 'customer') {
                setActivePage('customer-marketplace');
            } else if (!isInitialLogin) {
                setActivePage('dashboard');
            }
            setSelectedPortfolioUser(null);
            setSelectedProduct(null);
        }
    }, [currentUser?.profileComplete, currentUser?.role]);

    useEffect(() => {
        if (selectedPortfolioUser) {
            setSelectedProduct(null);
        }
    }, [selectedPortfolioUser]);

    // #region Auth functions - MOCKED
    const login = async (email: string, pass: string) => {
        // Mock login
        const foundArtisan = artisans.find(a => a.email === email);
        if (foundArtisan) {
            setCurrentUser(foundArtisan);
            setIsAuthenticated(true);
            setFirebaseUser({ uid: foundArtisan.id, email: foundArtisan.email });
            // Ensure mock artisan has name
            if (!foundArtisan.name) setCurrentUser({ ...foundArtisan, name: "Artisan" });
            return;
        }
        const foundVolunteer = volunteers.find(v => v.email === email);
        if (foundVolunteer) {
            setCurrentUser(foundVolunteer);
            setIsAuthenticated(true);
            setFirebaseUser({ uid: foundVolunteer.id, email: foundVolunteer.email });
            // Ensure mock volunteer has name
            if (!foundVolunteer.name) setCurrentUser({ ...foundVolunteer, name: "Volunteer" });
            return;
        }

        // Mock Customer
        const mockCustomer: User = {
            id: 'mock_customer_1',
            name: 'Demo Customer',
            role: 'customer',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
            profileComplete: true,
        };
        setCurrentUser(mockCustomer);
        setIsAuthenticated(true);
        setFirebaseUser({ uid: mockCustomer.id, email: email });
    };

    const signup = async (name: string, email: string, pass: string) => {
        // Mock signup
        const newUser: User = {
            id: `user_${Date.now()}`,
            name: name,
            role: 'artisan', // Default to artisan for demo signup
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + name,
            profileComplete: false,
        };
        setCurrentUser(newUser);
        setIsAuthenticated(true);
        setFirebaseUser({ uid: newUser.id, email: email });
        return { user: { uid: newUser.id } };
    };

    const loginWithGoogle = async () => {
        return login('demo@example.com', 'password');
    }

    const logout = () => {
        setIsAuthenticated(false);
        setCurrentUser(null);
        setFirebaseUser(null);
        setAuthPage('landing');
        setCart([]);
        setFavorites([]);
    };

    const bypassLogin = () => {
        const guestUser: Artisan = {
            ...initialArtisans[0],
            id: `guest_${Date.now()}`,
            name: 'Guest User',
            profileComplete: false,
        };

        setFirebaseUser(null);
        setCurrentUser(guestUser);
        setIsAuthenticated(true);
        setAuthLoading(false);
        setAuthPage('landing');
    };

    const switchUserRole = (role: Role) => {
        if (!currentUser) return;

        let targetUser: User | Artisan | Volunteer | null = null;

        const mockCustomer: User = {
            id: 'customer_switched_1',
            name: currentUser.name || "Demo Customer",
            role: 'customer',
            avatar: currentUser.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Customer",
            profileComplete: true,
        };

        if (role === 'artisan') {
            const targetArtisan = artisans.find(a => a.id !== currentUser.id) || artisans[0];
            if (targetArtisan) {
                targetUser = { ...targetArtisan, profileComplete: true };
            }
        } else if (role === 'volunteer') {
            const targetVolunteer = volunteers.find(v => v.id !== currentUser.id) || volunteers[0];
            if (targetVolunteer) {
                targetUser = { ...targetVolunteer, profileComplete: true };
            }
        } else if (role === 'customer') {
            targetUser = mockCustomer;
        }

        if (targetUser) {
            setSelectedProduct(null);
            setSelectedPortfolioUser(null);
            setCurrentUser(targetUser);
            // Ensure name is present
            if (!targetUser.name) setCurrentUser({ ...targetUser, name: role.charAt(0).toUpperCase() + role.slice(1) });
        }
    };

    const updateUserProfile = async (profileData: Partial<Artisan | Volunteer | User>) => {
        setCurrentUser(prev => prev ? ({ ...prev, ...profileData, profileComplete: true } as any) : null);

        // Also update in the lists if they exist there
        if (currentUser?.role === 'artisan') {
            setArtisans(prev => prev.map(a => a.id === currentUser.id ? { ...a, ...profileData, profileComplete: true } as Artisan : a));
        } else if (currentUser?.role === 'volunteer') {
            setVolunteers(prev => prev.map(v => v.id === currentUser.id ? { ...v, ...profileData, profileComplete: true } as Volunteer : v));
        }
    };
    // #endregion

    const addCertificate = async (certificate: Certificate) => {
        setCertificates(prev => [...prev, certificate]);
        addNotification("Certificate added locally", "success");
    };

    const getCertificate = async (certificateId: string): Promise<Certificate | null> => {
        return certificates.find(c => c.id === certificateId) || null;
    };

    const addProduct = async (productData: Omit<Product, 'id' | 'artisanId' | 'dateAdded'>, certificateId?: string) => {
        if (!currentUser || currentUser.role !== 'artisan') return;

        const newProduct: Product = {
            id: `prod_${Date.now()}`,
            ...productData,
            artisanId: currentUser.id,
            dateAdded: new Date().toISOString(),
            certificateId: certificateId || undefined,
        } as Product;

        setProducts(prev => [newProduct, ...prev]);

        if (certificateId) {
            setCertificates(prev => prev.map(c => c.id === certificateId ? { ...c, assignedToProductId: newProduct.id } : c));
        }

        addNotification("Product added to local state", "success");
    };

    const postNewProject = async (projectData: { title: string; description: string; skillsNeeded: string[] }) => {
        if (!currentUser || currentUser.role !== 'artisan') return;

        const newProject: Project = {
            id: `proj_${Date.now()}`,
            ...projectData,
            postedBy: currentUser.name || "Unknown",
            status: 'Open',
        };

        setProjects(prev => [newProject, ...prev]);
        addNotification("Project posted locally", "success");
    };

    // Cart functions
    const addToCart = (product: Product, offerPrice: number) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.product.id === product.id);
            if (existingItem) {
                return prevCart.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1, offerPrice } : item);
            }
            return [...prevCart, { product, quantity: 1, offerPrice }];
        });
        addNotification(`Added ${product.name} to cart`, 'success');
    };

    const removeFromCart = (productId: string) => {
        setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
    };

    const updateCartQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            setCart(prevCart => prevCart.map(item => item.product.id === productId ? { ...item, quantity } : item));
        }
    };

    const clearCart = () => {
        setCart([]);
    }

    // Favorites functions
    const toggleFavorite = (productId: string) => {
        setFavorites(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
    };
    const isFavorite = (productId: string) => favorites.includes(productId);

    // #region Chat functions - MOCKED
    const startChat = (participant: ParticipantDetails) => {
        setStartChatWith(participant);
        if (currentUser?.role === 'customer') {
            setActivePage('customer-chat');
        } else {
            setActivePage('chat');
        }
    };

    const clearStartChat = () => setStartChatWith(null);

    const createOrSelectConversation = async (otherParticipant: ParticipantDetails): Promise<string> => {
        if (!currentUser) return '';
        const sortedIds = [currentUser.id, otherParticipant.id].sort();
        const conversationId = sortedIds.join('-');

        setConversations(prev => {
            const existing = prev.find(c => c.id === conversationId);
            if (existing) return prev;

            const newConv: Conversation = {
                id: conversationId,
                participantIds: sortedIds,
                participants: {
                    [currentUser.id]: { name: currentUser.name || "User", avatar: currentUser.avatar || "" },
                    [otherParticipant.id]: { name: otherParticipant.name, avatar: otherParticipant.avatar },
                },
                messages: []
            };
            return [...prev, newConv];
        });

        return conversationId;
    };

    const sendMessage = async (conversationId: string, messageText: string) => {
        if (!currentUser) return;

        const newMessage: ChatMessage = {
            id: `msg_${Date.now()}`,
            senderId: currentUser.id,
            text: messageText,
            timestamp: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
        };

        setConversations(prev => prev.map(c => {
            if (c.id === conversationId) {
                return {
                    ...c,
                    messages: [...(c.messages || []), newMessage],
                    lastMessage: {
                        text: messageText,
                        timestamp: { seconds: Date.now() / 1000, nanoseconds: 0 } as any
                    }
                };
            }
            return c;
        }));
    };
    // #endregion

    // #region Bargain functions - MOCKED
    const createBargainRequest = async (product: Product, offerPrice: number) => {
        if (!currentUser || currentUser.role !== 'customer') return;

        const newRequest: BargainRequest = {
            id: `req_${Date.now()}`,
            productId: product.id,
            productName: product.name,
            productImage: product.image,
            customerId: currentUser.id,
            customerName: currentUser.name || "Customer",
            artisanId: product.artisanId,
            originalPrice: product.price,
            offerPrice: offerPrice,
            status: 'pending',
            requestDate: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
        };
        setBargainRequests(prev => [...prev, newRequest]);
        addNotification("Offer sent!", "success");
    };

    const updateBargainRequestStatus = async (requestId: string, status: 'accepted' | 'rejected') => {
        setBargainRequests(prev => prev.map(req => req.id === requestId ? { ...req, status } : req));
        addNotification(`Offer ${status}`, "info");
    };

    const completeBargainRequest = async (requestId: string) => {
        // Mock completion
    };
    // #endregion

    // Custom Orders - MOCKED
    const createCustomOrder = async (request: Omit<CustomOrderRequest, 'id' | 'requestDate' | 'status'>) => {
        const newOrder: CustomOrderRequest = {
            id: `custom_${Date.now()}`,
            ...request,
            status: 'pending',
            requestDate: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
        }
        setCustomOrders(prev => [...prev, newOrder]);
        addNotification("Custom order request sent!", "success");
    };

    // Connection Requests - MOCKED
    const sendConnectionRequest = async (receiver: User) => {
        if (!currentUser) return;
        const newReq: ConnectionRequest = {
            id: `conn_${Date.now()}`,
            senderId: currentUser.id,
            receiverId: receiver.id,
            senderName: currentUser.name || "User",
            senderAvatar: currentUser.avatar || "",
            senderRole: currentUser.role,
            status: 'pending',
            timestamp: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
        }
        setConnectionRequests(prev => [...prev, newReq]);
        addNotification("Connection request sent", "success");
    };

    const respondToConnectionRequest = async (request: ConnectionRequest, response: 'accepted' | 'rejected') => {
        setConnectionRequests(prev => prev.filter(r => r.id !== request.id));
        if (response === 'accepted') {
            // Add logic to update connection lists if needed, e.g. artisans.connectedVolunteers
            addNotification("Connected!", "success");
        }
    };

    // Project Applications - MOCKED
    const applyForProject = async (project: Project) => {
        if (!currentUser) return;
        const newApp: ProjectApplication = {
            id: `app_${Date.now()}`,
            projectId: project.id,
            volunteerId: currentUser.id,
            artisanId: "", // Logic to get artisan ID from project needs project to have artisan reference or lookup
            status: 'pending',
            applicationDate: new Date().toISOString()
        };
        // Find project owner for notification/logic if needed
        const projectDetails = projects.find(p => p.id === project.id);
        if (projectDetails) {
            // Assumption: project details doesn't have artisanId explicitly in type from earlier, just postedBy. 
            // But for real app it should. For now just mock it.
            newApp.artisanId = "mock_artisan_id";
        }

        setProjectApplications(prev => [...prev, newApp]);
        addNotification("Application sent", "success");
    };

    const respondToApplication = async (application: ProjectApplication, response: 'accepted' | 'declined') => {
        setProjectApplications(prev => prev.map(app => app.id === application.id ? { ...app, status: response } : app));

        if (response === 'accepted') {
            const newCollab: Collaboration = {
                id: `collab_${Date.now()}`,
                projectId: application.projectId,
                volunteerId: application.volunteerId,
                artisanId: currentUser!.id,
                status: 'in-progress',
                startDate: new Date().toISOString()
            };
            setCollaborations(prev => [...prev, newCollab]);
        }
    };

    const endCollaboration = async (collaboration: Collaboration, feedback: string, rating: number) => {
        setCollaborations(prev => prev.map(c => c.id === collaboration.id ? { ...c, status: 'completed', feedback, rating } : c));
        addNotification("Collaboration ended", "success");
    };

    const issueCertificate = async (collaboration: Collaboration) => {
        addNotification("Certificate issued", "success");
    };

    return (
        <AppContext.Provider value={{
            currentUser,
            setCurrentUser: (user) => {
                if (typeof user === 'function') {
                    setCurrentUser(user);
                } else {
                    setCurrentUser(user);
                }
            },
            updateUserProfile,
            activePage,
            setActivePage,
            theme,
            toggleTheme,
            language,
            setLanguage,
            projects,
            setProjects,
            postNewProject,
            volunteers,
            setVolunteers,
            artisans,
            products,
            addProduct,
            selectedProduct,
            setSelectedProduct,
            selectedPortfolioUser,
            setSelectedPortfolioUser,
            cart,
            addToCart,
            removeFromCart,
            updateCartQuantity,
            clearCart,
            favorites,
            toggleFavorite,
            isFavorite,
            conversations,
            sendMessage,
            startChatWith,
            startChat,
            createOrSelectConversation,
            firebaseUser,
            authLoading,
            isAuthenticated,
            isInitialLogin,
            setIsInitialLogin,
            login,
            signup,
            loginWithGoogle,
            logout,
            bypassLogin,
            authPage,
            setAuthPage,
            switchUserRole,
            bargainRequests,
            createBargainRequest,
            updateBargainRequestStatus,
            completeBargainRequest,
            customOrders,
            createCustomOrder,
            connectionRequests,
            sendConnectionRequest,
            respondToConnectionRequest,
            projectApplications,
            collaborations,
            applyForProject,
            respondToApplication,
            endCollaboration,
            issueCertificate,
            addCertificate,
            certificates,
            getCertificate,
            notifications,
            removeNotification,
            clearStartChat,
            t,
            firestoreError
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('en');

    return (
        <LocalizationProvider value={{ language, setLanguage }}>
            <AppProviderContent>
                {children}
            </AppProviderContent>
        </LocalizationProvider>
    );
};