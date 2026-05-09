import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import HeroSection from "@/components/HeroSection";
import DonorList from "@/components/DonorList";
import BloodRequestForm from "@/components/BloodRequestForm";
import DonorSignupForm from "@/components/DonorSignupForm";
import { Link } from "react-router-dom";
import DonationDateUpdate from "@/components/DonationDateUpdate";
import { Heart, LogOut, BookOpen } from "lucide-react";
import AboutBadhon from "@/components/AboutBadhon";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [requestedBloodGroup, setRequestedBloodGroup] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <AboutBadhon />
      <HeroSection />
      <BloodRequestForm onSubmitted={(bloodGroup) => setRequestedBloodGroup(bloodGroup)} />
      {requestedBloodGroup && <DonorList lockedBloodGroup={requestedBloodGroup} />}
      <DonorSignupForm />
      <DonationDateUpdate />
      

      {/* Footer */}
      <footer className="border-t border-border bg-card px-4 py-8 text-center">
        <div className="mx-auto max-w-md space-y-3">
          <div className="flex items-center justify-center gap-1 text-sm font-semibold text-foreground">
            <Heart className="h-3.5 w-3.5 fill-primary text-primary" />
            বাঁধন, ফেনী সরকারি কলেজ ইউনিট
          </div>
          <div className="space-y-1.5 text-sm text-muted-foreground">
            <p>📞 <a href="tel:01577280577" className="hover:text-primary transition-colors">01577280577</a></p>
            <p>📧 <a href="mailto:badhanfgcunit2018@gmail.com" className="hover:text-primary transition-colors">badhanfgcunit2018@gmail.com</a></p>
            <p>📍 অফিস: কক্ষ নং-১, নিচ তলা, পূর্ব লাল ভবন, ফেনী সরকারি কলেজ।</p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-3 border-t border-border mt-3">
            <Link to="/admin" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              🔒 অ্যাডমিন
            </Link>
            <span className="text-muted-foreground/40">|</span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
            >
              <LogOut className="h-3 w-3" /> লগআউট
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
