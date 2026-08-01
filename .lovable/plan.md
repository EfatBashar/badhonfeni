## Fix plan

1. `is_admin()` function-এর execute permission শুধু `authenticated` role-এর জন্য restore করব। বর্তমান security hardening-এ functionটির সব execute permission সরানো হয়েছে, তাই donor/profile RLS policy admin যাচাই করতে পারছে না।
2. `donors` ও `profiles` table-এ `authenticated` role-এর প্রয়োজনীয় read permission restore করব, কারণ বর্তমানে এই দুই table-এর explicit grants অনুপস্থিত। Existing RLS আগের মতোই ঠিক করবে admin কোন rows দেখতে পারবে।
3. অন্য কোনো table, policy, UI, donor visibility rule বা signup flow পরিবর্তন করব না।
4. Migration-এর পরে admin session দিয়ে Donor এবং Signup tab-এ records load হচ্ছে কিনা verify করব।