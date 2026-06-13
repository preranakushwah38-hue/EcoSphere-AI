import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Droplet, TrendingDown, Target, CheckCircle2, Plus, Trash2 } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { sampleData } from "@/data/sampleData";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";

interface WaterEntry { id: number; date: string; usageLiters: string; createdAt: string; }

const GOAL = 120;
const COST_PER_LITER = 0.002; // ~$2/1000L

export default function WaterTrackerPage() {
  const [entries, setEntries] = useState<WaterEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [logUsage, setLogUsage] = useState(150);
  const [logDate, setLogDate] = useState(new Date().toISOString().split("T")[0]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchEntries = () => {
    fetch("/api/water/entries?limit=14")
      .then(r => r.json())
      .then((data: WaterEntry[]) => { setEntries(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchEntries(); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/water/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: logDate, usageLiters: logUsage }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      fetchEntries();
    } catch { /* ignore */ } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/water/entries/${id}`, { method: "DELETE" });
    fetchEntries();
  };

  // Compute stats from real entries, fallback to sample
  const hasData = entries.length > 0;
  const dailyAvg = hasData
    ? Math.round(entries.reduce((s, e) => s + parseFloat(e.usageLiters), 0) / entries.length)
    : 130;
  const weeklyTotal = hasData
    ? Math.round(entries.slice(0, 7).reduce((s, e) => s + parseFloat(e.usageLiters), 0))
    : 910;
  const goalPct = Math.min(Math.round((dailyAvg / GOAL) * 100), 150);
  const monthlySavings = hasData
    ? (Math.max(0, 200 - dailyAvg) * 30 * COST_PER_LITER).toFixed(2)
    : "14.50";
  const diffPct = hasData ? Math.round(((dailyAvg - 160) / 160) * 100) : -18;

  // Chart data
  const chartData = hasData
    ? [...entries].reverse().slice(0, 14).map(e => ({
        day: new Date(e.date).toLocaleDateString("en-US", { weekday: "short" }),
        usage: parseFloat(e.usageLiters),
      }))
    : sampleData.waterData;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-accent/10 rounded-lg"><Droplet className="h-6 w-6 text-accent" /></div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Water Tracker</h1>
          <p className="text-sm text-muted-foreground">Monitor your daily water consumption</p>
        </div>
      </div>

      {/* Log form */}
      <Card className="border-accent/30 bg-accent/5 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Plus className="h-4 w-4 text-accent" /> Log Today's Water Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 space-y-3">
              <div className="flex justify-between">
                <Label>Usage (liters)</Label>
                <span className="text-sm font-bold tabular-nums text-accent">{logUsage} L</span>
              </div>
              <Slider value={[logUsage]} onValueChange={([v]) => setLogUsage(v)} min={0} max={500} step={5} className="[&>[data-orientation=horizontal]]:bg-accent/20 [&_[role=slider]]:border-accent" />
              <div className="flex justify-between text-xs text-muted-foreground"><span>0 L</span><span className="text-accent font-medium">Goal: {GOAL} L</span><span>500 L</span></div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Date</Label>
              <input
                type="date"
                value={logDate}
                onChange={e => setLogDate(e.target.value)}
                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm"
              />
            </div>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="h-9 gap-2 bg-accent text-accent-foreground hover:bg-accent/90 border-none shadow-sm"
            >
              {saved ? <><CheckCircle2 className="h-4 w-4" /> Saved!</> : saving ? "Saving…" : <><Droplet className="h-4 w-4" /> Log Usage</>}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-full"><Droplet className="h-5 w-5 text-blue-500" /></div>
            <CardTitle className="text-sm font-medium text-muted-foreground">Daily Avg</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dailyAvg} L</div>
            <p className={`text-xs font-medium mt-1 ${dailyAvg <= GOAL ? "text-green-600 dark:text-green-400" : "text-yellow-600"}`}>
              {dailyAvg <= GOAL ? `${GOAL - dailyAvg} L under goal` : `${dailyAvg - GOAL} L over goal`}
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-full"><Target className="h-5 w-5 text-accent" /></div>
            <CardTitle className="text-sm font-medium text-muted-foreground">Weekly Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{weeklyTotal} L</div>
            <p className="text-xs font-medium text-muted-foreground mt-1">{hasData ? `${entries.slice(0, 7).length} entries this period` : "Normal range"}</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full"><TrendingDown className="h-5 w-5 text-primary" /></div>
            <CardTitle className="text-sm font-medium text-muted-foreground">vs Regional Avg</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${diffPct < 0 ? "text-primary" : "text-destructive"}`}>{diffPct > 0 ? "+" : ""}{diffPct}%</div>
            <p className="text-xs font-medium text-muted-foreground mt-1">vs 160 L/day avg</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-primary to-accent text-white shadow-sm border-none">
          <CardHeader className="pb-2 flex flex-row items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full"><CheckCircle2 className="h-5 w-5 text-white" /></div>
            <CardTitle className="text-sm font-medium text-white/90">Est. Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">${monthlySavings}</div>
            <p className="text-xs font-medium text-white/80 mt-1">This month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Usage Trend</CardTitle>
            {!hasData && <p className="text-xs text-muted-foreground">Showing sample data — log entries above to see your real trend</p>}
          </CardHeader>
          <CardContent>
            <div className="h-[250px] md:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickMargin={10} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip wrapperClassName="dark:bg-background dark:text-foreground border border-border rounded-lg shadow-md" />
                  <Area type="monotone" dataKey="usage" stroke="hsl(var(--accent))" strokeWidth={3} fillOpacity={1} fill="url(#colorUsage)" name="Liters" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-sm border-l-4 border-l-accent bg-accent/5">
            <CardHeader className="pb-3"><CardTitle className="text-lg">Water Saving Goal</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-between items-end mb-2">
                <div>
                  <span className="text-3xl font-bold text-accent">{dailyAvg}</span>
                  <span className="text-muted-foreground font-medium ml-1">/ {GOAL} L/day</span>
                </div>
                <span className="text-sm font-bold">{Math.min(goalPct, 100)}%</span>
              </div>
              <Progress value={Math.min(goalPct, 100)} className="h-3 rounded-full [&>div]:bg-accent" />
              {dailyAvg <= GOAL && <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-medium">Goal achieved!</p>}
            </CardContent>
          </Card>

          {/* Recent entries */}
          {hasData && (
            <Card className="shadow-sm">
              <CardHeader><CardTitle className="text-lg">Recent Logs</CardTitle></CardHeader>
              <CardContent className="space-y-2 max-h-60 overflow-y-auto">
                <AnimatePresence>
                  {entries.slice(0, 7).map(e => (
                    <motion.div key={e.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                      className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/30 border border-border/40">
                      <div>
                        <p className="text-sm font-semibold">{parseFloat(e.usageLiters).toFixed(0)} L</p>
                        <p className="text-xs text-muted-foreground">{e.date}</p>
                      </div>
                      <button onClick={() => handleDelete(e.id)} className="p-1.5 rounded hover:bg-destructive/10 hover:text-destructive transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </CardContent>
            </Card>
          )}

          {!hasData && (
            <Card className="shadow-sm">
              <CardHeader><CardTitle className="text-xl">Tips to Save</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {["Fix leaky faucets: Saves up to 20L/day","Shorter showers: 2 mins less = 15L saved","Full loads only: Wait to run laundry/dishes","Collect rainwater for indoor plants","Turn off tap while brushing teeth"].map((tip, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors">
                    <div className="w-6 h-6 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</div>
                    <span className="text-sm font-medium mt-0.5">{tip}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
