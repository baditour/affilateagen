import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { FirebaseService, Agent, Lead, Commission } from '../services/firebaseService';

interface FirebaseContextType {
  // Auth state
  user: User | null;
  loading: boolean;
  
  // Agent data
  agent: Agent | null;
  
  // Data
  leads: Lead[];
  commissions: Commission[];
  
  // Auth methods
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, agentData: Omit<Agent, 'id'>) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  
  // Data methods
  createLead: (leadData: Omit<Lead, 'id'>) => Promise<{ success: boolean; error?: string }>;
  updateLead: (leadId: string, updates: Partial<Lead>) => Promise<{ success: boolean; error?: string }>;
  refreshData: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

interface FirebaseProviderProps {
  children: ReactNode;
}

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Load agent data
        await loadAgentData(user.uid);
      } else {
        setAgent(null);
        setLeads([]);
        setCommissions([]);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Load agent data
  const loadAgentData = async (userId: string) => {
    try {
      // Find agent by userId (you might need to adjust this query)
      // For now, we'll assume agentId = userId
      const agentData = await FirebaseService.getAgent(userId);
      setAgent(agentData);
      
      if (agentData) {
        // Load leads and commissions
        const [leadsData, commissionsData] = await Promise.all([
          FirebaseService.getLeadsByAgent(agentData.id!),
          FirebaseService.getCommissionsByAgent(agentData.id!)
        ]);
        
        setLeads(leadsData);
        setCommissions(commissionsData);
      }
    } catch (error) {
      console.error('Error loading agent data:', error);
    }
  };

  // Auth methods
  const login = async (email: string, password: string) => {
    try {
      const result = await FirebaseService.loginAgent(email, password);
      return result;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const register = async (email: string, password: string, agentData: Omit<Agent, 'id'>) => {
    try {
      const result = await FirebaseService.registerAgent(email, password, agentData);
      return result;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await FirebaseService.logoutAgent();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Data methods
  const createLead = async (leadData: Omit<Lead, 'id'>) => {
    try {
      const result = await FirebaseService.createLead(leadData);
      if (result.success && agent) {
        // Refresh leads
        const updatedLeads = await FirebaseService.getLeadsByAgent(agent.id!);
        setLeads(updatedLeads);
      }
      return result;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const updateLead = async (leadId: string, updates: Partial<Lead>) => {
    try {
      const result = await FirebaseService.updateLead(leadId, updates);
      if (result.success && agent) {
        // Refresh leads
        const updatedLeads = await FirebaseService.getLeadsByAgent(agent.id!);
        setLeads(updatedLeads);
      }
      return result;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const refreshData = async () => {
    if (agent) {
      const [leadsData, commissionsData] = await Promise.all([
        FirebaseService.getLeadsByAgent(agent.id!),
        FirebaseService.getCommissionsByAgent(agent.id!)
      ]);
      
      setLeads(leadsData);
      setCommissions(commissionsData);
    }
  };

  const value: FirebaseContextType = {
    user,
    loading,
    agent,
    leads,
    commissions,
    login,
    register,
    logout,
    createLead,
    updateLead,
    refreshData,
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
};
