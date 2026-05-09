import step1 from "@/assets/learn/step1-clean.jpg";
import step2 from "@/assets/learn/step2-prick.jpg";
import step3 from "@/assets/learn/step3-drops.jpg";
import step4 from "@/assets/learn/step4-reagent.jpg";
import step5 from "@/assets/learn/step5-mix.jpg";
import step6 from "@/assets/learn/step6-result.jpg";

const steps = [
  {
    img: step1,
    title: "ধাপ ১: হাত ও আঙুল পরিষ্কার",
    desc: "দাতার হাত সাবান-পানিতে ধুয়ে শুকিয়ে নিন। এরপর অনামিকা (ring finger) এর ডগা অ্যালকোহল স্পঞ্জ দিয়ে মুছুন এবং শুকাতে দিন।",
  },
  {
    img: step2,
    title: "ধাপ ২: আঙুল ফুটো করা",
    desc: "অনামিকার মাথা disposable lancet দিয়ে দ্রুত ও দৃঢ়ভাবে একবার ফুটো করুন। প্রথম ফোঁটা মুছে ফেলুন (এতে টিস্যু ফ্লুইড থাকে)।",
  },
  {
    img: step3,
    title: "ধাপ ৩: স্লাইডে ৩ ফোঁটা রক্ত",
    desc: "একটি পরিষ্কার কাঁচের স্লাইডে A, B, D চিহ্নিত করে ৩টি আলাদা জায়গায় সমান সাইজের ৩ ফোঁটা রক্ত নিন।",
  },
  {
    img: step4,
    title: "ধাপ ৪: রিএজেন্ট যোগ",
    desc: "প্রথম ফোঁটায় Anti-A, দ্বিতীয়টায় Anti-B এবং তৃতীয়টায় Anti-D রিএজেন্ট ১ ফোঁটা করে যোগ করুন। ড্রপার যেন রক্তে না লাগে।",
  },
  {
    img: step5,
    title: "ধাপ ৫: মেশানো ও অপেক্ষা",
    desc: "প্রতিটি ফোঁটার জন্য আলাদা স্টিক ব্যবহার করে আলতো করে মেশান (mix করার পর কখনই একই স্টিক অন্য ফোঁটায় দেবেন না)। ১–২ মিনিট অপেক্ষা করুন।",
  },
  {
    img: step6,
    title: "ধাপ ৬: ফলাফল পড়া",
    desc: "যেখানে দানা দানা জমাট দেখা যাবে — সেটি Positive (+)। যেটি মসৃণ লাল তরল থাকবে — সেটি Negative (−)। নিচের চার্ট মিলিয়ে গ্রুপ নির্ণয় করুন।",
  },
];

const StepByStepGuide = () => (
  <div className="space-y-4">
    {steps.map((s, i) => (
      <div
        key={i}
        className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
      >
        <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
          <img
            src={s.img}
            alt={s.title}
            loading="lazy"
            width={768}
            height={576}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="p-4">
          <div className="mb-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            {i + 1}
          </div>
          <h3 className="mt-2 text-base font-bold text-foreground">{s.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
        </div>
      </div>
    ))}
  </div>
);

export default StepByStepGuide;
