import { Phone, Droplets } from "lucide-react";
import type { Donor } from "@/data/donors";

const DonorCard = ({ donor }: { donor: Donor }) => {
  return (
    <div className="group relative flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md">
      {/* Blood group badge */}
      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg font-extrabold text-primary">
        {donor.bloodGroup}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate font-semibold text-foreground">{donor.name}</h3>
        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Droplets className="h-3 w-3" />
            {donor.totalDonations} বার দান
          </span>
          {donor.lastDonation && (
            <span>সর্বশেষ: {new Date(donor.lastDonation).toLocaleDateString("bn-BD")}</span>
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
