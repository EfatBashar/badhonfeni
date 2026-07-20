import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save, Megaphone, Image as ImageIcon, X, ArrowUp, ArrowDown, Plus } from "lucide-react";

const MAX_IMAGE_BYTES = 1.5 * 1024 * 1024;

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
  const [imageUrls, setImageUrls] = useState<string[]>([]);
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
      const list = (current as { image_urls?: string[] | null }).image_urls;
      const legacy = (current as { image_url?: string | null }).image_url;
      const arr = Array.isArray(list) && list.length > 0 ? list : legacy ? [legacy] : [];
      setImageUrls(arr.filter((u): u is string => typeof u === "string" && u.length > 0));
      setIsActive(current.is_active);
    }
  }, [current]);

  const handleFiles = async (files: FileList) => {
    const added: string[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        toast({ title: "ভুল ফাইল", description: `${file.name} — শুধু ছবি দিন।`, variant: "destructive" });
        continue;
      }
      if (file.size > MAX_IMAGE_BYTES) {
        toast({
          title: "ছবি অনেক বড়",
          description: `${file.name} — ১.৫MB এর কম রাখুন।`,
          variant: "destructive",
        });
        continue;
      }
      try {
        added.push(await fileToDataUrl(file));
      } catch {
        toast({ title: "ত্রুটি", description: `${file.name} পড়া যায়নি।`, variant: "destructive" });
      }
    }
    if (added.length) setImageUrls((prev) => [...prev, ...added]);
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeAt = (i: number) => setImageUrls((prev) => prev.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) =>
    setImageUrls((prev) => {
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const handleSave = async () => {
    if (imageUrls.length === 0 && !message.trim()) {
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
      image_urls: imageUrls,
      image_url: imageUrls[0] ?? null,
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
        একাধিক ছবি দিলে slideshow-এর মতো একটার পর একটা দেখাবে (৪ সেকেন্ড পর পর)। ছবি না দিলে
        নিচের লেখা লাল রঙে scrolling headline হিসেবে দেখাবে।
      </p>

      <div className="space-y-2">
        <Label>ব্যানার ছবি (একাধিক দেওয়া যাবে)</Label>
        <div className="space-y-2 rounded-lg border border-dashed border-border p-3">
          {imageUrls.length > 0 && (
            <div className="space-y-2">
              {imageUrls.map((url, i) => (
                <div key={i} className="flex items-center gap-2 rounded-md border border-border p-2">
                  <img src={url} alt={`banner-${i + 1}`} className="h-14 w-20 rounded object-cover" />
                  <span className="text-xs text-muted-foreground">#{i + 1}</span>
                  <div className="ml-auto flex items-center gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      aria-label="উপরে সরান"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => move(i, 1)}
                      disabled={i === imageUrls.length - 1}
                      aria-label="নিচে সরান"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeAt(i)}
                      aria-label="সরান"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-muted py-4 text-sm text-muted-foreground hover:bg-muted/80"
          >
            {imageUrls.length === 0 ? (
              <>
                <ImageIcon className="h-5 w-5" />
                ছবি বাছুন (একাধিক দেওয়া যাবে, প্রতিটি ≤১.৫MB)
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                আরও ছবি যোগ করুন
              </>
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) handleFiles(e.target.files);
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
