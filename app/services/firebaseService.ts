import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  DocumentData,
  QuerySnapshot,
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import { db, auth } from '../config/firebase';

// Types
export interface Agent {
  id?: string;
  name: string;
  email: string;
  phone: string;
  commissionRate: number;
  totalCommission: number;
  activeLeads: number;
  joinDate: Date;
  status: 'active' | 'inactive' | 'pending';
}

export interface Lead {
  id?: string;
  agentId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  packageType: string;
  status: 'new' | 'contacted' | 'interested' | 'converted' | 'lost';
  value: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Commission {
  id?: string;
  agentId: string;
  leadId: string;
  amount: number;
  percentage: number;
  status: 'pending' | 'paid' | 'cancelled';
  createdAt: Date;
  paidAt?: Date;
}

// Firebase Service Class
export class FirebaseService {
  // Authentication Methods
  static async registerAgent(email: string, password: string, agentData: Omit<Agent, 'id'>) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create agent document
      const agentDoc = {
        ...agentData,
        joinDate: Timestamp.fromDate(agentData.joinDate),
      };
      
      await addDoc(collection(db, 'agents'), {
        ...agentDoc,
        userId: user.uid,
      });
      
      return { success: true, user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static async loginAgent(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static async logoutAgent() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Agent Methods
  static async getAgent(agentId: string): Promise<Agent | null> {
    try {
      const docRef = doc(db, 'agents', agentId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          joinDate: data.joinDate.toDate(),
        } as Agent;
      }
      return null;
    } catch (error) {
      console.error('Error getting agent:', error);
      return null;
    }
  }

  static async updateAgent(agentId: string, updates: Partial<Agent>) {
    try {
      const docRef = doc(db, 'agents', agentId);
      await updateDoc(docRef, updates);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Lead Methods
  static async createLead(leadData: Omit<Lead, 'id'>) {
    try {
      const leadDoc = {
        ...leadData,
        createdAt: Timestamp.fromDate(leadData.createdAt),
        updatedAt: Timestamp.fromDate(leadData.updatedAt),
      };
      
      const docRef = await addDoc(collection(db, 'leads'), leadDoc);
      return { success: true, id: docRef.id };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static async getLeadsByAgent(agentId: string): Promise<Lead[]> {
    try {
      const q = query(
        collection(db, 'leads'),
        where('agentId', '==', agentId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const leads: Lead[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        leads.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as Lead);
      });
      
      return leads;
    } catch (error) {
      console.error('Error getting leads:', error);
      return [];
    }
  }

  static async updateLead(leadId: string, updates: Partial<Lead>) {
    try {
      const docRef = doc(db, 'leads', leadId);
      const updateData = {
        ...updates,
        updatedAt: Timestamp.now(),
      };
      
      await updateDoc(docRef, updateData);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Commission Methods
  static async createCommission(commissionData: Omit<Commission, 'id'>) {
    try {
      const commissionDoc = {
        ...commissionData,
        createdAt: Timestamp.fromDate(commissionData.createdAt),
        paidAt: commissionData.paidAt ? Timestamp.fromDate(commissionData.paidAt) : null,
      };
      
      const docRef = await addDoc(collection(db, 'commissions'), commissionDoc);
      return { success: true, id: docRef.id };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static async getCommissionsByAgent(agentId: string): Promise<Commission[]> {
    try {
      const q = query(
        collection(db, 'commissions'),
        where('agentId', '==', agentId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const commissions: Commission[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        commissions.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          paidAt: data.paidAt ? data.paidAt.toDate() : undefined,
        } as Commission);
      });
      
      return commissions;
    } catch (error) {
      console.error('Error getting commissions:', error);
      return [];
    }
  }

  // Real-time listeners
  static subscribeToLeads(agentId: string, callback: (leads: Lead[]) => void) {
    const q = query(
      collection(db, 'leads'),
      where('agentId', '==', agentId),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const leads: Lead[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        leads.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
        } as Lead);
      });
      callback(leads);
    });
  }

  static subscribeToCommissions(agentId: string, callback: (commissions: Commission[]) => void) {
    const q = query(
      collection(db, 'commissions'),
      where('agentId', '==', agentId),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const commissions: Commission[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        commissions.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          paidAt: data.paidAt ? data.paidAt.toDate() : undefined,
        } as Commission);
      });
      callback(commissions);
    });
  }
}
