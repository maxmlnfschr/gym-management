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
  getMember: (id: string) => Promise<Member>;  // Add this line
  addMember: (memberData: MemberFormData) => Promise<void>;
  updateMember: (id: string, memberData: Partial<MemberFormData>) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  fetchMembers: () => Promise<void>;
}

export const useMemberStore = create<MemberState>((set) => ({
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
        .select(`
          *,
          current_membership:memberships(
            id,
            start_date,
            end_date,
            payment_status
          )
        `)
        .eq('status', 'active')
        .order('created_at', { foreignTable: 'memberships', ascending: false })
        .limit(1, { foreignTable: 'memberships' });

      if (error) throw error;

      // Transform the data to include current_membership as a single object instead of an array
      const transformedData = data.map(member => ({
        ...member,
        current_membership: member.current_membership?.[0] || null
      }));

      set({ members: transformedData });
    } catch (error) {
      const pgError = error as PostgrestError;
      set({ error: pgError.message });
    } finally {
      set({ loading: false });
    }
  },

  addMember: async (memberData: MemberFormData) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase
        .from('members')
        .insert([{
          first_name: memberData.first_name,
          last_name: memberData.last_name,
          email: memberData.email,
          phone: memberData.phone,
          notes: memberData.notes,
          status: 'active'
        }])
        .select('*')
        .single();

      if (error) throw error;
      set((state) => ({ members: [...state.members, data] }));
      return data;
    } catch (error) {
      const pgError = error as PostgrestError;
      set({ error: pgError.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateMember: async (id: string, memberData: Partial<MemberFormData>) => {
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
  deleteMember: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const { error } = await supabase
        .from('members')
        .update({ deleted_at: new Date().toISOString() })  // Ya no necesitamos actualizar el status
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
  getMember: async (id: string) => {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
}));
