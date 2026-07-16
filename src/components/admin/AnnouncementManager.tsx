import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save, Megaphone } from "lucide-react";

const AnnouncementManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const { data: current, isLoading } = useQuery({
    queryKey: ["admin_announcement"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (current) {
      setMessage(current.message);
      setIsActive(current.is_active);
    }
  }, [current]);

  const handleSave = async () => {
    if (!message.trim()) {
      toast({ title: "খালি রাখা যাবে না", description: "ঘোষণা লিখুন।", variant: "destructive" });
      return;
    }
    setSaving(true);
    let error;
    if (current?.id) {
      ({ error } = await supabase
        .from("announcements")
        .update({ message: message.trim(), is_active: isActive })
        .eq("id", current.id));
    } else {
      ({ error } = await supabase
        .from("announcements")
        .insert({ message: message.trim(), is_active: isActive }));
    }
    setSaving(false);
    if (error) {
      toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "সফল", description: "ঘোষণা আপডেট হয়েছে।" });
      queryClient.invalidateQueries({ queryKey: ["admin_announcement"] });
      queryClient.invalidateQueries({ queryKey: ["active_announcement"] });
    }
  };

  if (isLoading) return <p className="text-muted-foreground">লোড হচ্ছে...</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Megaphone className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">হেডলাইন ঘোষণা</h2>
      </div>

      <p className="text-sm text-muted-foreground">
        এখানে যা লিখবেন হোমপেজে TV-এর হেডলাইনের মতো স্ক্রল হয়ে বারবার দেখাবে।
      </p>

      <div className="space-y-2">
        <Label htmlFor="announcement-message">ঘোষণার লেখা</Label>
        <Textarea
          id="announcement-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="যেমন: জরুরি O+ রক্ত প্রয়োজন — ফেনী সদর হাসপাতাল..."
          rows={4}
          className="resize-none"
        />
      </div>

      <div className="flex items-center justify-between rounded-lg border border-border p-3">
        <div>
          <Label htmlFor="announcement-active" className="text-sm font-medium">
            সক্রিয়
          </Label>
          <p className="text-xs text-muted-foreground">বন্ধ থাকলে হোমপেজে দেখাবে না</p>
        </div>
        <Switch id="announcement-active" checked={isActive} onCheckedChange={setIsActive} />
      </div>

      <Button onClick={handleSave} disabled={saving} className="gap-2">
        <Save className="h-4 w-4" />
        {saving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
      </Button>
    </div>
  );
};

export default AnnouncementManager;
