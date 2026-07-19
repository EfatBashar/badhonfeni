import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save, Megaphone, Image as ImageIcon, X } from "lucide-react";

const MAX_IMAGE_BYTES = 1.5 * 1024 * 1024; // ~1.5MB

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const AnnouncementManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

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
      setMessage(current.message ?? "");
      setImageUrl((current as { image_url?: string | null }).image_url ?? null);
      setIsActive(current.is_active);
    }
  }, [current]);

  const handleImagePick = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({ title: "ভুল ফাইল", description: "শুধু ছবি আপলোড করুন।", variant: "destructive" });
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast({
        title: "ছবি অনেক বড়",
        description: "১.৫MB এর কম ছবি ব্যবহার করুন।",
        variant: "destructive",
      });
      return;
    }
    try {
      const dataUrl = await fileToDataUrl(file);
      setImageUrl(dataUrl);
    } catch {
      toast({ title: "ত্রুটি", description: "ছবি পড়া যায়নি।", variant: "destructive" });
    }
  };

  const handleSave = async () => {
    if (!imageUrl && !message.trim()) {
      toast({
        title: "খালি রাখা যাবে না",
        description: "ঘোষণা লিখুন অথবা ছবি দিন।",
        variant: "destructive",
      });
      return;
    }
    setSaving(true);
    const payload = {
      message: message.trim(),
      image_url: imageUrl,
      is_active: isActive,
    };
    let error;
    if (current?.id) {
      ({ error } = await supabase.from("announcements").update(payload).eq("id", current.id));
    } else {
      ({ error } = await supabase.from("announcements").insert(payload));
    }
    setSaving(false);
    if (error) {
      toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "সফল", description: "ব্যানার আপডেট হয়েছে।" });
      queryClient.invalidateQueries({ queryKey: ["admin_announcement"] });
      queryClient.invalidateQueries({ queryKey: ["active_announcement"] });
    }
  };

  if (isLoading) return <p className="text-muted-foreground">লোড হচ্ছে...</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Megaphone className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">হোমপেজ ব্যানার</h2>
      </div>

      <p className="text-sm text-muted-foreground">
        ছবি দিলে ছবি দেখাবে (full-width)। ছবি না দিলে নিচের লেখা লাল রঙে কেন্দ্রে দেখাবে।
      </p>

      <div className="space-y-2">
        <Label>ব্যানার ছবি (ঐচ্ছিক)</Label>
        <div className="rounded-lg border border-dashed border-border p-3">
          {imageUrl ? (
            <div className="space-y-2">
              <img src={imageUrl} alt="preview" className="block h-auto w-full rounded" />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setImageUrl(null);
                  if (fileRef.current) fileRef.current.value = "";
                }}
                className="gap-1"
              >
                <X className="h-4 w-4" /> ছবি সরান
              </Button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-muted py-6 text-sm text-muted-foreground hover:bg-muted/80"
            >
              <ImageIcon className="h-5 w-5" />
              ছবি বাছুন (সর্বোচ্চ ১.৫MB)
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImagePick(file);
            }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="announcement-message">ব্যানারের লেখা (ছবি না থাকলে দেখাবে)</Label>
        <Textarea
          id="announcement-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="যেমন: জরুরি O+ রক্ত প্রয়োজন — ফেনী সদর হাসপাতাল..."
          rows={3}
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
