## সমস্যা

`src/pages/ResetPassword.tsx` শুধু `PASSWORD_RECOVERY` event এলে ফর্ম দেখায়। কিন্তু listener টা register হওয়ার আগেই Supabase client URL-এর token process করে ফেলতে পারে (অথবা লিংকে `token_hash`/`code` থাকলে event টাইমিং মিস হয়) — তখন পেজে চিরকাল **"লিংক যাচাই হচ্ছে..."** আটকে থাকে, নতুন password সেট করা যায় না।

## যা করব

**1. `src/pages/ResetPassword.tsx` rewrite (recovery detection robust করা)**
- Mount-এ তিনটা path handle করা:
  - URL hash-এ `type=recovery` + `access_token` → session set হওয়া পর্যন্ত wait
  - Query-তে `code=` (PKCE) → `exchangeCodeForSession`
  - Query-তে `token_hash=` + `type=recovery` → `verifyOtp`
- এর যেকোনোটা সফল হলে, অথবা `getSession()` valid session দিলে, অথবা `PASSWORD_RECOVERY` event এলে → ফর্ম দেখাও।
- কোনোটাই না হলে (মেয়াদোত্তীর্ণ/ভুল লিংক) → "লিংক যাচাই হচ্ছে..." এর বদলে পরিষ্কার error message + "আবার রিসেট লিংক পাঠান" বাটন যা `/login`-এ ফেরত নেবে।
- Password confirm field যোগ (দুইবার মিলিয়ে দেখা) — টাইপো ঠেকাতে।
- সফল হলে আগের মতোই signOut → `/login` redirect।

**2. `src/components/AuthGate.tsx`**
- `/reset-password` ইতিমধ্যেই public route, তবে recovery session থাকলে গেট যেন redirect না করে সেটা নিশ্চিত করা (path check hash/query সহ কাজ করে কিনা যাচাই)।

**3. `src/pages/Login.tsx`**
- `resetPasswordForEmail`-এর `redirectTo` ঠিকই আছে; শুধু rate-limit (429) হলে বাংলায় বোধগম্য message দেখানো।

**4. যাচাই**
- Preview-তে Playwright দিয়ে `/reset-password` invalid ও valid দুই অবস্থায় render চেক করা, আর auth redirect URL allowlist-এ preview + published দুই origin আছে কিনা confirm করা।

## টেকনিক্যাল নোট
Recovery link-এর ফরম্যাট Supabase-এর template/flow অনুযায়ী hash-token বা PKCE হতে পারে — তাই একটাতে নির্ভর না করে তিনটাই handle করা হচ্ছে। কোনো database migration লাগবে না, শুধু frontend পরিবর্তন।