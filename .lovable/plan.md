## যা হবে

হোমপেজ ব্যানারে এখন **একাধিক ছবি** আপলোড করা যাবে। ছবিগুলো নির্দিষ্ট সময় পর পর নিজে নিজে change হবে (carousel/slideshow), আর user চাইলে বাঁ/ডান arrow বা নিচের dot গুলোতে tap করে manually ছবি দেখতে পারবে।

## Database পরিবর্তন

`announcements` table-এ নতুন column:
- `image_urls` (text array) — একাধিক ছবির data URL রাখবে

পুরনো `image_url` (single) column রেখে দেব backward compatibility-এর জন্য — কোনো data হারাবে না।

## Admin panel (`AnnouncementManager.tsx`)

- "ছবি বাছুন" এখন **multiple select** — একসাথে অনেক ছবি নেওয়া যাবে, বা এক এক করেও add করা যাবে
- প্রতিটা preview thumbnail এর পাশে ❌ button → শুধু ঐটা সরানো যাবে
- Drag-free simple reorder (উপরে/নিচে arrow button) — কোন ছবি আগে দেখাবে সেটা ঠিক করার জন্য
- প্রতি ছবি ≤ ১.৫MB (আগের মতোই)
- একটাও ছবি না দিলে → আগের মতো scrolling লাল text দেখাবে

## Homepage banner (`AnnouncementBanner.tsx`)

- ১টা ছবি থাকলে → static ছবি (আগের মতো)
- ২+ ছবি থাকলে → **carousel**:
  - প্রতি **৪ সেকেন্ড** পর auto next (fade transition)
  - বাঁ/ডান chevron arrow (subtle, ছবির উপর overlay)
  - নিচে dot indicator — কোন ছবিতে আছি বোঝাবে, tap করে jump করা যাবে
  - user manually change করলে auto-rotate ৮ সেকেন্ডের জন্য pause হবে
- Full-width, auto height — layout একই থাকবে
- কোনো ছবি না থাকলে → text marquee (unchanged)

## Files

- migration: `announcements` table-এ `image_urls text[]` column add
- edit: `src/components/AnnouncementBanner.tsx` — carousel logic
- edit: `src/components/admin/AnnouncementManager.tsx` — multi-image upload + reorder + remove

## Technical notes

- Auto-advance: `useEffect` + `setInterval`, cleanup on unmount, pause on user interaction (timeout reset)
- Transition: Tailwind `transition-opacity` দিয়ে simple crossfade
- Realtime: existing `announcements-banner` channel-ই invalidate করবে — নতুন কিছু setup লাগবে না
