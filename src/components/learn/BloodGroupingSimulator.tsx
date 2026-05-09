import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

type Drop = "A" | "B" | "D";

const DropCircle = ({ clumped }: { clumped: boolean }) => (
  <div
    className={`relative h-24 w-24 rounded-full transition-all ${
      clumped
        ? "bg-gradient-to-br from-primary to-primary/70 shadow-inner"
        : "bg-gradient-to-br from-primary/90 to-primary/60 shadow-md"
    }`}
  >
    {clumped && (
      <div className="absolute inset-2 grid grid-cols-3 gap-1">
        {Array.from({ length: 9 }).map((_, i) => (
          <span key={i} className="h-2 w-2 rounded-full bg-primary-foreground/70" />
        ))}
      </div>
    )}
  </div>
);

const BloodGroupingSimulator = () => {
  const [state, setState] = useState<Record<Drop, boolean>>({ A: false, B: false, D: false });

  const toggle = (k: Drop) => setState((s) => ({ ...s, [k]: !s[k] }));
  const reset = () => setState({ A: false, B: false, D: false });

  const abo = state.A && state.B ? "AB" : state.A ? "A" : state.B ? "B" : "O";
  const rh = state.D ? "+" : "−";
  const result = `${abo}${rh}`;

  const explanation = [
    state.A ? "Anti-A তে জমাট → রক্তে A অ্যান্টিজেন আছে।" : "Anti-A তে জমাট নেই → A অ্যান্টিজেন নেই।",
    state.B ? "Anti-B তে জমাট → রক্তে B অ্যান্টিজেন আছে।" : "Anti-B তে জমাট নেই → B অ্যান্টিজেন নেই।",
    state.D ? "Anti-D তে জমাট → Rh পজিটিভ (+)।" : "Anti-D তে জমাট নেই → Rh নেগেটিভ (−)।",
  ];

  return (
    <div className="rounded-2xl border-2 border-primary/20 bg-card p-6 shadow-lg">
      <h3 className="mb-2 text-center text-xl font-bold text-foreground">🧪 ইন্টারঅ্যাকটিভ সিমুলেটর</h3>
      <p className="mb-6 text-center text-sm text-muted-foreground">
        প্রতিটি ফোঁটায় ট্যাপ করে বলুন — জমাট বেঁধেছে কিনা
      </p>

      <div className="grid grid-cols-3 gap-3 sm:gap-6">
        {(["A", "B", "D"] as Drop[]).map((k) => (
          <div key={k} className="flex flex-col items-center gap-3">
            <div className="text-sm font-semibold text-muted-foreground">Anti-{k}</div>
            <button
              onClick={() => toggle(k)}
              className="rounded-full transition-transform hover:scale-105 active:scale-95"
              aria-label={`Anti-${k} toggle`}
            >
              <DropCircle clumped={state[k]} />
            </button>
            <button
              onClick={() => toggle(k)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                state[k]
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {state[k] ? "জমাট ✓" : "জমাট নেই"}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-xl bg-primary/5 p-5 text-center">
        <div className="text-sm font-medium text-muted-foreground">এই রক্তের গ্রুপ</div>
        <div className="my-2 text-5xl font-extrabold text-primary">{result}</div>
        <ul className="mx-auto mt-3 max-w-md space-y-1 text-left text-xs text-muted-foreground">
          {explanation.map((e, i) => (
            <li key={i}>• {e}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4 flex justify-center">
        <Button variant="outline" size="sm" onClick={reset} className="gap-2">
          <RotateCcw className="h-4 w-4" /> রিসেট
        </Button>
      </div>
    </div>
  );
};

export default BloodGroupingSimulator;
