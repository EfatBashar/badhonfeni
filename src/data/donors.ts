export interface Donor {
  id: number;
  name: string;
  bloodGroup: string;
  phone: string;
  lastDonation?: string;
  totalDonations: number;
}

export interface CommitteeMember {
  id: number;
  name: string;
  role: string;
  phone: string;
  bloodGroup: string;
}

export const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export const donors: Donor[] = [
  { id: 1, name: "আরিফুল ইসলাম", bloodGroup: "A+", phone: "01712345678", lastDonation: "2025-12-15", totalDonations: 5 },
  { id: 2, name: "সাকিব হাসান", bloodGroup: "A+", phone: "01812345678", lastDonation: "2025-11-20", totalDonations: 3 },
  { id: 3, name: "মাহমুদুল হাসান", bloodGroup: "A-", phone: "01912345678", lastDonation: "2026-01-10", totalDonations: 2 },
  { id: 4, name: "তানভীর আহমেদ", bloodGroup: "B+", phone: "01612345678", lastDonation: "2025-10-05", totalDonations: 7 },
  { id: 5, name: "রাকিবুল ইসলাম", bloodGroup: "B+", phone: "01512345678", lastDonation: "2026-02-18", totalDonations: 4 },
  { id: 6, name: "ফাহিম চৌধুরী", bloodGroup: "B-", phone: "01312345678", lastDonation: "2025-09-22", totalDonations: 1 },
  { id: 7, name: "নাঈম উদ্দিন", bloodGroup: "AB+", phone: "01412345678", lastDonation: "2026-01-30", totalDonations: 6 },
  { id: 8, name: "শাহরিয়ার কবির", bloodGroup: "AB+", phone: "01712345679", lastDonation: "2025-08-14", totalDonations: 2 },
  { id: 9, name: "জাহিদ হাসান", bloodGroup: "AB-", phone: "01812345679", lastDonation: "2026-03-01", totalDonations: 3 },
  { id: 10, name: "রিফাত আলম", bloodGroup: "O+", phone: "01912345679", lastDonation: "2025-12-28", totalDonations: 8 },
  { id: 11, name: "সোহেল রানা", bloodGroup: "O+", phone: "01612345679", lastDonation: "2026-02-05", totalDonations: 5 },
  { id: 12, name: "আশরাফুল ইসলাম", bloodGroup: "O+", phone: "01512345679", lastDonation: "2025-11-11", totalDonations: 4 },
  { id: 13, name: "কামরুল হাসান", bloodGroup: "O-", phone: "01312345679", lastDonation: "2026-01-20", totalDonations: 9 },
  { id: 14, name: "মোস্তাফিজুর রহমান", bloodGroup: "O-", phone: "01412345679", lastDonation: "2025-07-15", totalDonations: 2 },
  { id: 15, name: "ইমরান হোসেন", bloodGroup: "A+", phone: "01712345680", lastDonation: "2026-02-28", totalDonations: 6 },
  { id: 16, name: "আব্দুল্লাহ আল মামুন", bloodGroup: "B+", phone: "01812345680", lastDonation: "2025-10-30", totalDonations: 3 },
];

export const committeeMembers: CommitteeMember[] = [
  { id: 1, name: "ড. আবুল কালাম", role: "সভাপতি", phone: "01711111111", bloodGroup: "O+" },
  { id: 2, name: "মোঃ রফিকুল ইসলাম", role: "সাধারণ সম্পাদক", phone: "01811111111", bloodGroup: "A+" },
  { id: 3, name: "নাসরিন আক্তার", role: "সহ-সভাপতি", phone: "01911111111", bloodGroup: "B+" },
  { id: 4, name: "মোঃ জাহিদুল ইসলাম", role: "কোষাধ্যক্ষ", phone: "01611111111", bloodGroup: "AB+" },
  { id: 5, name: "ফারহানা ইয়াসমিন", role: "সাংগঠনিক সম্পাদক", phone: "01511111111", bloodGroup: "O-" },
  { id: 6, name: "মোঃ আলী হোসেন", role: "প্রচার সম্পাদক", phone: "01311111111", bloodGroup: "A-" },
];
