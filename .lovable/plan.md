## পরিস্থিতি সংক্ষেপে

- **Female donor পুরনো data restore সম্ভব নয়** — database check করে দেখা গেছে donors table-এ কোনো gender column নেই, আগে hard delete করা হয়েছিল, তাই পুরনো female entries স্থায়ীভাবে চলে গেছে। নতুন করে add করতে হলে আপনাকে list (PDF/text/CSV) দিতে হবে অথবা admin panel থেকে manually add করতে হবে।
- Core memory rule "ONLY MALE DONORS ALLOWED" — এটা আপনার নতুন সিদ্ধান্ত অনুযায়ী **remove/update** করা হবে।

---

## Plan

### ১. Female donors সাপোর্ট + visibility toggle

**Database migration (`donors` table):**
- `gender` column যোগ (`'male' | 'female'`, default `'male'`, NOT NULL)
- `is_visible` column যোগ (boolean, default `true`) — off হলে public list-এ দেখাবে না, শুধু admin দেখবে
- Public SELECT policy update: `USING (is_visible = true)` — admin আলাদা policy দিয়ে সব দেখবে
- Admin (badhanfgcunit2018@gmail.com) সব donor দেখতে পারবে এমন policy

**Frontend:**
- `DonorSignupForm.tsx`-এ gender radio (পুরুষ/মহিলা) যোগ
- Admin `DonorManagement.tsx`-এ:
  - Add form-এ gender select
  - প্রতিটি row-এ **Eye/EyeOff toggle button** (visibility on/off)
  - Hidden donors একটু faded দেখাবে + একটা badge
- `useDonors` hook দুটো mode: public (visible only) vs admin (সব)

**Memory update:** Core rule "ONLY MALE DONORS" remove করবো, নতুন rule যোগ — female donors allowed, visibility admin controlled।

### ২. Blood request-এ Hemoglobin (required)

**Migration:** `blood_requests` table-এ `hemoglobin` column (numeric, NOT NULL, default 0 temporarily তারপর app-এ required validation)

আসলে existing rows-এর জন্য default দিতে হবে — `numeric NOT NULL DEFAULT 0` দিয়ে migration, তারপর form-এ required।

**Frontend (`BloodRequestForm.tsx`):**
- Numeric input "হিমোগ্লোবিন (g/dL)" — required, range 5–20, step 0.1
- Zod validation add
- `BloodRequestList.tsx` (admin)-এ hemoglobin column show

### ৩. Admin page-এ নতুন signups

**Database:**
- `profiles` table-এ `created_at` already আছে কিনা check — এখন নেই, migration-এ যোগ করবো (default now())
- Admin-only SELECT policy: শুধু badhanfgcunit2018@gmail.com সব profiles দেখতে পারবে (has_role বা email match)। বর্তমানে profiles-এ user নিজের row দেখে; admin আলাদা policy পাবে।

**Frontend (`Admin.tsx`):**
- নতুন tab/section: **"নতুন সাইনআপ"**
- Table columns: Phone | Blood Group | সাইনআপ তারিখ (Bangla format)
- Sorted by created_at desc

---

## Technical details

**Files to create/edit:**
- New migration: gender + is_visible on donors, hemoglobin on blood_requests, created_at on profiles, updated RLS policies
- `src/data/donors.ts` — Donor type update, `useDonors(adminMode)` param
- `src/components/DonorList.tsx` — filter visible only
- `src/components/DonorSignupForm.tsx` — gender field
- `src/components/DonorCard.tsx` — optional gender badge
- `src/components/admin/DonorManagement.tsx` — visibility toggle button, gender column
- `src/components/BloodRequestForm.tsx` — hemoglobin input + validation
- `src/components/admin/BloodRequestList.tsx` — hemoglobin column
- `src/components/admin/NewSignupsList.tsx` (নতুন) — profiles list for admin
- `src/pages/Admin.tsx` — নতুন tab যোগ
- `src/integrations/supabase/types.ts` — auto-regenerate after migration
- Memory files update — female donor rule reverse

**RLS pattern for admin-only visibility:**
```sql
CREATE POLICY "Admin sees all donors" ON donors FOR SELECT
  TO authenticated
  USING ((SELECT email FROM auth.users WHERE id = auth.uid()) = 'badhanfgcunit2018@gmail.com');
```
Public policy limited to `is_visible = true`।

---

## একটা প্রশ্ন

Female donor data কীভাবে add হবে সেটা এখনো clear না — আপনি বলেছেন "restore possible কিনা check করো", কিন্তু restore সম্ভব নয়। তাই দুটো option:

**A.** আপাতত শুধু schema + admin UI ready করি (gender field, visibility toggle) — পরে আপনি PDF/list দিলে bulk import করবো।

**B.** আপনার কাছে যদি এখনই female donor list থাকে (Excel/PDF/text), সেটা upload করুন, একসাথে import করে দেবো।

Plan approve করলে **option A** ধরে এগোবো (structure ready রাখবো), unless আপনি list দেন।
