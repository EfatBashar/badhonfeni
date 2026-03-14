import { Info, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const AboutBadhon = () => {
  return (
    <div className="fixed right-4 top-20 z-50 flex flex-col gap-2">
      {/* বাঁধন সম্পর্কে */}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            className="rounded-full shadow-lg border-primary/30 bg-card hover:bg-primary hover:text-primary-foreground transition-all"
            aria-label="বাঁধন সম্পর্কে"
          >
            <Info className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg max-h-[85vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl font-bold">বাঁধন সম্পর্কে</DialogTitle>
            <DialogDescription>স্বেচ্ছায় রক্তদাতাদের সংগঠন</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[65vh] px-6 pb-6">
            <div className="space-y-4 text-sm text-foreground leading-relaxed">
              <div className="rounded-lg bg-primary/5 p-4 border border-primary/10">
                <p className="text-center font-semibold text-primary italic">
                  "একের রক্ত অন্যের জীবন, রক্তই হোক আত্মার বাঁধন"
                </p>
              </div>

              <div className="space-y-1 text-muted-foreground text-xs">
                <p>📅 গঠিত: ২৪ অক্টোবর ১৯৯৭</p>
                <p>🏛️ প্রতিষ্ঠাস্থান: ঢাকা বিশ্ববিদ্যালয়</p>
                <p>📋 নিবন্ধন নং: ধ-০৬১৫২</p>
                <p>👥 স্বেচ্ছাকর্মী: ৬৪ হাজার+</p>
                <p>🌐 ওয়েবসাইট: <a href="https://badhan.org" target="_blank" rel="noopener noreferrer" className="text-primary underline">badhan.org</a></p>
              </div>

              <p>
                <strong>বাঁধন</strong> একটি সেবামূলক স্বেচ্ছাসেবী রক্তদান সংস্থা। ১৯৯৭ সালের ২৪শে অক্টোবর ঢাকা বিশ্ববিদ্যালয়ের শহীদুল্লাহ হল থেকে এই সংস্থাটি যাত্রা শুরু করে। বর্তমানে দেশের ৬১ টি জেলায় ৯২ টি শিক্ষাপ্রতিষ্ঠান, ১৬টি জোন, ১৪৮ টি ইউনিট ও ১৪ টি পরিবারের মাধ্যমে বাঁধন কার্যক্রম চালিয়ে যাচ্ছে।
              </p>

              <p>
                এটি সম্পূর্ণরূপে অরাজনৈতিক, অসাম্প্রদায়িক, অ-আঞ্চলিক, অ-জাতিগত, ধর্মনিরপেক্ষ এবং স্বেচ্ছাসেবী সামাজিক সংগঠন।
              </p>

              <h3 className="font-bold text-base text-foreground pt-2">ইতিহাস</h3>
              <p>
                বাঁধনের উৎপত্তি ১৯৯৬ সালে ঢাকা বিশ্ববিদ্যালয়ে। শহীদুল্লাহ্‌ হলের একজন আবাসিক ছাত্র মুহাম্মদ শাহিদুল ইসলামের কাছে একজন শিক্ষার্থী জানায় তার আত্মীয়ের হৃদ্‌যন্ত্রে অস্ত্রোপচারের জন্য ১০-১২ ব্যাগ রক্ত প্রয়োজন। এই চ্যালেঞ্জের মুখে তিনি বুঝতে পারেন যে হলভিত্তিক রক্ত সংগ্রহের ব্যবস্থা থাকলে সহজে প্রয়োজনীয় রক্ত পাওয়া যেত। তিনি ১৯৯৭ সালে বাঁধন গঠন করেন।
              </p>

              <h3 className="font-bold text-base text-foreground pt-2">উদ্দেশ্য ও লক্ষ্য</h3>
              <p>
                স্বেচ্ছায় রক্তদান এবং অন্যান্য সেবা ও সচেতনতামূলক কর্মসূচির মাধ্যমে একটি সুস্থ সমাজ গঠনে সামাজিক আন্দোলন শুরু করা বাঁধনের লক্ষ্য। রক্তদান ছাড়াও বাঁধন প্রাকৃতিক ও মানবসৃষ্ট দুর্যোগ কাটিয়ে উঠতে ত্রাণ ও পুনর্বাসন কর্মসূচি গ্রহণ করে।
              </p>

              <h3 className="font-bold text-base text-foreground pt-2">অর্জন</h3>
              <p>
                গত আটাশ বছরে বাঁধন প্রায় ১১,৩৭,৩০৯ ব্যাগ বিশুদ্ধ রক্তের সরবরাহ করেছে এবং ২৪.৩৬ লক্ষ মানুষকে বিনামূল্যে রক্তের গ্রুপ নির্ণয় করে দিয়েছে।
              </p>

              <h3 className="font-bold text-base text-foreground pt-2">বাঁধন সঞ্চালন কেন্দ্র</h3>
              <p>
                ২০০৬ সালে পরীক্ষামূলকভাবে এবং ২০১৯ সালে আনুষ্ঠানিকভাবে বাঁধন সঞ্চালন কেন্দ্র চালু হয়। ২০২৪ সাল পর্যন্ত এই কেন্দ্র ১৬,৫৮৫ ব্যাগ রক্ত সংগ্রহ ও সরবরাহ করেছে।
              </p>

              <h3 className="font-bold text-base text-foreground pt-2">বাঁধন ফাউন্ডেশন</h3>
              <p>
                ২০০৬ সালে প্রাক্তন সদস্যদের নিয়ে বাঁধন ফাউন্ডেশন গঠিত হয়। এটি গ্রামীণ ও দরিদ্র জনগোষ্ঠীর জন্য প্রাথমিক চিকিৎসা, মা ও শিশু স্বাস্থ্যসেবা, টিকাদান, পুষ্টি, স্বাস্থ্য প্রশিক্ষণসহ নানা কার্যক্রম পরিচালনা করে।
              </p>

              <p className="text-xs text-muted-foreground pt-3 border-t border-border">
                তথ্যসূত্র: বাংলা উইকিপিডিয়া
              </p>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* ফেনী সরকারি কলেজ ইউনিট সম্পর্কে */}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            className="rounded-full shadow-lg border-primary/30 bg-card hover:bg-primary hover:text-primary-foreground transition-all"
            aria-label="ফেনী সরকারি কলেজ ইউনিট সম্পর্কে"
          >
            <GraduationCap className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg max-h-[85vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl font-bold">বাঁধন, ফেনী সরকারি কলেজ ইউনিট</DialogTitle>
            <DialogDescription>স্বেচ্ছায় রক্তদাতাদের সংগঠন — ফেনী সরকারি কলেজ শাখা</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[65vh] px-6 pb-6">
            <div className="space-y-4 text-sm text-foreground leading-relaxed">
              <div className="rounded-lg bg-primary/5 p-4 border border-primary/10">
                <p className="text-center font-semibold text-primary italic">
                  "একের রক্ত অন্যের জীবন, রক্তই হোক আত্মার বাঁধন"
                </p>
              </div>

              <h3 className="font-bold text-base text-foreground">পরিচিতি</h3>
              <p>
                বাঁধন, ফেনী সরকারি কলেজ ইউনিট হলো জাতীয় স্বেচ্ছাসেবী রক্তদান সংগঠন বাঁধনের ফেনী সরকারি কলেজভিত্তিক শাখা। ২০১৮ সালে প্রতিষ্ঠিত এই ইউনিট ফেনী জেলায় স্বেচ্ছায় রক্তদান কার্যক্রম পরিচালনা করে আসছে।
              </p>

              <h3 className="font-bold text-base text-foreground pt-2">আমাদের কার্যক্রম</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>জরুরি প্রয়োজনে বিনামূল্যে রক্তের ব্যবস্থা করা</li>
                <li>বিনামূল্যে রক্তের গ্রুপ নির্ণয়</li>
                <li>স্বেচ্ছায় রক্তদানে উদ্বুদ্ধকরণ কর্মসূচি</li>
                <li>রক্তদাতাদের তথ্য সংরক্ষণ ও ব্যবস্থাপনা</li>
                <li>সচেতনতামূলক সেমিনার ও ক্যাম্পেইন</li>
              </ul>

              <h3 className="font-bold text-base text-foreground pt-2">যোগাযোগ</h3>
              <div className="space-y-2 text-muted-foreground">
                <p>📞 <a href="tel:01577280577" className="text-primary underline">01577280577</a></p>
                <p>📧 <a href="mailto:badhanfgcunit2018@gmail.com" className="text-primary underline">badhanfgcunit2018@gmail.com</a></p>
                <p>📍 অফিস: কক্ষ নং-১, নিচ তলা, পূর্ব লাল ভবন, ফেনী সরকারি কলেজ।</p>
              </div>

              <h3 className="font-bold text-base text-foreground pt-2">রক্ত প্রয়োজন?</h3>
              <p>
                ফেনী জেলায় যেকোনো সময় রক্তের প্রয়োজন হলে আমাদের হটলাইনে কল করুন। আমরা দ্রুততম সময়ে রক্তদাতা খুঁজে বের করে সাহায্য করার চেষ্টা করি।
              </p>

              <div className="rounded-lg bg-primary/5 p-4 border border-primary/10 text-center">
                <p className="text-xs text-muted-foreground mb-1">জরুরি রক্তের জন্য কল করুন</p>
                <a href="tel:01577280577" className="text-lg font-bold text-primary">📞 01577280577</a>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AboutBadhon;
