import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { bloodGroups } from "@/data/donors";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { UserPlus } from "lucide-react";

const DonorSignupForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: "", phone: "", blood_group: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.phone.trim() || !form.blood_group) {
      toast({ title: "ত্রুটি", description: "সব তথ্য পূরণ করুন", variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("donors").insert({
      name: form.name.trim(),
      phone: form.phone.trim(),
      blood_group: form.blood_group,
    });
    setLoading(false);

    if (error) {
      toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "সফল!", description: "আপনি ডোনার তালিকায় যোগ হয়েছেন। ধন্যবাদ! 🎉" });
      setForm({ name: "", phone: "", blood_group: "" });
      queryClient.invalidateQueries({ queryKey: ["donors"] });
    }
  };

  return (
    <section className="px-4 py-10">
      <div className="mx-auto max-w-md">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <UserPlus className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold text-foreground">ডোনার হিসেবে যোগ দিন</h2>
          </div>
          <p className="mb-5 text-sm text-muted-foreground">
            আপনি রক্তদান করতে চাইলে নিচের তথ্য দিয়ে যোগ দিন।
          </p>
          <div className="space-y-4">
            <div>
              <Label>আপনার নাম</Label>
              <Input
                placeholder="সম্পূর্ণ নাম লিখুন"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <Label>ফোন নম্বর</Label>
              <Input
                placeholder="01XXXXXXXXX"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div>
              <Label>রক্তের গ্রুপ</Label>
              <Select value={form.blood_group} onValueChange={(v) => setForm({ ...form, blood_group: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="রক্তের গ্রুপ নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  {bloodGroups.map((g) => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={handleSubmit} disabled={loading}>
              {loading ? "যোগ হচ্ছে..." : "ডোনার হিসেবে যোগ দিন"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DonorSignupForm;
