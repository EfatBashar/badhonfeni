const rows = [
  { a: "+", b: "−", d: "+", g: "A+" },
  { a: "+", b: "−", d: "−", g: "A−" },
  { a: "−", b: "+", d: "+", g: "B+" },
  { a: "−", b: "+", d: "−", g: "B−" },
  { a: "+", b: "+", d: "+", g: "AB+" },
  { a: "+", b: "+", d: "−", g: "AB−" },
  { a: "−", b: "−", d: "+", g: "O+" },
  { a: "−", b: "−", d: "−", g: "O−" },
];

const Cell = ({ v }: { v: string }) => (
  <span
    className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${
      v === "+" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
    }`}
  >
    {v}
  </span>
);

const BloodGroupChart = () => (
  <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
    <div className="border-b border-border bg-primary/5 p-4">
      <h3 className="text-lg font-bold text-foreground">📊 ব্লাড গ্রুপ চার্ট</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        <span className="font-semibold text-primary">+</span> জমাট বেঁধেছে &nbsp;|&nbsp;
        <span className="font-semibold">−</span> জমাট বাঁধেনি
      </p>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-center text-sm">
        <thead>
          <tr className="bg-muted/40 text-xs font-semibold text-muted-foreground">
            <th className="p-3">Anti-A</th>
            <th className="p-3">Anti-B</th>
            <th className="p-3">Anti-D</th>
            <th className="p-3">গ্রুপ</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-border">
              <td className="p-2"><Cell v={r.a} /></td>
              <td className="p-2"><Cell v={r.b} /></td>
              <td className="p-2"><Cell v={r.d} /></td>
              <td className="p-2 text-base font-extrabold text-primary">{r.g}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default BloodGroupChart;
