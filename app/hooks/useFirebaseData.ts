import { useState, useEffect } from 'react';
import { FirebaseService, Agent, Lead, Commission } from '../services/firebaseService';
import { useFirebase } from '../context/FirebaseContext';

// Hook for real-time leads
export const useLeads = (agentId?: string) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!agentId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Subscribe to real-time updates
    const unsubscribe = FirebaseService.subscribeToLeads(agentId, (updatedLeads) => {
      setLeads(updatedLeads);
      setLoading(false);
      setError(null);
    });

    // Cleanup subscription
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [agentId]);

  return { leads, loading, error };
};

// Hook for real-time commissions
export const useCommissions = (agentId?: string) => {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!agentId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    
    // Subscribe to real-time updates
    const unsubscribe = FirebaseService.subscribeToCommissions(agentId, (updatedCommissions) => {
      setCommissions(updatedCommissions);
      setLoading(false);
      setError(null);
    });

    // Cleanup subscription
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [agentId]);

  return { commissions, loading, error };
};

// Hook for agent statistics
export const useAgentStats = () => {
  const { agent, leads, commissions } = useFirebase();
  const [stats, setStats] = useState({
    totalCommission: 0,
    pendingCommission: 0,
    paidCommission: 0,
    totalLeads: 0,
    convertedLeads: 0,
    conversionRate: 0,
    thisMonthCommission: 0,
    thisMonthLeads: 0,
  });

  useEffect(() => {
    if (!agent || !leads || !commissions) return;

    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Calculate commission stats
    const totalCommission = commissions.reduce((sum, comm) => sum + comm.amount, 0);
    const pendingCommission = commissions
      .filter(comm => comm.status === 'pending')
      .reduce((sum, comm) => sum + comm.amount, 0);
    const paidCommission = commissions
      .filter(comm => comm.status === 'paid')
      .reduce((sum, comm) => sum + comm.amount, 0);

    // Calculate lead stats
    const totalLeads = leads.length;
    const convertedLeads = leads.filter(lead => lead.status === 'converted').length;
    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

    // This month stats
    const thisMonthCommission = commissions
      .filter(comm => comm.createdAt >= thisMonth)
      .reduce((sum, comm) => sum + comm.amount, 0);
    const thisMonthLeads = leads.filter(lead => lead.createdAt >= thisMonth).length;

    setStats({
      totalCommission,
      pendingCommission,
      paidCommission,
      totalLeads,
      convertedLeads,
      conversionRate,
      thisMonthCommission,
      thisMonthLeads,
    });
  }, [agent, leads, commissions]);

  return stats;
};

// Hook for lead management
export const useLeadManagement = () => {
  const { createLead, updateLead } = useFirebase();
  const [loading, setLoading] = useState(false);

  const addLead = async (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    try {
      const result = await createLead({
        ...leadData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return result;
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (leadId: string, status: Lead['status']) => {
    setLoading(true);
    try {
      const result = await updateLead(leadId, { status });
      return result;
    } finally {
      setLoading(false);
    }
  };

  const updateLeadDetails = async (leadId: string, updates: Partial<Lead>) => {
    setLoading(true);
    try {
      const result = await updateLead(leadId, updates);
      return result;
    } finally {
      setLoading(false);
    }
  };

  return {
    addLead,
    updateLeadStatus,
    updateLeadDetails,
    loading,
  };
};

// Hook for authentication
export const useAuth = () => {
  const { user, loading, login, register, logout } = useFirebase();
  const [authLoading, setAuthLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    setAuthLoading(true);
    try {
      const result = await login(email, password);
      return result;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (email: string, password: string, agentData: Omit<Agent, 'id'>) => {
    setAuthLoading(true);
    try {
      const result = await register(email, password, agentData);
      return result;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    setAuthLoading(true);
    try {
      await logout();
    } finally {
      setAuthLoading(false);
    }
  };

  return {
    user,
    loading: loading || authLoading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };
};
