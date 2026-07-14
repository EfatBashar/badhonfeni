import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Trophy, Check, X, RotateCcw, Send, Crown, Medal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { BADHON_QUIZ, type QuizQuestion } from "@/data/badhonQuiz";

const QUESTIONS_PER_ROUND = 100; // all 100 questions per round (shuffled)

const shuffle = <T,>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);

type Score = { id: string; name: string; score: number; total: number; created_at: string };

const BadhonQuiz = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>(() =>
    shuffle(BADHON_QUIZ).slice(0, QUESTIONS_PER_ROUND)
  );
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [scores, setScores] = useState<Score[]>([]);
  const [loadingScores, setLoadingScores] = useState(true);

  const finished = idx >= questions.length;
  const q = questions[idx];
  const progress = useMemo(
    () => ((idx + (selected !== null ? 1 : 0)) / questions.length) * 100,
    [idx, selected, questions.length]
  );

  const loadScores = async () => {
    setLoadingScores(true);
    const { data } = await supabase
      .from("quiz_scores")
      .select("*")
      .order("score", { ascending: false })
      .order("created_at", { ascending: true })
      .limit(20);
    setScores((data as Score[]) ?? []);
    setLoadingScores(false);
  };

  useEffect(() => {
    loadScores();
  }, []);

  const pick = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.answer) setScore((s) => s + 1);
  };

  const next = () => {
    setSelected(null);
    setIdx((i) => i + 1);
  };

  const restart = () => {
    setQuestions(shuffle(BADHON_QUIZ).slice(0, QUESTIONS_PER_ROUND));
    setIdx(0);
    setScore(0);
    setSelected(null);
    setSubmitted(false);
    setName("");
  };

  const submitScore = async () => {
    const trimmed = name.trim();
    if (trimmed.length < 2 || trimmed.length > 50) {
      toast({ title: "নাম দিন", description: "নাম ২–৫০ অক্ষরের মধ্যে হতে হবে।", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("quiz_scores").insert({
      name: trimmed,
      score,
      total: questions.length,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "জমা দেওয়া যায়নি", description: error.message, variant: "destructive" });
      return;
    }
    setSubmitted(true);
    toast({ title: "✅ স্কোর জমা হয়েছে!", description: "Leaderboard এ দেখুন।" });
    loadScores();
  };

  const rankIcon = (i: number) => {
    if (i === 0) return <Crown className="h-4 w-4 text-yellow-500" />;
    if (i === 1) return <Medal className="h-4 w-4 text-gray-400" />;
    if (i === 2) return <Medal className="h-4 w-4 text-amber-700" />;
    return <span className="text-xs font-bold text-muted-foreground">{i + 1}</span>;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-card/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <Link to="/" className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted" aria-label="হোম">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-base font-bold text-foreground">ব্লাড ও বাঁধন কুইজ</h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-6 px-4 py-6">
        {/* Intro card */}
        <section className="rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-5 text-primary-foreground shadow-lg">
          <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/15 px-2.5 py-0.5 text-[11px] font-medium">
            <Trophy className="h-3 w-3" /> মোট {QUESTIONS_PER_ROUND}টি প্রশ্ন
          </div>
          <h2 className="mt-1 text-xl font-extrabold">আপনার জ্ঞান যাচাই করুন</h2>
          <p className="mt-1 text-sm font-light text-primary-foreground/90">
            প্রতিটি রাউন্ডে এলোমেলোভাবে {QUESTIONS_PER_ROUND}টি প্রশ্ন আসবে। শেষে নাম দিয়ে Leaderboard এ স্কোর জমা দিন।
          </p>
        </section>

        {/* Quiz card */}
        {!finished ? (
          <section className="rounded-2xl border-2 border-primary/20 bg-card p-5 shadow-lg">
            <div className="mb-3">
              <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                <span>প্রশ্ন {idx + 1} / {questions.length}</span>
                <span>স্কোর: {score}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <h3 className="text-base font-bold text-foreground">{q.q}</h3>

            <div className="mt-4 space-y-2">
              {q.options.map((opt, i) => {
                const isSel = selected === i;
                const isAns = i === q.answer;
                let cls = "border-border bg-background hover:bg-muted";
                if (selected !== null) {
                  if (isAns) cls = "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400";
                  else if (isSel) cls = "border-destructive bg-destructive/10 text-destructive";
                  else cls = "border-border bg-background opacity-60";
                }
                return (
                  <button
                    key={i}
                    onClick={() => pick(i)}
                    disabled={selected !== null}
                    className={`flex w-full items-center justify-between rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-colors ${cls}`}
                  >
                    <span>{opt}</span>
                    {selected !== null && isAns && <Check className="h-4 w-4 text-green-600" />}
                    {selected !== null && isSel && !isAns && <X className="h-4 w-4 text-destructive" />}
                  </button>
                );
              })}
            </div>

            {selected !== null && (
              <Button onClick={next} className="mt-4 w-full">
                {idx === questions.length - 1 ? "ফলাফল দেখুন" : "পরবর্তী প্রশ্ন →"}
              </Button>
            )}
          </section>
        ) : (
          /* Result + submit */
          <section className="rounded-2xl border-2 border-primary/20 bg-card p-6 text-center shadow-lg">
            <Trophy className="mx-auto h-12 w-12 text-primary" />
            <h3 className="mt-2 text-xl font-bold text-foreground">কুইজ শেষ!</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {questions.length} এর মধ্যে <span className="text-2xl font-extrabold text-primary">{score}</span> সঠিক
            </p>

            {!submitted ? (
              <div className="mx-auto mt-5 max-w-sm space-y-3 text-left">
                <Label htmlFor="quiz-name">আপনার নাম (Leaderboard এ দেখাবে)</Label>
                <Input
                  id="quiz-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="যেমন: রাহাত"
                  maxLength={50}
                />
                <div className="flex gap-2">
                  <Button onClick={submitScore} disabled={submitting} className="flex-1 gap-2">
                    <Send className="h-4 w-4" /> {submitting ? "জমা হচ্ছে..." : "স্কোর জমা দিন"}
                  </Button>
                  <Button variant="outline" onClick={restart} className="gap-2">
                    <RotateCcw className="h-4 w-4" /> আবার
                  </Button>
                </div>
              </div>
            ) : (
              <Button onClick={restart} className="mt-5 gap-2">
                <RotateCcw className="h-4 w-4" /> আবার চেষ্টা করুন
              </Button>
            )}
          </section>
        )}

        {/* Leaderboard */}
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            <h3 className="text-base font-bold text-foreground">High Score Leaderboard</h3>
          </div>
          {loadingScores ? (
            <p className="py-4 text-center text-sm text-muted-foreground">লোড হচ্ছে...</p>
          ) : scores.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              এখনো কেউ স্কোর জমা দেননি — প্রথম হোন!
            </p>
          ) : (
            <ol className="space-y-1.5">
              {scores.map((s, i) => (
                <li
                  key={s.id}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
                    i < 3 ? "bg-primary/5" : "bg-muted/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center">{rankIcon(i)}</div>
                    <span className="font-medium text-foreground">{s.name}</span>
                  </div>
                  <span className="font-bold text-primary">
                    {s.score}/{s.total}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </section>
      </main>
    </div>
  );
};

export default BadhonQuiz;
