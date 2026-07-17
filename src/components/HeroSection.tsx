import { Heart, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeadlineTicker from "@/components/HeadlineTicker";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <div className="px-4 py-8 md:py-16">
        {/* Background pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-primary-foreground" />
          <div className="absolute -bottom-20 -right-10 h-60 w-60 rounded-full bg-primary-foreground" />
          <div className="absolute left-1/2 top-1/3 h-20 w-20 rounded-full bg-primary-foreground" />
        </div>

        <div className="relative mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-4 py-2 text-sm font-medium backdrop-blur-sm">
            <Heart className="h-4 w-4 fill-current" />
            বাঁধন, ফেনী সরকারি কলেজ ইউনিট
          </div>

          <h1 className="mb-3 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
            রক্তদানে <br />
            <span className="text-blood-glow">জীবন বাঁচান</span>
          </h1>

          <p className="mb-6 text-lg font-light text-primary-foreground/80">
            আপনার এক ব্যাগ রক্ত বাঁচাতে পারে একটি মূল্যবান জীবন। আজই যোগাযোগ করুন।
          </p>

          <a href="tel:01577280577">
            <Button
              size="lg"
              className="gap-2 rounded-full bg-primary-foreground px-8 text-base font-semibold text-primary shadow-lg transition-transform hover:scale-105 hover:bg-primary-foreground/90"
            >
              <Phone className="h-5 w-5" />
              রক্ত প্রয়োজন? কল করুন
            </Button>
          </a>

          <div className="mt-5">
            <HeadlineTicker />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
