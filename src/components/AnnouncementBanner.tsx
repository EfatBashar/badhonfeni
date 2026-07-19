import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Full-width white banner shown below the CTA button.
 * Reads latest active row from `announcements`:
 *   - If `image_url` is set  -> shows image at 100% width, auto height
 *   - Else if `message` set  -> shows centered red text
 * Configure it from Admin → ঘোষণা tab (no code edits needed).
 */
const AnnouncementBanner = () => {
  const queryClient = useQueryClient();

  const { data: announcement } = useQuery({
    queryKey: ["active_announcement"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .eq("is_active", true)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel("announcements-banner")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "announcements" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["active_announcement"] });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  if (!announcement) return null;

  const imageUrl = (announcement as { image_url?: string | null }).image_url;
  const message = announcement.message;

  if (!imageUrl && !message) return null;

  return (
    <div className="w-full bg-white">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={message || "ব্যানার"}
          className="block h-auto w-full"
        />
      ) : (
        <div className="w-full px-4 py-4 text-center text-lg font-bold leading-snug text-primary md:py-5 md:text-xl">
          {message}
        </div>
      )}
    </div>
  );
};

export default AnnouncementBanner;
