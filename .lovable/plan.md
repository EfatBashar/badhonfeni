## পরিবর্তন

Ticker টা এখন অনেক জায়গা নিচ্ছে এবং Hero এর বাইরে আলাদা bar হয়ে গেছে — এতে নিচের "ব্লাড রিকুয়েস্ট" section এর লেখা ঢেকে যাচ্ছে দেখাচ্ছে। সব আগের মতো রেখে শুধু ticker টাকে compact করে "কল করুন" button এর ঠিক নিচের খালি জায়গায় বসাবো, "ঘোষণা" badge বাদ।

### `src/components/HeadlineTicker.tsx`
- বাম পাশের "📢 ঘোষণা" badge সম্পূর্ণ remove
- Border/background wrapper হালকা করা — শুধু একটা subtle transparent strip, extra padding নয়
- Height কমানো (`py-2` → `py-1.5`), font size `text-sm` রাখা
- Marquee logic অপরিবর্তিত (seamless loop, hover pause)

### `src/components/HeroSection.tsx`
- `<HeadlineTicker />` কে Hero এর বাইরে না রেখে **ভেতরে**, "কল করুন" button এর ঠিক নিচে (same centered container এর মধ্যে) বসানো
- Button আর ticker এর মাঝে ছোট gap (`mt-6` মতো)
- Hero এর নিচের `py-16` padding অপরিবর্তিত — button এর নিচের খালি জায়গায় ticker fit করবে

### যা অপরিবর্তিত থাকবে
- Database, admin panel, realtime, animation speed — কিছুই পরিবর্তন হবে না
- অন্য কোনো file/section touch হবে না

## Files
- edit: `src/components/HeadlineTicker.tsx`
- edit: `src/components/HeroSection.tsx`
