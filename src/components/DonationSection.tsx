import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Copy, Check, Heart, QrCode } from "lucide-react";

const BKASH_NUMBER = "01796552118";
const NAGAD_NUMBER = "01796552118";

const PaymentCard = ({
  name,
  number,
  color,
  qrSeed,
}: {
  name: string;
  number: string;
  color: string;
  qrSeed: string;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(number);
    setCopied(true);
    toast({ title: `${name} নম্বর কপি হয়েছে!` });
    setTimeout(() => setCopied(false), 2000);
  };

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
    `${name}: ${number}`
  )}`;

  return (
    <Card className="overflow-hidden border-border">
      <div className={`h-1.5 ${color}`} />
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 rounded-full ${color} flex items-center justify-center`}>
            <span className="text-sm font-bold text-primary-foreground">{name[0]}</span>
          </div>
          <div>
            <p className="font-semibold text-foreground">{name}</p>
            <p className="text-sm text-muted-foreground">পার্সোনাল নম্বর</p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-3">
          <span className="flex-1 text-lg font-bold tracking-wide text-foreground">{number}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="gap-1.5 shrink-0"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "কপি হয়েছে" : "কপি"}
          </Button>
        </div>

        <div className="flex justify-center rounded-lg border border-border bg-card p-3">
          <img
            src={qrUrl}
            alt={`${name} QR Code`}
            className="h-40 w-40 rounded"
            loading="lazy"
          />
        </div>
      </CardContent>
    </Card>
  );
};

const DonationSection = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    amount: "",
    transactionId: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.amount.trim() || !form.transactionId.trim()) {
      toast({ title: "সকল প্রয়োজনীয় তথ্য পূরণ করুন", variant: "destructive" });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  if (submitted) {
    return (
      <section id="donation" className="px-4 py-12">
        <div className="mx-auto max-w-md">
          <Card className="border-border text-center">
            <CardContent className="p-8 space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent">
                <Heart className="h-8 w-8 fill-primary text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">আপনাকে ধন্যবাদ!</h3>
              <p className="text-muted-foreground">
                আপনার সহযোগিতার জন্য আন্তরিক কৃতজ্ঞতা। আপনার দানে বাঁধন আরও শক্তিশালী হবে।
              </p>
              <Button
                onClick={() => {
                  setSubmitted(false);
                  setForm({ name: "", amount: "", transactionId: "", message: "" });
                }}
                variant="outline"
                className="mt-2"
              >
                আবার দান করুন
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="donation" className="px-4 py-12">
      <div className="mx-auto max-w-2xl space-y-8">
        {/* Section Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-accent-foreground">
            <Heart className="h-3.5 w-3.5 fill-current" />
            আর্থিক সহযোগিতা
          </div>
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">
            বাঁধনকে সহযোগিতা করুন
          </h2>
          <p className="text-sm text-muted-foreground">
            bKash অথবা Nagad এর মাধ্যমে আপনার দান পাঠান
          </p>
        </div>

        {/* Payment Cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          <PaymentCard
            name="bKash"
            number={BKASH_NUMBER}
            color="bg-primary"
            qrSeed="bkash"
          />
          <PaymentCard
            name="Nagad"
            number={NAGAD_NUMBER}
            color="bg-destructive"
            qrSeed="nagad"
          />
        </div>

        {/* Donation Form */}
        <Card className="border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-foreground">দান তথ্য জমা দিন</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="donor-name">আপনার নাম *</Label>
                <Input
                  id="donor-name"
                  placeholder="আপনার পূর্ণ নাম"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  maxLength={100}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">পরিমাণ (টাকা) *</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="যেমন: ৫০০"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  min="1"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="txn-id">ট্রান্সেকশন আইডি *</Label>
                <Input
                  id="txn-id"
                  placeholder="bKash/Nagad ট্রান্সেকশন আইডি"
                  value={form.transactionId}
                  onChange={(e) => setForm({ ...form, transactionId: e.target.value })}
                  maxLength={50}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="donor-message">বার্তা (ঐচ্ছিক)</Label>
                <Textarea
                  id="donor-message"
                  placeholder="আপনার বার্তা লিখুন..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  maxLength={500}
                  rows={3}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "জমা হচ্ছে..." : "জমা দিন"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default DonationSection;
