import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { apiClient, User, Lead, Commission, isAuthenticated } from '../services/api';

// Types
interface AppState {
  // Auth
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  
  // Data
  leads: Lead[];
  commissions: Commission[];
  promotionalContent: any[];
  
  // UI State
  currentScreen: string;
  notifications: Notification[];
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: number;
}

type AppAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_LEADS'; payload: Lead[] }
  | { type: 'ADD_LEAD'; payload: Lead }
  | { type: 'UPDATE_LEAD'; payload: { id: string; data: Partial<Lead> } }
  | { type: 'SET_COMMISSIONS'; payload: Commission[] }
  | { type: 'SET_PROMOTIONAL_CONTENT'; payload: any[] }
  | { type: 'SET_CURRENT_SCREEN'; payload: string }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' }
  | { type: 'RESET_STATE' };

// Initial state
const initialState: AppState = {
  isAuthenticated: false,
  user: null,
  isLoading: true,
  leads: [],
  commissions: [],
  promotionalContent: [],
  currentScreen: 'home',
  notifications: [],
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'SET_LEADS':
      return { ...state, leads: action.payload };
    
    case 'ADD_LEAD':
      return { ...state, leads: [action.payload, ...state.leads] };
    
    case 'UPDATE_LEAD':
      return {
        ...state,
        leads: state.leads.map(lead =>
          lead.id === action.payload.id
            ? { ...lead, ...action.payload.data }
            : lead
        ),
      };
    
    case 'SET_COMMISSIONS':
      return { ...state, commissions: action.payload };
    
    case 'SET_PROMOTIONAL_CONTENT':
      return { ...state, promotionalContent: action.payload };
    
    case 'SET_CURRENT_SCREEN':
      return { ...state, currentScreen: action.payload };
    
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };
    
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
      };
    
    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] };
    
    case 'RESET_STATE':
      return { ...initialState, isLoading: false };
    
    default:
      return state;
  }
}

// Context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  
  // Auth actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => Promise<void>;
  
  // Data actions
  fetchLeads: () => Promise<void>;
  createLead: (leadData: any) => Promise<boolean>;
  updateLead: (id: string, data: Partial<Lead>) => Promise<boolean>;
  fetchCommissions: () => Promise<void>;
  fetchPromotionalContent: () => Promise<void>;
  
  // UI actions
  navigateTo: (screen: string) => void;
  showNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  hideNotification: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize app
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const authenticated = await isAuthenticated();
      dispatch({ type: 'SET_AUTHENTICATED', payload: authenticated });
      
      if (authenticated) {
        const userResponse = await apiClient.getCurrentUser();
        if (userResponse.success && userResponse.data) {
          dispatch({ type: 'SET_USER', payload: userResponse.data });
          
          // Fetch initial data
          await Promise.all([
            fetchLeads(),
            fetchCommissions(),
            fetchPromotionalContent(),
          ]);
        }
      }
    } catch (error) {
      console.error('App initialization error:', error);
      showNotification({
        type: 'error',
        title: 'Initialization Error',
        message: 'Failed to initialize app. Please restart.',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Auth actions
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await apiClient.login({ email, password });
      
      if (response.success && response.data) {
        dispatch({ type: 'SET_AUTHENTICATED', payload: true });
        dispatch({ type: 'SET_USER', payload: response.data.user });
        
        showNotification({
          type: 'success',
          title: 'Welcome Back!',
          message: 'You have successfully logged in.',
        });
        
        // Fetch user data
        await Promise.all([
          fetchLeads(),
          fetchCommissions(),
          fetchPromotionalContent(),
        ]);
        
        return true;
      } else {
        showNotification({
          type: 'error',
          title: 'Login Failed',
          message: response.error || 'Invalid credentials',
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      showNotification({
        type: 'error',
        title: 'Login Error',
        message: 'Something went wrong. Please try again.',
      });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await apiClient.register(userData);
      
      if (response.success && response.data) {
        dispatch({ type: 'SET_AUTHENTICATED', payload: true });
        dispatch({ type: 'SET_USER', payload: response.data.user });
        
        showNotification({
          type: 'success',
          title: 'Welcome!',
          message: 'Your account has been created successfully.',
        });
        
        return true;
      } else {
        showNotification({
          type: 'error',
          title: 'Registration Failed',
          message: response.error || 'Failed to create account',
        });
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      showNotification({
        type: 'error',
        title: 'Registration Error',
        message: 'Something went wrong. Please try again.',
      });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await apiClient.logout();
      dispatch({ type: 'RESET_STATE' });
      showNotification({
        type: 'info',
        title: 'Logged Out',
        message: 'You have been successfully logged out.',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Data actions
  const fetchLeads = async (): Promise<void> => {
    try {
      const response = await apiClient.getLeads();
      if (response.success && response.data) {
        dispatch({ type: 'SET_LEADS', payload: response.data });
      }
    } catch (error) {
      console.error('Fetch leads error:', error);
    }
  };

  const createLead = async (leadData: any): Promise<boolean> => {
    try {
      const response = await apiClient.createLead(leadData);
      if (response.success && response.data) {
        dispatch({ type: 'ADD_LEAD', payload: response.data });
        showNotification({
          type: 'success',
          title: 'Lead Created',
          message: 'New lead has been added successfully.',
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Create lead error:', error);
      return false;
    }
  };

  const updateLead = async (id: string, data: Partial<Lead>): Promise<boolean> => {
    try {
      const response = await apiClient.updateLead(id, data);
      if (response.success) {
        dispatch({ type: 'UPDATE_LEAD', payload: { id, data } });
        showNotification({
          type: 'success',
          title: 'Lead Updated',
          message: 'Lead information has been updated.',
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Update lead error:', error);
      return false;
    }
  };

  const fetchCommissions = async (): Promise<void> => {
    try {
      const response = await apiClient.getCommissions();
      if (response.success && response.data) {
        dispatch({ type: 'SET_COMMISSIONS', payload: response.data });
      }
    } catch (error) {
      console.error('Fetch commissions error:', error);
    }
  };

  const fetchPromotionalContent = async (): Promise<void> => {
    try {
      const response = await apiClient.getPromotionalContent();
      if (response.success && response.data) {
        dispatch({ type: 'SET_PROMOTIONAL_CONTENT', payload: response.data });
      }
    } catch (error) {
      console.error('Fetch promotional content error:', error);
    }
  };

  // UI actions
  const navigateTo = (screen: string): void => {
    dispatch({ type: 'SET_CURRENT_SCREEN', payload: screen });
  };

  const showNotification = (notification: Omit<Notification, 'id' | 'timestamp'>): void => {
    const id = Date.now().toString();
    const timestamp = Date.now();
    
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: { ...notification, id, timestamp },
    });

    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
    }, 5000);
  };

  const hideNotification = (id: string): void => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };

  const contextValue: AppContextType = {
    state,
    dispatch,
    login,
    register,
    logout,
    fetchLeads,
    createLead,
    updateLead,
    fetchCommissions,
    fetchPromotionalContent,
    navigateTo,
    showNotification,
    hideNotification,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Hook to use the context
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
