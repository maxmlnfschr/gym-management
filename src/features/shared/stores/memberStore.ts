import { create } from 'zustand';
import { Member, MemberFormData } from '@/features/members/types';
import { supabase } from '@/lib/supabase';
import { PostgrestError } from '@supabase/supabase-js';

interface MemberState {
  members: Member[];
  loading: boolean;
  error: string | null;
  selectedMember: Member | null;
  
  // Métodos de estado
  setMembers: (members: Member[]) => void;
  setSelectedMember: (member: Member | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Métodos CRUD con Supabase
  fetchMembers: () => Promise<void>;
  addMember: (memberData: MemberFormData) => Promise<void>;
  updateMember: (id: string, memberData: Partial<MemberFormData>) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
}

export const useMemberStore = create<MemberState>((set, get) => ({
  members: [],
  loading: false,
  error: null,
  selectedMember: null,

  // Métodos de estado
  setMembers: (members) => set({ members }),
  setSelectedMember: (member) => set({ selectedMember: member }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Implementaciones CRUD
  fetchMembers: async () => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('status', 'active');

      if (error) throw error;
      set({ members: data });
    } catch (error) {
      const pgError = error as PostgrestError;
      set({ error: pgError.message });
    } finally {
      set({ loading: false });
    }
  },

  addMember: async (memberData) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('members')
        .insert([{ ...memberData, status: 'active' }])
        .select()
        .single();

      if (error) throw error;
      set((state) => ({ members: [...state.members, data] }));
    } catch (error) {
      const pgError = error as PostgrestError;
      set({ error: pgError.message });
    } finally {
      set({ loading: false });
    }
  },

  updateMember: async (id, memberData) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('members')
        .update(memberData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        members: state.members.map((member) => 
          member.id === id ? data : member
        )
      }));
    } catch (error) {
      const pgError = error as PostgrestError;
      set({ error: pgError.message });
    } finally {
      set({ loading: false });
    }
  },

  deleteMember: async (id) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase
        .from('members')
        .update({ status: 'deleted', deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      set((state) => ({
        members: state.members.filter((member) => member.id !== id)
      }));
    } catch (error) {
      const pgError = error as PostgrestError;
      set({ error: pgError.message });
    } finally {
      set({ loading: false });
    }
  },
}));