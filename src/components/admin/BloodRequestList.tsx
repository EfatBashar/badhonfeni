import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Trash2, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BloodRequestList = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery({
    queryKey: ["blood_requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blood_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("blood_requests").update({ status }).eq("id", id);
    if (error) {
      toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
    } else {
      queryClient.invalidateQueries({ queryKey: ["blood_requests"] });
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("blood_requests").delete().eq("id", id);
    if (error) {
      toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
    } else {
      queryClient.invalidateQueries({ queryKey: ["blood_requests"] });
    }
  };

  if (isLoading) return <p className="text-muted-foreground">লোড হচ্ছে...</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">রক্তের অনুরোধ ({requests?.length || 0})</h2>

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>রোগী</TableHead>
              <TableHead>গ্রুপ</TableHead>
              <TableHead>হাসপাতাল</TableHead>
              <TableHead>ফোন</TableHead>
              <TableHead>অবস্থা</TableHead>
              <TableHead className="w-20"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests?.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.patient_name}</TableCell>
                <TableCell>{r.blood_group}</TableCell>
                <TableCell>{r.hospital}</TableCell>
                <TableCell>{r.contact_phone}</TableCell>
                <TableCell>
                  <Badge variant={r.status === "pending" ? "secondary" : "default"}>
                    {r.status === "pending" ? "অপেক্ষমান" : "সম্পন্ন"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {r.status === "pending" && (
                      <Button variant="ghost" size="icon" onClick={() => updateStatus(r.id, "completed")}>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </Button>
                    )}
                    {r.status === "completed" && (
                      <Button variant="ghost" size="icon" onClick={() => updateStatus(r.id, "pending")}>
                        <Clock className="h-4 w-4 text-yellow-600" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(r.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BloodRequestList;
