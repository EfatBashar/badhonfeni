import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCommitteeMembers, bloodGroups } from "@/data/donors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CommitteeManagement = () => {
  const { data: members, isLoading } = useCommitteeMembers();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "", phone: "", blood_group: "A+", role: "", department: "", session: "",
  });

  const handleAdd = async () => {
    if (!form.name || !form.phone || !form.role) return;
    const { error } = await supabase.from("committee_members").insert({
      name: form.name,
      phone: form.phone,
      blood_group: form.blood_group,
      role: form.role,
      department: form.department || null,
      session: form.session || null,
    });
    if (error) {
      toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "সফল", description: "সদস্য যোগ করা হয়েছে" });
      setForm({ name: "", phone: "", blood_group: "A+", role: "", department: "", session: "" });
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["committee_members"] });
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("committee_members").delete().eq("id", id);
    if (error) {
      toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
    } else {
      queryClient.invalidateQueries({ queryKey: ["committee_members"] });
    }
  };

  if (isLoading) return <p className="text-muted-foreground">লোড হচ্ছে...</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">কমিটি সদস্য ({members?.length || 0})</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4" /> যোগ করুন</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>নতুন সদস্য যোগ করুন</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>নাম</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div><Label>পদবী</Label><Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="সভাপতি, সম্পাদক..." /></div>
              <div><Label>ফোন</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              <div>
                <Label>রক্তের গ্রুপ</Label>
                <Select value={form.blood_group} onValueChange={(v) => setForm({ ...form, blood_group: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{bloodGroups.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>বিভাগ</Label><Input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} /></div>
              <div><Label>সেশন</Label><Input value={form.session} onChange={(e) => setForm({ ...form, session: e.target.value })} placeholder="২০২২-২০২৩" /></div>
              <Button className="w-full" onClick={handleAdd}>যোগ করুন</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>নাম</TableHead>
              <TableHead>পদবী</TableHead>
              <TableHead>গ্রুপ</TableHead>
              <TableHead>ফোন</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members?.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="font-medium">{m.name}</TableCell>
                <TableCell>{m.role}</TableCell>
                <TableCell>{m.blood_group}</TableCell>
                <TableCell>{m.phone}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(m.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CommitteeManagement;
