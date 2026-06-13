import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Download, Sparkles, Leaf, Droplet, Recycle, TrendingDown, TrendingUp, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from "recharts";

interface DashboardSummary {
  carbonTotal: number;
  carbonEntries: number;
  waterAvg: number;
  waterEntries: number;
  wasteOrganic: number;
  wasteRecyclable: number;
  wasteLandfill: number;
  wasteEntries: number;
  ecoScore: number | null;
  carbonByCategory: Record<string, number>;
  carbonTrend: { week: string; value: number }[];
  waterTrend: { day: string; value: number }[];
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--chart-3))', 'hsl(var(--muted-foreground))'];

function Stat({ icon: Icon, iconBg, iconColor, label, value, sub }: {
  icon: React.ElementType; iconBg: string; iconColor: string;
  label: string; value: string; sub?: string;
}) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-5 flex items-center gap-4">
        <div className={`p-3 ${iconBg} rounded-xl shrink-0`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <div className="text-2xl font-bold">{value}</div>
          {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

export default function ReportsPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    fetch("/api/dashboard/summary")
      .then(r => r.json())
      .then((data: DashboardSummary) => {
        setSummary(data);
        setHasData(
          data.carbonEntries > 0 || data.waterEntries > 0 || data.wasteEntries > 0
        );
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Build pie data from real carbon categories or sample
  const totalWaste = (summary?.wasteOrganic ?? 0) + (summary?.wasteRecyclable ?? 0) + (summary?.wasteLandfill ?? 0);
  const wasteTotal = totalWaste || 1;
  const pieData = hasData
    ? [
        { name: "Transport", value: Math.round(((summary?.carbonByCategory?.transport ?? 0) / Math.max(summary?.carbonTotal ?? 1, 0.001)) * 100) || 0 },
        { name: "Energy", value: Math.round(((summary?.carbonByCategory?.energy ?? 0) / Math.max(summary?.carbonTotal ?? 1, 0.001)) * 100) || 0 },
        { name: "Diet", value: Math.round(((summary?.carbonByCategory?.diet ?? 0) / Math.max(summary?.carbonTotal ?? 1, 0.001)) * 100) || 0 },
        { name: "Shopping", value: Math.round(((summary?.carbonByCategory?.shopping ?? 0) / Math.max(summary?.carbonTotal ?? 1, 0.001)) * 100) || 0 },
      ].filter(d => d.value > 0)
    : [
        { name: "Transport", value: 42 },
        { name: "Energy", value: 28 },
        { name: "Diet", value: 20 },
        { name: "Shopping", value: 10 },
      ];

  const chartData = hasData
    ? (summary?.carbonTrend ?? []).map((d, i) => ({ ...d, label: `W${i + 1}` }))
    : [
        { week: "Week 1", value: 14.2 },
        { week: "Week 2", value: 12.8 },
        { week: "Week 3", value: 11.5 },
        { week: "Week 4", value: 9.8 },
      ];

  const waterChartData = hasData
    ? (summary?.waterTrend ?? [])
    : [{ day: "Mon", value: 110 }, { day: "Tue", value: 95 }, { day: "Wed", value: 130 }, { day: "Thu", value: 85 }, { day: "Fri", value: 120 }, { day: "Sat", value: 145 }, { day: "Sun", value: 100 }];

  const diversion = totalWaste > 0
    ? Math.round(((summary!.wasteOrganic + summary!.wasteRecyclable) / wasteTotal) * 100)
    : 0;

  const carbonDisplay = hasData
    ? `${(summary!.carbonTotal * 1000).toFixed(1)} kg`
    : "—";
  const waterDisplay = hasData
    ? `${summary!.waterAvg.toFixed(0)} L/day avg`
    : "—";
  const diversionDisplay = hasData ? `${diversion}%` : "—";
  const ecoScoreDisplay = summary?.ecoScore != null ? `${summary.ecoScore}/100` : "—";

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Impact Reports</h1>
            <p className="text-sm text-muted-foreground">Detailed analysis of your sustainability footprint</p>
          </div>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Select defaultValue="all">
            <SelectTrigger className="w-[160px] h-10 border-border/60">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2 shrink-0 h-10 border-border/60 font-medium hover:bg-muted/50" onClick={() => window.print()}>
            <Download className="h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      {/* No data banner */}
      {!loading && !hasData && (
        <div className="flex items-start gap-3 p-4 bg-muted/40 border border-border/60 rounded-xl text-sm text-muted-foreground">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground" />
          <p>No tracking data yet. Use the Calculator, Water Tracker, or Waste Analyzer to log entries — your real data will appear here automatically.</p>
        </div>
      )}

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={Leaf} iconBg="bg-emerald-500/10" iconColor="text-emerald-500" label="Carbon Logged" value={carbonDisplay} sub={hasData ? `${summary!.carbonEntries} entries` : "No data yet"} />
        <Stat icon={Droplet} iconBg="bg-accent/10" iconColor="text-accent" label="Water Usage" value={waterDisplay} sub={hasData ? `${summary!.waterEntries} entries` : "No data yet"} />
        <Stat icon={Recycle} iconBg="bg-primary/10" iconColor="text-primary" label="Waste Diverted" value={diversionDisplay} sub={hasData ? `${totalWaste.toFixed(1)} kg total waste` : "No data yet"} />
        <Stat icon={Sparkles} iconBg="bg-yellow-500/10" iconColor="text-yellow-500" label="Eco Score" value={ecoScoreDisplay} sub={summary?.ecoScore != null ? "from Eco Coach" : "Run Eco Coach"} />
      </div>

      {/* AI Insight */}
      <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border-primary/20 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <CardContent className="p-6 relative z-10">
          <div className="flex gap-5">
            <div className="p-3 bg-white dark:bg-black border border-primary/20 rounded-xl shadow-sm h-fit shrink-0">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-lg text-foreground">AI Sustainability Insight</h3>
                {!hasData && <Badge variant="secondary" className="text-xs">Sample</Badge>}
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-4xl">
                {hasData
                  ? `You've logged ${summary!.carbonEntries + summary!.waterEntries + summary!.wasteEntries} sustainability entries. ${summary!.carbonTotal > 0 ? `Your transport and energy emissions are your biggest carbon sources. ` : ""}${diversion > 60 ? "Great waste diversion rate — keep composting and recycling. " : "Improving your recycling habits could significantly reduce your waste impact. "}Keep logging daily to reveal more personalized trends.`
                  : "Your transport emissions decreased by 15% this month compared to last month, largely due to consistent participation in the Bike to Work challenge. Focusing on heating optimization could reduce next month's footprint by an estimated 8%."
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Carbon Trend */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              Carbon Footprint Trend
              {!hasData && <Badge variant="secondary" className="text-xs">Sample</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="carbonGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="week" stroke="#888" fontSize={11} tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis stroke="#888" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)', fontSize: 12 }} />
                  <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#carbonGrad)" name="CO2 (tons)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Emission Sources Pie */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              Emission Sources
              {!hasData && <Badge variant="secondary" className="text-xs">Sample</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[180px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value" stroke="none">
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', fontSize: 12 }} formatter={(v) => [`${v}%`, ""]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 flex-wrap mt-1">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-1.5 text-xs font-medium">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  <span>{entry.name} <span className="text-muted-foreground">({entry.value}%)</span></span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Water trend */}
      {(hasData || true) && (
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center justify-between">
              Water Usage (L/day)
              {!hasData && <Badge variant="secondary" className="text-xs">Sample</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={waterChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="#888" fontSize={11} tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis stroke="#888" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} contentStyle={{ borderRadius: '8px', border: 'none', fontSize: 12 }} />
                  <Bar dataKey="value" fill="hsl(var(--accent))" radius={[5, 5, 0, 0]} name="Water (L)" maxBarSize={48} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metrics Table */}
      <Card className="shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/20 border-b border-border/50 pb-4">
          <CardTitle className="text-lg flex items-center justify-between">
            Metric Summary
            {!hasData && <Badge variant="secondary" className="text-xs">Sample values</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase tracking-wider bg-muted/40">
                <tr>
                  <th className="px-6 py-4 font-semibold">Metric</th>
                  <th className="px-6 py-4 font-semibold">Current</th>
                  <th className="px-6 py-4 font-semibold">Entries Logged</th>
                  <th className="px-6 py-4 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50 hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4 font-semibold text-foreground">Carbon Footprint</td>
                  <td className="px-6 py-4">{carbonDisplay}</td>
                  <td className="px-6 py-4 text-muted-foreground">{hasData ? summary!.carbonEntries : "—"}</td>
                  <td className="px-6 py-4 text-right">
                    {hasData
                      ? <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 font-bold text-xs"><TrendingDown className="h-3 w-3" /> Tracked</span>
                      : <span className="px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground font-medium text-xs">No data</span>
                    }
                  </td>
                </tr>
                <tr className="border-b border-border/50 bg-muted/20 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-semibold text-foreground">Water Usage</td>
                  <td className="px-6 py-4">{waterDisplay}</td>
                  <td className="px-6 py-4 text-muted-foreground">{hasData ? summary!.waterEntries : "—"}</td>
                  <td className="px-6 py-4 text-right">
                    {hasData
                      ? <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 font-bold text-xs"><TrendingDown className="h-3 w-3" /> Tracked</span>
                      : <span className="px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground font-medium text-xs">No data</span>
                    }
                  </td>
                </tr>
                <tr className="border-b border-border/50 hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4 font-semibold text-foreground">Waste Diverted</td>
                  <td className="px-6 py-4">{diversionDisplay}</td>
                  <td className="px-6 py-4 text-muted-foreground">{hasData ? summary!.wasteEntries : "—"}</td>
                  <td className="px-6 py-4 text-right">
                    {hasData
                      ? <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-xs ${diversion >= 60 ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"}`}>
                          {diversion >= 60 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />} {diversion}%
                        </span>
                      : <span className="px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground font-medium text-xs">No data</span>
                    }
                  </td>
                </tr>
                <tr className="hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4 font-semibold text-foreground">Eco Score</td>
                  <td className="px-6 py-4">{ecoScoreDisplay}</td>
                  <td className="px-6 py-4 text-muted-foreground">—</td>
                  <td className="px-6 py-4 text-right">
                    {summary?.ecoScore != null
                      ? <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold text-xs"><Sparkles className="h-3 w-3" /> Scored</span>
                      : <span className="px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground font-medium text-xs">Run Eco Coach</span>
                    }
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
