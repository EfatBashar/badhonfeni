import { useState } from "react";
import { CalendarIcon, Search, Loader2, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { bn } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";

const DonationDateUpdate = () => {
  const [phone, setPhone] = useState("");
  const [donorName, setDonorName] = useState<string | null>(null);
  const [donorId, setDonorId] = useState<string | null>(null);
  const [date, setDate] = useState<Date>();
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSearch = async () => {
    if (!phone.trim()) return;
    setSearching(true);
    setDonorName(null);
    setDonorId(null);
    setSaved(false);

    const { data, error } = await supabase
      .from("donors")
      .select("id, name")
      .eq("phone", phone.trim())
      .maybeSingle();

    setSearching(false);
    if (error || !data) {
      toast.error("এই ফোন নম্বরে কোনো রক্তদাতা পাওয়া যায়নি");
      return;
    }
    setDonorName(data.name);
    setDonorId(data.id);
  };

  const handleSave = async () => {
    if (!donorId || !date) return;
    setSaving(true);

    const { error } = await supabase
      .from("donors")
      .update({
        last_donation: format(date, "yyyy-MM-dd"),
        total_donations: undefined,
      })
      .eq("id", donorId);

    // Increment total_donations separately
    if (!error) {
      await supabase.rpc("increment_donations" as never, { donor_id: donorId } as never).catch(() => {});
    }

    setSaving(false);
    if (error) {
      toast.error("তারিখ আপডেট করা যায়নি");
      return;
    }
    setSaved(true);
    toast.success("সর্বশেষ রক্তদানের তারিখ আপডেট হয়েছে!");
  };

  return (
    <section className="px-4 py-10">
      <div className="mx-auto max-w-md">
        <div className="mb-6 flex items-center gap-2">
          <CalendarIcon className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">রক্তদানের তারিখ আপডেট</h2>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
          {/* Phone search */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">ফোন নম্বর</label>
            <div className="flex gap-2">
              <input
                type="tel"
                placeholder="01XXXXXXXXX"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); setDonorName(null); setSaved(false); }}
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <Button onClick={handleSearch} disabled={searching || !phone.trim()} size="sm" className="gap-1">
                {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                খুঁজুন
              </Button>
            </div>
          </div>

          {/* Donor found */}
          {donorName && (
            <>
              <div className="rounded-lg bg-primary/5 p-3 text-sm">
                <span className="text-muted-foreground">রক্তদাতা: </span>
                <span className="font-semibold text-foreground">{donorName}</span>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">সর্বশেষ রক্তদানের তারিখ</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP", { locale: bn }) : "তারিখ নির্বাচন করুন"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(d) => d > new Date()}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Button
                onClick={handleSave}
                disabled={!date || saving || saved}
                className="w-full gap-2"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : saved ? (
                  <CheckCircle className="h-4 w-4" />
                ) : null}
                {saved ? "আপডেট সম্পন্ন!" : "তারিখ আপডেট করুন"}
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default DonationDateUpdate;
