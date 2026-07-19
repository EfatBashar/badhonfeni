import { Heart, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeadlineTicker from "@/components/HeadlineTicker";

interface HeroSectionProps {
  bannerHeading?: string;
  bannerImage?: string;
}

const HeroSection = ({ bannerHeading, bannerImage }: HeroSectionProps) => {
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
          <div className="mx-auto mb-4 inline-flex max-w-full items-center justify-center gap-2 whitespace-normal break-words rounded-full bg-primary-foreground/15 px-4 py-2 text-sm font-medium leading-snug backdrop-blur-sm">
            <Heart className="h-4 w-4 shrink-0 fill-current" />
            <span>বাঁধন, ফেনী সরকারি কলেজ ইউনিট</span>
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
        </div>
      </div>

      {/* Full-width banner below the CTA */}
      <div className="w-full bg-white px-0 pb-4">
        {bannerImage ? (
          <img
            src={bannerImage}
            alt={bannerHeading ?? "Banner"}
            className="block h-auto w-full rounded-xl object-cover"
          />
        ) : bannerHeading ? (
          <div className="flex w-full items-center justify-center rounded-xl bg-white px-4 py-4 text-center text-lg font-bold text-primary md:text-xl">
            {bannerHeading}
          </div>
        ) : (
          <div className="w-full rounded-xl bg-white px-4 py-4 text-center [&_.text-primary-foreground]:!text-primary">
            <HeadlineTicker />
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
