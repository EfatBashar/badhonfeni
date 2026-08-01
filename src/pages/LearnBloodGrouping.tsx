import { Link } from "react-router-dom";
import { ArrowLeft, AlertTriangle, BookOpen } from "lucide-react";
import StepByStepGuide from "@/components/learn/StepByStepGuide";
import BloodGroupChart from "@/components/learn/BloodGroupChart";
import BloodGroupingSimulator from "@/components/learn/BloodGroupingSimulator";
import BloodGroupingQuiz from "@/components/learn/BloodGroupingQuiz";
import Seo from "@/components/Seo";

const LearnBloodGrouping = () => {
  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="ব্লাড গ্রুপিং শিখুন — বাঁধন ফেনী"
        description="Anti-A, Anti-B ও Anti-D রিএজেন্ট দিয়ে ধাপে ধাপে ব্লাড গ্রুপিং শেখার সচিত্র গাইড, চার্ট ও ইন্টারঅ্যাক্টিভ সিমুলেটর।"
        path="/learn-blood-grouping"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: "ব্লাড গ্রুপিং কীভাবে করবেন (A, B, D)",
          description:
            "Anti-A, Anti-B ও Anti-D রিএজেন্ট ব্যবহার করে রক্তের গ্রুপ নির্ণয়ের ধাপে ধাপে নির্দেশিকা।",
          inLanguage: "bn-BD",
          step: [
            { "@type": "HowToStep", name: "হাত ও আঙুল প্রস্তুত করুন" },
            { "@type": "HowToStep", name: "ল্যান্সেট দিয়ে অনামিকা ফুটো করুন" },
            { "@type": "HowToStep", name: "স্লাইডে তিন ফোঁটা রক্ত নিন" },
            { "@type": "HowToStep", name: "Anti-A, Anti-B, Anti-D রিএজেন্ট যোগ করুন" },
            { "@type": "HowToStep", name: "মিশিয়ে এগ্লুটিনেশন পর্যবেক্ষণ করুন" },
            { "@type": "HowToStep", name: "চার্ট মিলিয়ে ফলাফল নির্ণয় করুন" },
          ],
        }}
      />
      <header className="sticky top-0 z-10 border-b border-border bg-card/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <Link
            to="/"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted"
            aria-label="হোমে ফিরুন"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-base font-bold text-foreground">ব্লাড গ্রুপিং শিখুন</h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-8 px-4 py-6">
        {/* Intro */}
        <section className="rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground shadow-lg">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-medium">
            <BookOpen className="h-3.5 w-3.5" />
            শিক্ষামূলক
          </div>
          <h2 className="text-2xl font-extrabold leading-tight">
            ABO ও Rh গ্রুপিং পদ্ধতি
          </h2>
          <p className="mt-2 text-sm font-light text-primary-foreground/90">
            Anti-A, Anti-B এবং Anti-D রিএজেন্ট ব্যবহার করে কীভাবে ব্লাড গ্রুপ নির্ণয় করতে হয় — ছবি, চার্ট ও ইন্টারঅ্যাকটিভ সিমুলেটরের মাধ্যমে শিখুন।
          </p>
        </section>

        {/* Reagents intro */}
        <section className="rounded-2xl border border-border bg-card p-5">
          <h3 className="mb-3 text-base font-bold text-foreground">রিএজেন্ট পরিচিতি</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <span className="font-semibold text-foreground">Anti-A:</span> রক্তে A অ্যান্টিজেন থাকলে জমাট বাঁধে।
            </li>
            <li>
              <span className="font-semibold text-foreground">Anti-B:</span> রক্তে B অ্যান্টিজেন থাকলে জমাট বাঁধে।
            </li>
            <li>
              <span className="font-semibold text-foreground">Anti-D:</span> রক্ত Rh পজিটিভ (+) হলে জমাট বাঁধে।
            </li>
          </ul>
        </section>

        {/* Step by step */}
        <section>
          <h2 className="mb-4 text-xl font-bold text-foreground">📸 ধাপে ধাপে পদ্ধতি</h2>
          <StepByStepGuide />
        </section>

        {/* Chart */}
        <section>
          <BloodGroupChart />
        </section>

        {/* Simulator */}
        <section>
          <BloodGroupingSimulator />
        </section>

        {/* Quiz */}
        <section>
          <BloodGroupingQuiz />
        </section>

        {/* Safety */}
        <section className="rounded-2xl border-2 border-amber-500/30 bg-amber-50 p-5 dark:bg-amber-950/20">
          <div className="mb-2 flex items-center gap-2 text-amber-700 dark:text-amber-400">
            <AlertTriangle className="h-5 w-5" />
            <h3 className="text-base font-bold">সতর্কতা</h3>
          </div>
          <ul className="space-y-1.5 text-sm text-amber-900 dark:text-amber-200">
            <li>• প্রশিক্ষিত ব্যক্তির তত্ত্বাবধান ছাড়া অনুশীলন করবেন না।</li>
            <li>• প্রতিবার নতুন disposable lancet ব্যবহার করুন — কখনো পুনরায় নয়।</li>
            <li>• ব্যবহৃত lancet ও স্লাইড sharps container/biohazard ব্যাগে ফেলুন।</li>
            <li>• গ্লাভস পরে কাজ করুন এবং কাজ শেষে হাত ভালোভাবে ধুয়ে নিন।</li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default LearnBloodGrouping;
