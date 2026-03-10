import { Phone, Droplets, CheckCircle, Clock } from "lucide-react";
import type { Donor } from "@/data/donors";

const isEligible = (lastDonation: string | null): boolean => {
  if (!lastDonation) return true;
  const last = new Date(lastDonation);
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  return last <= threeMonthsAgo;
};

const DonorCard = ({ donor }: { donor: Donor }) => {
  const eligible = isEligible(donor.last_donation);

  return (
    <div className="group relative flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md">
      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg font-extrabold text-primary">
        {donor.blood_group}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate font-semibold text-foreground">{donor.name}</h3>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Droplets className="h-3 w-3" />
            {donor.total_donations} বার দান
          </span>
          {donor.last_donation && (
            <span>সর্বশেষ: {new Date(donor.last_donation).toLocaleDateString("bn-BD")}</span>
          )}
        </div>
        <div className="mt-1">
          {eligible ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
              <CheckCircle className="h-3 w-3" /> রক্তদানে সক্ষম
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-semibold text-yellow-700">
              <Clock className="h-3 w-3" /> এখনো সময় হয়নি
            </span>
          )}
        </div>
      </div>

      <a
        href={`tel:${donor.phone}`}
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow transition-transform hover:scale-110"
      >
        <Phone className="h-4 w-4" />
      </a>
    </div>
  );
};

export default DonorCard;
