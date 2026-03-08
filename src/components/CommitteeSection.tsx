import { Phone, Shield, Loader2 } from "lucide-react";
import { useCommitteeMembers } from "@/data/donors";

const CommitteeSection = () => {
  const { data: members = [], isLoading } = useCommitteeMembers();

  return (
    <section className="bg-secondary/50 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">কমিটি সদস্য</h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm"
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {member.blood_group}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-foreground">{member.name}</h3>
                  <p className="text-xs font-medium text-primary">{member.role}</p>
                </div>
                <a
                  href={`tel:${member.phone}`}
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-accent text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <Phone className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CommitteeSection;
