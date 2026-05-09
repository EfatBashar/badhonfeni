## নতুন ফিচার: ব্লাড গ্রুপিং শেখার পেজ

একটি নতুন পেজ `/learn-blood-grouping` যোগ করব যেখানে নতুন শিক্ষার্থীরা ব্লাড গ্রুপিং পদ্ধতি ছবি ও ইন্টারঅ্যাকটিভ টুলের মাধ্যমে শিখতে পারবে।

### পেজের অংশসমূহ

**১. পরিচিতি সেকশন**
- ব্লাড গ্রুপিং কী, কেন দরকার — সংক্ষেপে বাংলায়
- Anti-A, Anti-B, Anti-D রিএজেন্টের ভূমিকা ব্যাখ্যা

**২. ধাপে ধাপে পদ্ধতি (ছবিসহ)**
প্রতিটি ধাপের জন্য একটি AI-জেনারেটেড illustrative ছবি (clean medical illustration style):
- ধাপ ১: হাত পরিষ্কার ও অ্যালকোহল swab দিয়ে আঙুল মোছা
- ধাপ ২: রিং ফিঙ্গার (অনামিকা) ধরা ও lancet দিয়ে ফুটো করা
- ধাপ ৩: স্লাইডে ৩টি আলাদা ফোঁটা রক্ত নেওয়া
- ধাপ ৪: প্রতি ফোঁটায় Anti-A, Anti-B, Anti-D এক ফোঁটা মেশানো
- ধাপ ৫: আলাদা স্টিক দিয়ে মেশানো ও ২ মিনিট অপেক্ষা
- ধাপ ৬: agglutination (জমাট) দেখে ফলাফল পড়া

**৩. ব্লাড গ্রুপ চার্ট**
একটি সুন্দর টেবিল যেখানে দেখানো থাকবে কোন কম্বিনেশনে কোন গ্রুপ:

```
Anti-A | Anti-B | Anti-D | Blood Group
  +    |   −    |   +    |    A+
  +    |   −    |   −    |    A−
  −    |   +    |   +    |    B+
  −    |   +    |   −    |    B−
  +    |   +    |   +    |   AB+
  +    |   +    |   −    |   AB−
  −    |   −    |   +    |    O+
  −    |   −    |   −    |    O−
```
(`+` = জমাট বেঁধেছে, `−` = জমাট বাঁধেনি)

**৪. ইন্টারঅ্যাকটিভ সিমুলেটর**
- ৩টি বৃত্ত (drop) দেখানো হবে — Anti-A, Anti-B, Anti-D লেবেল সহ
- প্রতিটি ড্রপের নিচে toggle: "জমাট বেঁধেছে" / "জমাট বাঁধেনি"
- ইউজার যখন ৩টি toggle সেট করবে, রিয়েল-টাইমে নিচে বড় করে ফলাফল দেখাবে: যেমন "এই রক্তের গ্রুপ: B+"
- একটি "রিসেট" বোতাম
- সাথে ছোট ব্যাখ্যা: কেন এই ফলাফল এলো (যেমন "Anti-B তে জমাট বাঁধায় B antigen আছে; Anti-D তে জমাট বাঁধায় Rh positive")
- Visual: জমাট বাঁধা = দানাদার texture সহ লাল drop, না বাঁধা = মসৃণ লাল drop

**৫. সতর্কতা সেকশন**
- শুধু প্রশিক্ষিত ব্যক্তির সাহায্য নিয়ে practice করা
- Disposable lancet ব্যবহার, infection control

### Navigation
- হোমপেজের `AboutBadhon` সেকশনের পাশে / Hero এর নিচে একটি বোতাম: "📚 ব্লাড গ্রুপিং শিখুন"
- App.tsx এ `/learn-blood-grouping` route যোগ করা হবে (AuthGate এর আওতায়, যেহেতু সব রুট প্রোটেক্টেড)

### প্রযুক্তিগত বিবরণ
- নতুন ফাইল: `src/pages/LearnBloodGrouping.tsx`
- নতুন কম্পোনেন্ট: `src/components/learn/BloodGroupingSimulator.tsx`, `src/components/learn/BloodGroupChart.tsx`, `src/components/learn/StepByStepGuide.tsx`
- ৬টি illustrative ছবি `imagegen` দিয়ে তৈরি করে `src/assets/learn/` এ রাখা হবে (medical illustration, premium quality, clean white background)
- সম্পূর্ণ frontend-only — কোনো DB পরিবর্তন নেই
- Theme অনুসরণ: লাল/সাদা, Outfit ফন্ট, minimalist
- বাংলা (`lang="bn"`) text, mobile-first responsive

### সিমুলেটর লজিক
```
hasA = Anti-A জমাট
hasB = Anti-B জমাট
rhPos = Anti-D জমাট
ABO = hasA && hasB ? 'AB' : hasA ? 'A' : hasB ? 'B' : 'O'
Rh  = rhPos ? '+' : '−'
result = ABO + Rh
```

আপনি কি চান আমি এখন এই পরিকল্পনা অনুযায়ী implement করি?