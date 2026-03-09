import { useState, useMemo } from "react";
import { Search, Users, Loader2 } from "lucide-react";
import { useDonors } from "@/data/donors";
import BloodGroupFilter from "./BloodGroupFilter";
import DonorCard from "./DonorCard";

const DonorList = () => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const { data: donors = [], isLoading } = useDonors();

  const hasFilter = !!selectedGroup || !!search.trim();

  const filtered = useMemo(() => {
    if (!hasFilter) return [];
    return donors.filter((d) => {
      const matchesGroup = !selectedGroup || d.blood_group === selectedGroup;
      const matchesSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.phone.includes(search);
      return matchesGroup && matchesSearch;
    });
  }, [selectedGroup, search, donors, hasFilter]);

  return (
    <section className="px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center gap-2 text-center">
          <Users className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">রক্তদাতা তালিকা</h2>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="নাম বা ফোন নম্বর দিয়ে খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border bg-card py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="mb-6">
          <BloodGroupFilter selected={selectedGroup} onSelect={setSelectedGroup} />
        </div>

        {hasFilter && (
          <p className="mb-4 text-sm text-muted-foreground">
            মোট {filtered.length} জন রক্তদাতা পাওয়া গেছে
          </p>
        )}

        <div className="space-y-3">
          {!hasFilter ? (
            <div className="rounded-xl border border-dashed border-border py-12 text-center text-muted-foreground">
              নাম, ফোন নম্বর বা রক্তের গ্রুপ দিয়ে খুঁজুন
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filtered.length > 0 ? (
            filtered.map((donor) => <DonorCard key={donor.id} donor={donor} />)
          ) : (
            <div className="rounded-xl border border-dashed border-border py-12 text-center text-muted-foreground">
              কোনো রক্তদাতা পাওয়া যায়নি
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DonorList;
