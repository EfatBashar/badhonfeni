import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Donor {
  id: string;
  name: string;
  blood_group: string;
  phone: string;
  last_donation: string | null;
  total_donations: number;
}

export interface CommitteeMember {
  id: string;
  name: string;
  role: string;
  phone: string;
  blood_group: string;
}

export const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export const useDonors = () =>
  useQuery({
    queryKey: ["donors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("donors")
        .select("*")
        .order("name");
      if (error) throw error;
      return data as Donor[];
    },
  });

export const useCommitteeMembers = () =>
  useQuery({
    queryKey: ["committee_members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("committee_members")
        .select("*")
        .order("created_at");
      if (error) throw error;
      return data as CommitteeMember[];
    },
  });
