import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Status = "checking" | "ready" | "invalid";

const withTimeout = async <T,>(promise: PromiseLike<T>, milliseconds = 8000): Promise<T> => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error("AUTH_TIMEOUT")), milliseconds);
  });

  try {
    return await Promise.race([Promise.resolve(promise), timeout]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
};

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<Status>("checking");
  const [resendEmail, setResendEmail] = useState("");
  const [resendState, setResendState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [resendError, setResendError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let cancelled = false;

    const finish = (nextStatus: Exclude<Status, "checking">) => {
      if (!cancelled) setStatus(nextStatus);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (cancelled) return;
      if (event === "PASSWORD_RECOVERY" || ((event === "SIGNED_IN" || event === "INITIAL_SESSION") && session)) {
        setStatus("ready");
      }
    });

    const verify = async () => {
      try {
        const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
        const query = new URLSearchParams(window.location.search);

        if (hash.get("error") || query.get("error")) {
          finish("invalid");
          return;
        }

        // The auth client normally consumes recovery links automatically.
        const current = await withTimeout(supabase.auth.getSession(), 4000);
        if (current.data.session) {
          finish("ready");
          window.history.replaceState({}, "", "/reset-password");
          return;
        }

        // Legacy hash flow: #access_token=...&refresh_token=...
        const accessToken = hash.get("access_token");
        const refreshToken = hash.get("refresh_token");
        if (accessToken && refreshToken) {
          const { error } = await withTimeout(supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          }));
          finish(error ? "invalid" : "ready");
          if (!error) window.history.replaceState({}, "", "/reset-password");
          return;
        }

        // PKCE flow: ?code=...
        const code = query.get("code");
        if (code) {
          const { error } = await withTimeout(supabase.auth.exchangeCodeForSession(code));
          finish(error ? "invalid" : "ready");
          if (!error) window.history.replaceState({}, "", "/reset-password");
          return;
        }

        // OTP flow: ?token_hash=...&type=recovery
        const tokenHash = query.get("token_hash") || query.get("token");
        if (tokenHash) {
          const { error } = await withTimeout(supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: "recovery",
          }));
          finish(error ? "invalid" : "ready");
          if (!error) window.history.replaceState({}, "", "/reset-password");
          return;
        }

        finish("invalid");
      } catch {
        finish("invalid");
      }
    };

    // Let the auth client process callback parameters before using fallbacks.
    const timer = setTimeout(verify, 800);
    const safetyTimer = setTimeout(() => finish("invalid"), 10000);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      clearTimeout(safetyTimer);
      subscription.unsubscribe();
    };
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: "ত্রুটি", description: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে", variant: "destructive" });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: "ত্রুটি", description: "দুইটি পাসওয়ার্ড মিলছে না", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "সফল! ✅", description: "পাসওয়ার্ড পরিবর্তন হয়েছে। এখন লগইন করুন।" });
      await supabase.auth.signOut();
      navigate("/login");
    }
  };

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    setResendState("sending");
    setResendError("");
    const { error } = await supabase.auth.resetPasswordForEmail(resendEmail.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      setResendState("error");
      setResendError(error.message);
      toast({ title: "ত্রুটি", description: error.message, variant: "destructive" });
    } else {
      setResendState("sent");
      toast({ title: "পাঠানো হয়েছে ✅", description: "নতুন রিসেট লিংক ইমেইলে পাঠানো হয়েছে।" });
    }
  };


  if (status === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-sm border-border shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl text-foreground">পাসওয়ার্ড রিসেট</CardTitle>
            <p className="text-sm text-muted-foreground">লিংক যাচাই হচ্ছে...</p>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (status === "invalid") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-sm border-border shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl text-foreground">লিংকটি অকার্যকর</CardTitle>
            <p className="text-sm text-muted-foreground">
              রিসেট লিংকটির মেয়াদ শেষ হয়ে গেছে বা এটি আগেই ব্যবহার করা হয়েছে। নিচে ইমেইল দিয়ে নতুন লিংক নিন।
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleResend} className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="resend-email">ইমেইল</Label>
                <Input
                  id="resend-email"
                  type="email"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={resendState === "sending"}>
                {resendState === "sending" ? "পাঠানো হচ্ছে..." : "আবার রিসেট লিংক পাঠান"}
              </Button>
            </form>

            {resendState === "sent" && (
              <div className="flex items-start gap-2 rounded-md border border-primary/30 bg-primary/10 p-3 text-sm text-foreground">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>নতুন রিসেট লিংক পাঠানো হয়েছে ✅ — ইমেইলের ইনবক্স (ও স্প্যাম ফোল্ডার) চেক করুন।</span>
              </div>
            )}
            {resendState === "error" && (
              <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-foreground">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                <span>{resendError || "লিংক পাঠানো যায়নি, আবার চেষ্টা করুন।"}</span>
              </div>
            )}

            <Button variant="outline" className="w-full" onClick={() => navigate("/login")}>
              লগইন পেজে ফিরে যান
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }


  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm border-border shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Heart className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-xl text-foreground">নতুন পাসওয়ার্ড সেট করুন</CardTitle>
          <p className="text-sm text-muted-foreground">বাঁধন, ফেনী সরকারি কলেজ ইউনিট</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">নতুন পাসওয়ার্ড</Label>
              <Input
                id="new-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">পাসওয়ার্ড আবার লিখুন</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "পরিবর্তন হচ্ছে..." : "পাসওয়ার্ড পরিবর্তন করুন"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
