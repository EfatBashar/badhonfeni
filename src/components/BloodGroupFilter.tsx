import { bloodGroups } from "@/data/donors";
import { cn } from "@/lib/utils";

interface BloodGroupFilterProps {
  selected: string | null;
  onSelect: (group: string | null) => void;
}

const BloodGroupFilter = ({ selected, onSelect }: BloodGroupFilterProps) => {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          "rounded-full px-4 py-2 text-sm font-semibold transition-all",
          selected === null
            ? "bg-primary text-primary-foreground shadow-md"
            : "bg-secondary text-secondary-foreground hover:bg-accent"
        )}
      >
        সকল
      </button>
      {bloodGroups.map((group) => (
        <button
          key={group}
          onClick={() => onSelect(group)}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-bold transition-all",
            selected === group
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-secondary text-secondary-foreground hover:bg-accent"
          )}
        >
          {group}
        </button>
      ))}
    </div>
  );
};

export default BloodGroupFilter;
