import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { Membership } from "@/features/memberships/types";

interface CreateMembershipData extends Omit<Membership, "id" | "createdAt"> {
  payment_method?: "cash" | "card" | "transfer" | "other";
  payment_notes?: string;
}

interface MembershipStore {
  memberships: Membership[];
  isLoading: boolean;
  error: string | null;
  fetchMemberships: (memberId?: string) => Promise<void>;
  createMembership: (data: CreateMembershipData) => Promise<void>;
  updateMembership: (
    id: string,
    membership: Partial<Membership>
  ) => Promise<void>;
  deleteMembership: (id: string) => Promise<void>;
}

export const useMembershipStore = create<MembershipStore>((set, get) => ({
  memberships: [],
  isLoading: false,
  error: null,

  fetchMemberships: async (memberId?: string) => {
    set({ isLoading: true, error: null });
    try {
      let query = supabase.from("memberships").select("*");

      if (memberId) {
        query = query.eq("member_id", memberId);
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) throw error;
      set({ memberships: data as Membership[] });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  createMembership: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const { payment_method, payment_notes, ...membershipData } = data;

      // Crear la membresía
      const { data: membership, error: membershipError } = await supabase
        .from("memberships")
        .insert([membershipData])
        .select(
          `
          *,
          membership_plans (
            price,
            name
          )
        `
        )
        .single();

      if (membershipError) throw membershipError;

      // Si se especificó método de pago, crear el registro de pago
      if (payment_method && membership) {
        const { error: paymentError } = await supabase
          .from("membership_payments")
          .insert([
            {
              membership_id: membership.id,
              amount: membership.membership_plans?.price || 0,
              payment_method,
              notes: payment_notes,
              status: "paid",
              payment_date: new Date().toISOString(),
            },
          ]);

        if (paymentError) throw paymentError;
      }

      set((state) => ({
        memberships: [membership as Membership, ...state.memberships],
      }));
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateMembership: async (id, membership) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("memberships")
        .update(membership)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      set((state) => ({
        memberships: state.memberships.map((m) =>
          m.id === id ? ({ ...m, ...data } as Membership) : m
        ),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteMembership: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from("memberships")
        .delete()
        .eq("id", id);

      if (error) throw error;
      set((state) => ({
        memberships: state.memberships.filter((m) => m.id !== id),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
