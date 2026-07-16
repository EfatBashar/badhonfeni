import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Megaphone } from "lucide-react";

const HeadlineTicker = () => {
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
      .channel("announcements-ticker")
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

  if (!announcement?.message) return null;

  const text = announcement.message;

  return (
    <div className="flex items-stretch overflow-hidden border-y border-primary-foreground/20 bg-primary-foreground/10 backdrop-blur-sm">
      <div className="flex shrink-0 items-center gap-1.5 bg-primary-foreground px-3 py-2 text-xs font-bold uppercase tracking-wider text-primary">
        <Megaphone className="h-3.5 w-3.5 animate-pulse" />
        <span>ঘোষণা</span>
      </div>
      <div className="relative flex flex-1 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap py-2 text-sm font-medium text-primary-foreground [animation-play-state:running] hover:[animation-play-state:paused]">
          <span className="px-8">{text}</span>
          <span className="px-8" aria-hidden="true">★</span>
          <span className="px-8" aria-hidden="true">{text}</span>
          <span className="px-8" aria-hidden="true">★</span>
        </div>
        <div
          className="flex animate-marquee whitespace-nowrap py-2 text-sm font-medium text-primary-foreground [animation-play-state:running] hover:[animation-play-state:paused]"
          aria-hidden="true"
        >
          <span className="px-8">{text}</span>
          <span className="px-8">★</span>
          <span className="px-8">{text}</span>
          <span className="px-8">★</span>
        </div>
      </div>
    </div>
  );
};

export default HeadlineTicker;
