import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sampleData } from "@/data/sampleData";
import { Activity, Droplet, Leaf, Zap, Bot, TrendingDown, TrendingUp, PlusCircle } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface DashboardSummary {
  hasData: boolean;
  ecoScore: number | null;
  carbonTotal: number | null;
  carbonTrend: number;
  waterAvg: number | null;
  waterTrend: number;
  wasteDiversionRate: number | null;
  wasteTotalKg: number | null;
  carbonChartData: { week: string; value: number; average: number }[];
  waterChartData: { day: string; usage: number }[];
}

function StatSkeleton() {
  return <div className="h-8 w-24 bg-muted animate-pulse rounded-md" />;
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/summary")
      .then((r) => r.json())
      .then((data) => { setSummary(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const ecoScore = summary?.ecoScore ?? null;
  const carbonTotal = summary?.carbonTotal ?? null;
  const waterAvg = summary?.waterAvg ?? null;
  const chartData = summary?.carbonChartData.length
    ? summary.carbonChartData
    : sampleData.carbonData;
  const waterChartData = summary?.waterChartData.length
    ? summary.waterChartData.map(d => ({ day: d.day, usage: d.usage }))
    : sampleData.waterData;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Good morning, Alex</h1>
        <p className="text-muted-foreground">Here's your sustainability overview for today.</p>
      </div>

      {/* No data banner */}
      {!loading && !summary?.hasData && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <div className="p-2 bg-primary/10 rounded-lg shrink-0">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">No tracking data yet — showing sample values</p>
            <p className="text-xs text-muted-foreground mt-0.5">Log your first entry in the Calculator, Water Tracker, or Waste Analyzer to see real data.</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button size="sm" variant="outline" asChild className="gap-1 border-primary/30 text-primary">
              <Link href="/calculator"><PlusCircle className="h-3.5 w-3.5" /> Carbon</Link>
            </Button>
            <Button size="sm" variant="outline" asChild className="gap-1 border-primary/30 text-primary">
              <Link href="/water-tracker"><PlusCircle className="h-3.5 w-3.5" /> Water</Link>
            </Button>
            <Button size="sm" variant="outline" asChild className="gap-1 border-primary/30 text-primary">
              <Link href="/eco-coach"><PlusCircle className="h-3.5 w-3.5" /> Eco Score</Link>
            </Button>
          </div>
        </motion.div>
      )}

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sustainability Score</CardTitle>
            <div className="p-2 rounded-lg bg-primary/10"><Activity className="h-5 w-5 text-primary" /></div>
          </CardHeader>
          <CardContent>
            {loading ? <StatSkeleton /> : (
              <div className="text-3xl font-bold">
                {ecoScore != null ? ecoScore : sampleData.user.score}
                <span className="text-xl text-muted-foreground font-medium">/100</span>
              </div>
            )}
            <p className="text-sm font-medium text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              {ecoScore != null ? "From your Eco Coach session" : "+2% from last week"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Carbon Footprint</CardTitle>
            <div className="p-2 rounded-lg bg-emerald-500/10"><Leaf className="h-5 w-5 text-emerald-500" /></div>
          </CardHeader>
          <CardContent>
            {loading ? <StatSkeleton /> : (
              <div className="text-3xl font-bold">
                {carbonTotal != null ? `${carbonTotal.toFixed(1)} t` : "9.8 kg"}
              </div>
            )}
            <p className={`text-sm font-medium mt-2 flex items-center gap-1 ${summary?.carbonTrend && summary.carbonTrend < 0 ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>
              {summary?.carbonTrend && summary.carbonTrend < 0
                ? <><TrendingDown className="h-4 w-4" /> {summary.carbonTrend.toFixed(1)} t from last entry</>
                : <><TrendingDown className="h-4 w-4" /> CO2/year</>}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Water Usage</CardTitle>
            <div className="p-2 rounded-lg bg-accent/10"><Droplet className="h-5 w-5 text-accent" /></div>
          </CardHeader>
          <CardContent>
            {loading ? <StatSkeleton /> : (
              <div className="text-3xl font-bold">
                {waterAvg != null ? `${waterAvg} L` : "120 L"}
              </div>
            )}
            <p className={`text-sm font-medium mt-2 flex items-center gap-1 ${(summary?.waterTrend ?? 1) <= 0 ? "text-green-600 dark:text-green-400" : "text-yellow-600 dark:text-yellow-400"}`}>
              {summary?.waterTrend != null
                ? summary.waterTrend <= 0
                  ? <><TrendingDown className="h-4 w-4" /> {Math.abs(summary.waterTrend)} L below goal</>
                  : <><TrendingUp className="h-4 w-4" /> {summary.waterTrend} L above 120 L goal</>
                : <><TrendingDown className="h-4 w-4" /> -15 L from average</>}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Waste Diversion</CardTitle>
            <div className="p-2 rounded-lg bg-yellow-500/10"><Zap className="h-5 w-5 text-yellow-500" /></div>
          </CardHeader>
          <CardContent>
            {loading ? <StatSkeleton /> : (
              <div className="text-3xl font-bold">
                {summary?.wasteDiversionRate != null ? `${summary.wasteDiversionRate}%` : "35%"}
              </div>
            )}
            <p className="text-sm font-medium text-muted-foreground mt-2">
              {summary?.wasteTotalKg != null ? `${summary.wasteTotalKg} kg total waste logged` : "Recycled & composted"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI Insight */}
      <div className="bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 rounded-xl p-4 flex items-start sm:items-center gap-4 shadow-sm">
        <div className="p-2 bg-primary/10 rounded-lg shrink-0">
          <Bot className="h-6 w-6 text-primary" />
        </div>
        <p className="text-sm md:text-base font-medium">
          <span className="font-bold text-primary mr-2">AI Insight</span>
          {ecoScore != null
            ? ecoScore >= 60
              ? `Your Eco Score of ${ecoScore}/100 is above average. Keep logging to track your progress over time.`
              : `Your Eco Score of ${ecoScore}/100 has room to grow. Visit the Eco Coach for personalised tips.`
            : "Your footprint is 23% below the national average this week. Transport emissions improved most."}
        </p>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Carbon Footprint Trend</CardTitle>
            <p className="text-sm text-muted-foreground">
              {summary?.carbonChartData.length ? "Your logged entries (tons CO2/year)" : "Sample data — log entries in the Calculator"}
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] md:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="week" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip wrapperClassName="dark:bg-background dark:text-foreground border border-border rounded-lg shadow-md" />
                  <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={3} fill="hsl(var(--primary))" fillOpacity={0.15} name="Your CO2" />
                  <Area type="monotone" dataKey="average" stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" fill="none" name="Global avg" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Water Usage (L/day)</CardTitle>
            <p className="text-sm text-muted-foreground">
              {summary?.waterChartData.length ? "Your logged entries" : "Sample data — log entries in Water Tracker"}
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] md:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={waterChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip wrapperClassName="dark:bg-background dark:text-foreground border border-border rounded-lg shadow-md" />
                  <Area type="monotone" dataKey="usage" stroke="hsl(var(--accent))" strokeWidth={3} fill="hsl(var(--accent))" fillOpacity={0.15} name="Liters" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
