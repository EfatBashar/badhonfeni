import HeroSection from "@/components/HeroSection";
import DonorList from "@/components/DonorList";
import BloodRequestForm from "@/components/BloodRequestForm";
import CommitteeSection from "@/components/CommitteeSection";
import DonationDateUpdate from "@/components/DonationDateUpdate";
import { Heart } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <DonorList />
      <BloodRequestForm />
      <DonationDateUpdate />
      <CommitteeSection />

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
          
        </div>
      </footer>
    </div>
  );
};

export default Index;
