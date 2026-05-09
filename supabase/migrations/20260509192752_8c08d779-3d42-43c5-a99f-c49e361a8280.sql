
CREATE TABLE public.quiz_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.quiz_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view quiz scores"
ON public.quiz_scores FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can insert quiz scores"
ON public.quiz_scores FOR INSERT
TO authenticated
WITH CHECK (
  char_length(trim(name)) BETWEEN 2 AND 50
  AND score >= 0
  AND total > 0
  AND score <= total
);

CREATE INDEX idx_quiz_scores_score ON public.quiz_scores (score DESC, created_at ASC);
