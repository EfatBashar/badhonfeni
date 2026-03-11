import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, LogIn, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignup) {
      const { error } = await supabase.auth.signUp({ email, password });
      setLoading(false);
      if (error) {
        toast({ title: "সাইনআপ ব্যর্থ", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "সাইনআপ সফল!", description: "এখন লগইন করতে পারবেন।" });
        setIsSignup(false);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) {
        toast({ title: "লগইন ব্যর্থ", description: error.message, variant: "destructive" });
      } else {
        navigate("/admin");
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm border-border shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Heart className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-xl text-foreground">
            {isSignup ? "অ্যাডমিন সাইনআপ" : "অ্যাডমিন লগইন"}
          </CardTitle>
          <p className="text-sm text-muted-foreground">বাঁধন, ফেনী সরকারি কলেজ ইউনিট</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">ইমেইল</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">পাসওয়ার্ড</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {isSignup ? <UserPlus className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
              {loading
                ? isSignup ? "সাইনআপ হচ্ছে..." : "লগইন হচ্ছে..."
                : isSignup ? "সাইনআপ" : "লগইন"}
            </Button>
          </form>
          <button
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            className="mt-4 w-full text-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            {isSignup ? "ইতিমধ্যে অ্যাকাউন্ট আছে? লগইন করুন" : "নতুন অ্যাকাউন্ট তৈরি করুন"}
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
