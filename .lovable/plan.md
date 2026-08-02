## Fix plan

1. `is_admin()` function-এর `EXECUTE` permission শুধু `authenticated` role-এর জন্য restore করব; `anon`/`public` access বন্ধই থাকবে। বর্তমানে functionটি authenticated admin-ও execute করতে পারে না, অথচ Announcement policies এটি call করছে—এই কারণেই screenshot-এর error হচ্ছে।
2. `announcements`, `donors`, ও `profiles` table-এর প্রয়োজনীয় grants restore করব। Existing RLS policies-ই নির্ধারণ করবে কে কোন row দেখতে বা পরিবর্তন করতে পারবে; কোনো public data rule শিথিল করব না।
3. Announcement save এবং active/inactive toggle admin session-এ verify করব; পাশাপাশি Donor ও Signup list load হচ্ছে কিনা check করব।
4. অন্য table, UI, donor visibility, signup flow বা security finding পরিবর্তন করব না।