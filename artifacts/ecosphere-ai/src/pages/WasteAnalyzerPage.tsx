import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Recycle, Trash2, Smartphone, Battery, Package, ArrowRight, Leaf, Plus, CheckCircle2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { motion, AnimatePresence } from "framer-motion";

interface WasteEntry { id: number; date: string; organicKg: string; recyclableKg: string; trashKg: string; totalKg: string; createdAt: string; }

const FALLBACK = [
  { name: "Mon", organic: 1.2, recyclable: 0.8, trash: 0.5 },
  { name: "Tue", organic: 0.9, recyclable: 1.1, trash: 0.6 },
  { name: "Wed", organic: 1.5, recyclable: 0.7, trash: 0.8 },
  { name: "Thu", organic: 1.1, recyclable: 1.3, trash: 0.4 },
  { name: "Fri", organic: 1.8, recyclable: 0.9, trash: 0.5 },
  { name: "Sat", organic: 2.2, recyclable: 1.5, trash: 1.1 },
  { name: "Sun", organic: 2.0, recyclable: 1.2, trash: 0.9 },
];

export default function WasteAnalyzerPage() {
  const [entries, setEntries] = useState<WasteEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [organicKg, setOrganicKg] = useState(1.0);
  const [recyclableKg, setRecyclableKg] = useState(0.8);
  const [trashKg, setTrashKg] = useState(0.5);
  const [logDate, setLogDate] = useState(new Date().toISOString().split("T")[0]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchEntries = () => {
    fetch("/api/waste/entries?limit=14")
      .then(r => r.json())
      .then((data: WasteEntry[]) => { setEntries(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchEntries(); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/waste/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: logDate, organicKg, recyclableKg, trashKg }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      fetchEntries();
    } catch { /* ignore */ } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/waste/entries/${id}`, { method: "DELETE" });
    fetchEntries();
  };

  // Stats from real data
  const hasData = entries.length > 0;
  const totalKg = hasData ? entries.reduce((s, e) => s + parseFloat(e.totalKg), 0) : 14.2;
  const totalOrganic = hasData ? entries.reduce((s, e) => s + parseFloat(e.organicKg), 0) : 5.4;
  const totalRecyclable = hasData ? entries.reduce((s, e) => s + parseFloat(e.recyclableKg), 0) : 4.2;
  const diversionRate = hasData && totalKg > 0
    ? Math.round((totalOrganic + totalRecyclable) / totalKg * 100)
    : 68;

  // Chart data — last 7 entries reversed
  const chartData = hasData
    ? [...entries].reverse().slice(0, 7).map(e => ({
        name: new Date(e.date).toLocaleDateString("en-US", { weekday: "short" }),
        organic: parseFloat(e.organicKg),
        recyclable: parseFloat(e.recyclableKg),
        trash: parseFloat(e.trashKg),
      }))
    : FALLBACK;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-primary/10 rounded-lg"><Recycle className="h-6 w-6 text-primary" /></div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Waste Analyzer</h1>
          <p className="text-sm text-muted-foreground">Track and optimize your disposal habits</p>
        </div>
      </div>

      {/* Log form */}
      <Card className="border-primary/30 bg-primary/5 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Plus className="h-4 w-4 text-primary" /> Log Waste Entry
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-5 mb-4">
            {([
              { label: "Organic (kg)", value: organicKg, set: setOrganicKg, color: "hsl(var(--accent))" },
              { label: "Recyclable (kg)", value: recyclableKg, set: setRecyclableKg, color: "hsl(var(--primary))" },
              { label: "Landfill (kg)", value: trashKg, set: setTrashKg, color: "hsl(var(--muted-foreground))" },
            ] as { label: string; value: number; set: (v: number) => void; color: string }[]).map(({ label, value, set, color }) => (
              <div key={label} className="space-y-3">
                <div className="flex justify-between">
                  <Label>{label}</Label>
                  <span className="text-sm font-bold tabular-nums" style={{ color }}>{value.toFixed(1)} kg</span>
                </div>
                <Slider value={[value]} onValueChange={([v]) => set(v)} min={0} max={5} step={0.1} />
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-end gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Date</Label>
              <input type="date" value={logDate} onChange={e => setLogDate(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm" />
            </div>
            <div className="text-sm text-muted-foreground px-2 py-2 hidden sm:block">
              Total: <span className="font-bold text-foreground">{(organicKg + recyclableKg + trashKg).toFixed(1)} kg</span>
            </div>
            <Button onClick={handleSave} disabled={saving} className="gap-2 bg-primary text-primary-foreground hover:opacity-90 border-none shadow-sm sm:ml-auto">
              {saved ? <><CheckCircle2 className="h-4 w-4" /> Saved!</> : saving ? "Saving…" : <><Recycle className="h-4 w-4" /> Log Waste</>}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-l-4 border-l-primary bg-primary/5 shadow-sm">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-primary">Diversion Rate</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{diversionRate}%</div>
            <p className="text-xs font-medium text-primary/80 mt-2">{diversionRate >= 50 ? "Good — above 50% target" : "Below 50% target"}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-destructive shadow-sm">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Waste (kg)</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalKg.toFixed(1)}</div>
            <p className="text-xs font-medium text-muted-foreground mt-2">{hasData ? `${entries.length} log entries` : "Sample data"}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-accent shadow-sm">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Composted (kg)</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{totalOrganic.toFixed(1)}</div>
            <p className="text-xs font-medium text-accent mt-2">{totalOrganic > 3 ? "Great job!" : "Keep composting!"}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Weekly Breakdown</CardTitle>
            {!hasData && <p className="text-xs text-muted-foreground">Showing sample data — log entries above to see your real waste</p>}
          </CardHeader>
          <CardContent>
            <div className="h-[250px] md:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickMargin={10} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip wrapperClassName="dark:bg-background dark:text-foreground border border-border rounded-lg shadow-md" cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }} />
                  <Bar dataKey="organic" stackId="a" fill="hsl(var(--accent))" name="Organic" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="recyclable" stackId="a" fill="hsl(var(--primary))" name="Recyclable" />
                  <Bar dataKey="trash" stackId="a" fill="hsl(var(--muted-foreground))" name="Landfill" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {hasData && (
              <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recent Logs</p>
                <AnimatePresence>
                  {entries.slice(0, 5).map(e => (
                    <motion.div key={e.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                      className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30 border border-border/40 text-sm">
                      <span className="text-muted-foreground">{e.date}</span>
                      <div className="flex gap-3 text-xs">
                        <span className="text-accent font-medium">{parseFloat(e.organicKg).toFixed(1)}kg org</span>
                        <span className="text-primary font-medium">{parseFloat(e.recyclableKg).toFixed(1)}kg rec</span>
                        <span className="text-muted-foreground">{parseFloat(e.trashKg).toFixed(1)}kg trash</span>
                      </div>
                      <button onClick={() => handleDelete(e.id)} className="p-1 rounded hover:bg-destructive/10 hover:text-destructive transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader><CardTitle className="text-xl">Classification Guide</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {[
              { icon: Leaf, label: "Organic", desc: "Food scraps, yard waste.", color: "accent" },
              { icon: Package, label: "Recyclables", desc: "Paper, plastics, glass.", color: "primary" },
              { icon: Battery, label: "Hazardous", desc: "Batteries, chemicals.", color: "destructive" },
              { icon: Smartphone, label: "E-Waste", desc: "Phones, cables, boards.", color: "blue-500" },
            ].map(({ icon: Icon, label, desc, color }) => (
              <div key={label} className={`flex items-center justify-between p-4 rounded-xl bg-${color}/10 border border-${color}/20 cursor-pointer hover:bg-${color}/20 transition-colors`}>
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white dark:bg-black rounded-lg shadow-sm">
                    <Icon className={`h-6 w-6 text-${color} shrink-0`} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{label}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{desc}</p>
                  </div>
                </div>
                <ArrowRight className={`h-4 w-4 text-${color}/50`} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
