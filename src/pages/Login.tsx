import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Heart, LogIn, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { bloodGroups } from "@/data/donors";

const Login = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const phoneRegex = /^01[3-9][0-9]{8}$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignup) {
      if (!name.trim() || !phone.trim() || !bloodGroup) {
        setLoading(false);
        toast({ title: "ত্রুটি", description: "সব তথ্য পূরণ করুন", variant: "destructive" });
        return;
      }
      if (name.trim().length < 2) {
        setLoading(false);
        toast({ title: "ত্রুটি", description: "নাম কমপক্ষে ২ অক্ষরের হতে হবে", variant: "destructive" });
        return;
      }
      if (!phoneRegex.test(phone.trim())) {
        setLoading(false);
        toast({ title: "ত্রুটি", description: "সঠিক ফোন নম্বর দিন (01XXXXXXXXX)", variant: "destructive" });
        return;
      }

      // Check if phone already exists in donors
      const { data: existing } = await supabase
        .from("donors")
        .select("id")
        .eq("phone", phone.trim())
        .limit(1);

      if (existing && existing.length > 0) {
        setLoading(false);
        toast({ title: "ডুপ্লিকেট!", description: "এই ফোন নম্বর দিয়ে আগেই ডোনার তালিকায় আছেন।", variant: "destructive" });
        return;
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name.trim(),
            phone: phone.trim(),
            blood_group: bloodGroup,
          },
        },
      });

      if (error) {
        setLoading(false);
        toast({ title: "সাইনআপ ব্যর্থ", description: error.message, variant: "destructive" });
      } else {
        // Add as donor automatically
        await supabase.from("donors").insert({
          name: name.trim(),
          phone: phone.trim(),
          blood_group: bloodGroup,
        });

        setLoading(false);
        toast({ title: "সাইনআপ সফল! ✅", description: "আপনি ডোনার তালিকায় যোগ হয়েছেন। ইমেইল ভেরিফাই করে লগইন করুন।" });
        setIsSignup(false);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) {
        toast({ title: "লগইন ব্যর্থ", description: error.message, variant: "destructive" });
      } else {
        navigate("/");
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
            {isSignup ? "সাইনআপ করুন" : "লগইন করুন"}
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
                placeholder="example@gmail.com"
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

            {isSignup && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">আপনার নাম</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="সম্পূর্ণ নাম লিখুন"
                    required
                  />
                </div>
              </>
            )}
            {isSignup && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="phone">ফোন নম্বর</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>রক্তের গ্রুপ</Label>
                  <Select value={bloodGroup} onValueChange={setBloodGroup} required>
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
              </>
            )}

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
