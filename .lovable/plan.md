## সমস্যা

Hero section এর `py-16` padding + ticker এর `mt-6` gap মিলে Hero অনেক লম্বা হয়ে গেছে, mobile viewport (393×627) এ নিচের "রক্ত রিকুয়েস্ট" form পুরোপুরি out of view চলে যাচ্ছে।

## পরিবর্তন

### `src/components/HeroSection.tsx`
- Outer padding: `py-16` → `py-8 md:py-16` (mobile এ compact, desktop এ আগের মতোই)
- Heading margin: `mb-4` → `mb-3`
- Subtitle margin: `mb-8` → `mb-6`
- Ticker wrapper gap: `mt-6` → `mt-5`
- Background pattern circles গুলোর position/size অপরিবর্তিত

### `src/components/HeadlineTicker.tsx`
- Text size বড় করা যাতে খালি strip filled মনে হয়: `text-sm` → `text-base md:text-lg font-semibold`
- Padding মিনিমাল (`py-1.5`) — বেশি vertical জায়গা নেবে না
- বাকি সব same — no badge, marquee loop, hover pause

## ফলাফল
- Mobile: Hero shorter → button এর পর ticker → নিচেই blood request form visible
- Desktop: আগের মতোই airy look
- Ticker text prominent, empty strip fill হবে

## Files
- edit: `src/components/HeroSection.tsx`
- edit: `src/components/HeadlineTicker.tsx`
