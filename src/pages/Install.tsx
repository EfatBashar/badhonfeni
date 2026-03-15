import { useState, useEffect } from "react";
import { Download, Smartphone, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
          <Smartphone className="h-10 w-10 text-primary" />
        </div>

        <h1 className="text-2xl font-bold text-foreground">
          বাঁধন অ্যাপ ইনস্টল করুন
        </h1>

        <p className="text-muted-foreground text-sm leading-relaxed">
          আপনার ফোনে বাঁধন অ্যাপ ইনস্টল করুন — ইন্টারনেট ছাড়াও ব্যবহার করতে পারবেন, দ্রুত খুলবে এবং আসল অ্যাপের মতো কাজ করবে।
        </p>

        {isInstalled ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-6">
            <CheckCircle className="h-10 w-10 text-primary" />
            <p className="font-semibold text-foreground">অ্যাপ ইতিমধ্যে ইনস্টল করা আছে!</p>
          </div>
        ) : deferredPrompt ? (
          <Button
            size="lg"
            onClick={handleInstall}
            className="gap-2 rounded-full px-8 text-base font-semibold"
          >
            <Download className="h-5 w-5" />
            এখনই ইনস্টল করুন
          </Button>
        ) : (
          <div className="space-y-4 rounded-xl border border-border bg-card p-6 text-left">
            <p className="font-semibold text-foreground text-center text-sm">ম্যানুয়ালি ইনস্টল করুন</p>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">১</span>
                <p><strong>Android:</strong> Chrome ব্রাউজারে খুলুন → মেনু (⋮) → "Add to Home screen"</p>
              </div>
              <div className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">২</span>
                <p><strong>iPhone:</strong> Safari-তে খুলুন → Share (↑) → "Add to Home Screen"</p>
              </div>
            </div>
          </div>
        )}

        <Link to="/">
          <Button variant="ghost" className="gap-2 mt-4">
            <ArrowLeft className="h-4 w-4" />
            হোম পেজে ফিরুন
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Install;
