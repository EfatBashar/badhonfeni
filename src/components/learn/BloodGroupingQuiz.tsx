import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X, RotateCcw, Trophy } from "lucide-react";

type Q = { A: boolean; B: boolean; D: boolean; answer: string };

const ALL: Q[] = [
  { A: true,  B: false, D: true,  answer: "A+" },
  { A: true,  B: false, D: false, answer: "A−" },
  { A: false, B: true,  D: true,  answer: "B+" },
  { A: false, B: true,  D: false, answer: "B−" },
  { A: true,  B: true,  D: true,  answer: "AB+" },
  { A: true,  B: true,  D: false, answer: "AB−" },
  { A: false, B: false, D: true,  answer: "O+" },
  { A: false, B: false, D: false, answer: "O−" },
];

const OPTIONS = ["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−"];

const shuffle = <T,>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);

const Pill = ({ label, on }: { label: string; on: boolean }) => (
  <div className="flex flex-col items-center gap-1.5">
    <div className="text-xs font-semibold text-muted-foreground">Anti-{label}</div>
    <div
      className={`relative h-14 w-14 rounded-full ${
        on
          ? "bg-gradient-to-br from-primary to-primary/70"
          : "bg-gradient-to-br from-primary/90 to-primary/60"
      }`}
    >
      {on && (
        <div className="absolute inset-1.5 grid grid-cols-3 gap-0.5">
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} className="h-1.5 w-1.5 rounded-full bg-primary-foreground/70" />
          ))}
        </div>
      )}
    </div>
    <div className={`text-[10px] font-medium ${on ? "text-primary" : "text-muted-foreground"}`}>
      {on ? "জমাট ✓" : "জমাট নেই −"}
    </div>
  </div>
);

const explain = (q: Q) => {
  const abo = q.A && q.B ? "AB (A ও B উভয় antigen আছে)" : q.A ? "A (শুধু A antigen)" : q.B ? "B (শুধু B antigen)" : "O (কোনো antigen নেই)";
  const rh = q.D ? "Rh+ (Anti-D তে জমাট)" : "Rh− (Anti-D তে জমাট নেই)";
  return `${abo} এবং ${rh} → ${q.answer}`;
};

const BloodGroupingQuiz = () => {
  const [questions, setQuestions] = useState<Q[]>(() => shuffle(ALL));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);

  const q = questions[idx];
  const isLast = idx === questions.length - 1;
  const finished = idx >= questions.length;

  const progress = useMemo(() => ((idx + (selected ? 1 : 0)) / questions.length) * 100, [idx, selected, questions.length]);

  const pick = (opt: string) => {
    if (selected) return;
    setSelected(opt);
    if (opt === q.answer) setScore((s) => s + 1);
  };

  const next = () => {
    setSelected(null);
    setIdx((i) => i + 1);
  };

  const restart = () => {
    setQuestions(shuffle(ALL));
    setIdx(0);
    setScore(0);
    setSelected(null);
  };

  if (finished) {
    const perfect = score === questions.length;
    const good = score >= 6;
    return (
      <div className="rounded-2xl border-2 border-primary/20 bg-card p-6 text-center shadow-lg">
        <Trophy className="mx-auto h-12 w-12 text-primary" />
        <h3 className="mt-3 text-xl font-bold text-foreground">কুইজ শেষ!</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {questions.length} এর মধ্যে <span className="font-bold text-primary">{score}</span> সঠিক
        </p>
        <p className="mt-1 text-sm font-medium text-foreground">
          {perfect ? "🎉 অসাধারণ! সবগুলো সঠিক।" : good ? "চমৎকার! আরেকটু অনুশীলন করুন।" : "চিন্তা করবেন না — চার্ট দেখে আবার চেষ্টা করুন।"}
        </p>
        <Button onClick={restart} className="mt-5 gap-2">
          <RotateCcw className="h-4 w-4" /> আবার চেষ্টা করুন
        </Button>
      </div>
    );
  }

  const correct = selected === q.answer;

  return (
    <div className="rounded-2xl border-2 border-primary/20 bg-card p-6 shadow-lg">
      <h3 className="text-center text-xl font-bold text-foreground">🎯 কুইজ — গ্রুপ অনুমান করুন</h3>
      <p className="mt-1 text-center text-sm text-muted-foreground">
        ফলাফল দেখে সঠিক ব্লাড গ্রুপ বেছে নিন
      </p>

      {/* progress */}
      <div className="mt-4">
        <div className="mb-1 flex justify-between text-xs text-muted-foreground">
          <span>প্রশ্ন {idx + 1} / {questions.length}</span>
          <span>স্কোর: {score}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* question */}
      <div className="mt-6 grid grid-cols-3 gap-3 rounded-xl bg-muted/40 py-4">
        <Pill label="A" on={q.A} />
        <Pill label="B" on={q.B} />
        <Pill label="D" on={q.D} />
      </div>

      {/* options */}
      <div className="mt-5 grid grid-cols-4 gap-2">
        {OPTIONS.map((opt) => {
          const isSel = selected === opt;
          const isAns = opt === q.answer;
          let cls = "bg-muted text-foreground hover:bg-muted/70";
          if (selected) {
            if (isAns) cls = "bg-green-500 text-white";
            else if (isSel) cls = "bg-destructive text-destructive-foreground";
            else cls = "bg-muted/50 text-muted-foreground";
          }
          return (
            <button
              key={opt}
              onClick={() => pick(opt)}
              disabled={!!selected}
              className={`rounded-lg py-2.5 text-sm font-bold transition-colors ${cls}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* feedback */}
      {selected && (
        <div
          className={`mt-5 rounded-xl p-4 text-sm ${
            correct ? "bg-green-500/10 text-green-700 dark:text-green-400" : "bg-destructive/10 text-destructive"
          }`}
        >
          <div className="mb-1 flex items-center gap-2 font-bold">
            {correct ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
            {correct ? "সঠিক!" : `ভুল — সঠিক উত্তর: ${q.answer}`}
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">{explain(q)}</p>
          <Button onClick={next} size="sm" className="mt-3 w-full">
            {isLast ? "ফলাফল দেখুন" : "পরবর্তী প্রশ্ন →"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default BloodGroupingQuiz;
