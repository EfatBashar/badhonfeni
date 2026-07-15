import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserPlus2 } from "lucide-react";

interface Profile {
  id: string;
  phone: string;
  blood_group: string;
  created_at: string;
}

const formatBn = (iso: string) => {
  try {
    return new Date(iso).toLocaleString("bn-BD", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

const NewSignupsList = () => {
  const { data: profiles, isLoading } = useQuery({
    queryKey: ["admin_profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Profile[];
    },
  });

  if (isLoading) return <p className="text-muted-foreground">লোড হচ্ছে...</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <UserPlus2 className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">
          নতুন সাইনআপ ({profiles?.length || 0})
        </h2>
      </div>

      {profiles && profiles.length > 0 ? (
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ফোন</TableHead>
                <TableHead>রক্তের গ্রুপ</TableHead>
                <TableHead>সাইনআপ তারিখ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.phone || "—"}</TableCell>
                  <TableCell>{p.blood_group || "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatBn(p.created_at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border py-12 text-center text-muted-foreground">
          এখনো কেউ সাইনআপ করেনি
        </div>
      )}
    </div>
  );
};

export default NewSignupsList;
