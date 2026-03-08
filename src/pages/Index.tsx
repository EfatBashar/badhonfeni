import HeroSection from "@/components/HeroSection";
import DonorList from "@/components/DonorList";
import CommitteeSection from "@/components/CommitteeSection";
import { Heart } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <DonorList />
      <CommitteeSection />

      {/* Footer */}
      <footer className="border-t border-border bg-card px-4 py-6 text-center">
        <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
          <Heart className="h-3 w-3 fill-primary text-primary" />
          বাঁধন, ফেনী সরকারি কলেজ ইউনিট
        </div>
        <p className="mt-1 text-xs text-muted-foreground">রক্তদান মহাদান</p>
      </footer>
    </div>
  );
};

export default Index;
