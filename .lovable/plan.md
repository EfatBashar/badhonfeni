## লক্ষ্য
Hero section এর "রক্ত প্রয়োজন? কল করুন" button এর নিচে একটা **scrolling headline ticker** (TV news style) থাকবে, যেটা admin panel থেকে edit করা যাবে এবং continuously repeat হবে।

## Database (migration)
নতুন table `public.announcements`:
- `id` (uuid, pk)
- `message` (text)
- `is_active` (boolean, default true)
- `created_at`, `updated_at`

Single-row pattern — admin update করলে সবাই দেখবে।

**Access rules:**
- Anon + authenticated: শুধু active announcement `SELECT` করতে পারবে
- Admin (`is_admin()`): সব operation (`INSERT`, `UPDATE`, `DELETE`)
- Proper `GRANT` statements included

Seed row: "রক্তদান জীবন বাঁচায় — আজই বাঁধন, ফেনী সরকারি কলেজ ইউনিটে যোগাযোগ করুন।"

## Frontend

### 1. New component: `src/components/HeadlineTicker.tsx`
- Supabase থেকে active announcement fetch করবে (React Query)
- CSS animation দিয়ে right-to-left continuous scroll (marquee)
- Message কে ২-৩ বার repeat করে seamless loop
- Red/white theme, TV news headline look:
  - Left side এ pulsing red "LIVE" / "📢 ঘোষণা" badge
  - Scrolling white text on primary background (অথবা inverse)
- Realtime subscribe — admin update করলে সাথে সাথে reflect

### 2. `HeroSection.tsx` update
"কল করুন" button এর নিচে `<HeadlineTicker />` render।

### 3. Admin panel: `src/components/admin/AnnouncementManager.tsx`
- Current message দেখাবে (textarea)
- Save button — update করবে row
- Active toggle switch
- `Admin.tsx` এ নতুন tab "ঘোষণা" (Megaphone icon) — এখন ৫টা tab হবে, grid `grid-cols-5`

## Technical notes
- Marquee: pure CSS `@keyframes` `translateX(0)` → `translateX(-50%)`, duplicate content twice for seamless loop
- Speed: ~20-25s per cycle, hover এ pause
- Empty/inactive হলে ticker hide
- Realtime channel `postgres_changes` on `announcements` table

## Files to touch
- new migration
- new: `src/components/HeadlineTicker.tsx`
- new: `src/components/admin/AnnouncementManager.tsx`
- edit: `src/components/HeroSection.tsx`
- edit: `src/pages/Admin.tsx`
- auto-regenerated: `src/integrations/supabase/types.ts`
