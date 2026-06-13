import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Sparkles, Car, Zap, Droplet, Utensils, Leaf,
  TrendingDown, TrendingUp, ArrowRight, RotateCcw,
  BrainCircuit, CheckCircle2, AlertTriangle, Info,
  Bike, Train, Plane
} from "lucide-react";
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from "recharts";

type DietType = "vegan" | "vegetarian" | "pescatarian" | "omnivore" | "meat-heavy";
type TravelMode = "walk-cycle" | "transit" | "car" | "flight";

interface FormData {
  travelDistance: number;
  travelMode: TravelMode;
  electricityUsage: number;
  renewableEnergy: boolean;
  waterUsage: number;
  dietType: DietType;
  localFood: boolean;
}

interface CategoryScore {
  label: string;
  score: number;
  max: number;
  color: string;
  icon: React.ElementType;
}

interface Suggestion {
  severity: "high" | "medium" | "low";
  category: string;
  icon: React.ElementType;
  title: string;
  description: string;
  impact: string;
}

const DIET_OPTIONS: { value: DietType; label: string; desc: string }[] = [
  { value: "vegan", label: "Vegan", desc: "Plant-based only" },
  { value: "vegetarian", label: "Vegetarian", desc: "No meat or fish" },
  { value: "pescatarian", label: "Pescatarian", desc: "Fish, no meat" },
  { value: "omnivore", label: "Omnivore", desc: "Mixed diet" },
  { value: "meat-heavy", label: "Meat-heavy", desc: "Daily red meat" },
];

const TRAVEL_OPTIONS: { value: TravelMode; label: string; icon: React.ElementType }[] = [
  { value: "walk-cycle", label: "Walk / Cycle", icon: Bike },
  { value: "transit", label: "Public Transit", icon: Train },
  { value: "car", label: "Car / Motorbike", icon: Car },
  { value: "flight", label: "Frequent Flights", icon: Plane },
];

function calcScore(data: FormData): { total: number; categories: CategoryScore[] } {
  const travelBase: Record<TravelMode, number> = {
    "walk-cycle": 30,
    "transit": 24,
    "car": 18,
    "flight": 8,
  };
  const distancePenalty = data.travelMode === "walk-cycle" ? 0
    : data.travelMode === "transit" ? data.travelDistance * 0.04
    : data.travelMode === "car" ? data.travelDistance * 0.12
    : data.travelDistance * 0.18;
  const travelScore = Math.max(0, Math.min(30, travelBase[data.travelMode] - distancePenalty));

  const elecRaw = Math.max(0, 25 - (data.electricityUsage / 1000) * 25);
  const electricityScore = Math.min(25, elecRaw + (data.renewableEnergy ? 6 : 0));

  const waterScore = Math.max(0, Math.min(20, 20 - (data.waterUsage / 500) * 20));

  const dietBase: Record<DietType, number> = {
    vegan: 25,
    vegetarian: 21,
    pescatarian: 17,
    omnivore: 11,
    "meat-heavy": 4,
  };
  const dietScore = Math.min(25, dietBase[data.dietType] + (data.localFood ? 3 : 0));

  const total = Math.round(travelScore + electricityScore + waterScore + dietScore);

  return {
    total,
    categories: [
      { label: "Travel", score: Math.round(travelScore), max: 30, color: "hsl(var(--accent))", icon: Car },
      { label: "Energy", score: Math.round(electricityScore), max: 25, color: "hsl(var(--primary))", icon: Zap },
      { label: "Water", score: Math.round(waterScore), max: 20, color: "#38bdf8", icon: Droplet },
      { label: "Diet", score: Math.round(dietScore), max: 25, color: "#a3e635", icon: Utensils },
    ],
  };
}

function buildSuggestions(data: FormData, categories: CategoryScore[]): Suggestion[] {
  const suggestions: Suggestion[] = [];

  if (data.travelMode === "car" && data.travelDistance > 30) {
    suggestions.push({
      severity: "high",
      category: "Travel",
      icon: Train,
      title: "Switch to public transit or carpool",
      description: "Driving long distances daily is your biggest carbon source. Public transit or carpooling cuts transport emissions by up to 70%.",
      impact: "Saves ~2.4 tons CO2/year",
    });
  } else if (data.travelMode === "flight") {
    suggestions.push({
      severity: "high",
      category: "Travel",
      icon: Train,
      title: "Reduce air travel where possible",
      description: "Flights have an outsized carbon footprint. Replacing one long-haul flight with train travel can eliminate 90% of that journey's emissions.",
      impact: "Saves ~1.5–3 tons CO2/flight",
    });
  } else if (data.travelMode === "car" && data.travelDistance <= 30) {
    suggestions.push({
      severity: "medium",
      category: "Travel",
      icon: Bike,
      title: "Try cycling for short trips",
      description: "Your commute is short enough to cycle. Replacing car trips under 5km with a bike is one of the fastest personal impact changes.",
      impact: "Saves ~0.6 tons CO2/year",
    });
  }

  if (data.electricityUsage > 600) {
    suggestions.push({
      severity: "high",
      category: "Energy",
      icon: Zap,
      title: "Audit your home energy use",
      description: "Your electricity usage is significantly above average. Smart thermostats, LED bulbs, and appliance upgrades can cut consumption by up to 35%.",
      impact: "Saves ~150–300 kg CO2/month",
    });
  } else if (data.electricityUsage > 300 && !data.renewableEnergy) {
    suggestions.push({
      severity: "medium",
      category: "Energy",
      icon: Zap,
      title: "Switch to a green energy tariff",
      description: "Switching to 100% renewable electricity is the single highest-impact home energy change with no lifestyle adjustment required.",
      impact: "Eliminates ~1.2 tons CO2/year",
    });
  } else if (!data.renewableEnergy) {
    suggestions.push({
      severity: "low",
      category: "Energy",
      icon: Zap,
      title: "Explore renewable energy options",
      description: "Your energy use is already modest. Adding a green tariff or rooftop solar would make your home energy nearly carbon-neutral.",
      impact: "Saves ~0.4 tons CO2/year",
    });
  }

  if (data.waterUsage > 250) {
    suggestions.push({
      severity: "high",
      category: "Water",
      icon: Droplet,
      title: "Reduce shower time and fix leaks",
      description: "Your water usage is well above average. A 4-minute shower uses only 36L vs 72L for 8 minutes. Fixing a dripping tap saves 15L/day.",
      impact: "Saves ~40,000 L/year",
    });
  } else if (data.waterUsage > 150) {
    suggestions.push({
      severity: "medium",
      category: "Water",
      icon: Droplet,
      title: "Install water-saving fixtures",
      description: "Low-flow showerheads and tap aerators can cut water use by 30–50% with no change in comfort. Payback period is under 3 months.",
      impact: "Saves ~15,000 L/year",
    });
  }

  if (data.dietType === "meat-heavy") {
    suggestions.push({
      severity: "high",
      category: "Diet",
      icon: Leaf,
      title: "Adopt Meatless Monday",
      description: "Red meat production generates 20x more greenhouse gas than plant protein. Even cutting meat to 3 days a week reduces food footprint by 40%.",
      impact: "Saves ~0.9 tons CO2/year",
    });
  } else if (data.dietType === "omnivore") {
    suggestions.push({
      severity: "medium",
      category: "Diet",
      icon: Leaf,
      title: "Replace two meat meals per week",
      description: "Swapping beef for lentils or tofu twice a week is a small habit with a large footprint impact. Try plant-based versions of your favourite dishes.",
      impact: "Saves ~0.5 tons CO2/year",
    });
  }

  if (!data.localFood && (data.dietType === "omnivore" || data.dietType === "pescatarian")) {
    suggestions.push({
      severity: "low",
      category: "Diet",
      icon: Utensils,
      title: "Buy local and seasonal produce",
      description: "Out-of-season produce can travel thousands of miles. Shopping at farmers markets or choosing seasonal options cuts food transport emissions significantly.",
      impact: "Saves ~0.2 tons CO2/year",
    });
  }

  return suggestions.sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.severity] - order[b.severity];
  });
}

function getScoreLabel(score: number): { label: string; color: string; description: string } {
  if (score >= 80) return { label: "Excellent", color: "text-emerald-500", description: "You're in the top 10% of EcoSphere users. Keep it up!" };
  if (score >= 60) return { label: "Good", color: "text-primary", description: "Above average! A few targeted changes could push you into the top tier." };
  if (score >= 40) return { label: "Average", color: "text-yellow-500", description: "You're right at the global average. The suggestions below show your biggest opportunities." };
  if (score >= 20) return { label: "Needs Work", color: "text-orange-500", description: "There's significant room to improve. Focus on your highest-impact areas first." };
  return { label: "Critical", color: "text-destructive", description: "Your current habits have a high environmental impact. Small changes will make a big difference." };
}

const severityConfig = {
  high: { label: "High Impact", color: "text-destructive", bg: "bg-destructive/10 border-destructive/20", icon: AlertTriangle },
  medium: { label: "Medium Impact", color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20", icon: TrendingDown },
  low: { label: "Quick Win", color: "text-primary", bg: "bg-primary/10 border-primary/20", icon: Info },
};

export default function EcoCoachPage() {
  const [form, setForm] = useState<FormData>({
    travelDistance: 20,
    travelMode: "car",
    electricityUsage: 400,
    renewableEnergy: false,
    waterUsage: 150,
    dietType: "omnivore",
    localFood: false,
  });

  const [result, setResult] = useState<{ total: number; categories: CategoryScore[] } | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [savedScore, setSavedScore] = useState(false);
  const [savingScore, setSavingScore] = useState(false);

  const handleSaveScore = async () => {
    if (!result) return;
    setSavingScore(true);
    try {
      const cats = result.categories;
      const travel = cats.find(c => c.label === "Travel")?.score ?? 0;
      const energy = cats.find(c => c.label === "Energy")?.score ?? 0;
      const water = cats.find(c => c.label === "Water")?.score ?? 0;
      const diet = cats.find(c => c.label === "Diet")?.score ?? 0;
      await fetch("/api/eco-scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ecoScore: result.total, travelScore: travel, energyScore: energy, waterScore: water, dietScore: diet }),
      });
      setSavedScore(true);
    } catch { /* ignore */ } finally { setSavingScore(false); }
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setSavedScore(false);
    setResult(null);
    setTimeout(() => {
      const r = calcScore(form);
      setSuggestions(buildSuggestions(form, r.categories));
      setResult(r);
      setIsAnalyzing(false);
    }, 900);
  };

  const handleReset = () => {
    setResult(null);
    setSuggestions([]);
    setForm({
      travelDistance: 20,
      travelMode: "car",
      electricityUsage: 400,
      renewableEnergy: false,
      waterUsage: 150,
      dietType: "omnivore",
      localFood: false,
    });
  };

  const scoreInfo = result ? getScoreLabel(result.total) : null;

  const gaugeData = result ? [{ value: result.total, fill: "url(#ecoGradient)" }] : [];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10">
              <BrainCircuit className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">AI Eco Coach</h1>
          </div>
          <p className="text-muted-foreground max-w-xl">
            Tell us about your daily habits. We'll calculate your personal Eco Score and generate a custom action plan.
          </p>
        </div>
        {result && (
          <Button variant="outline" size="sm" onClick={handleReset} className="shrink-0 gap-2">
            <RotateCcw className="h-4 w-4" /> Reset
          </Button>
        )}
      </div>

      <div className="grid lg:grid-cols-5 gap-8 items-start">
        {/* ── INPUT PANEL ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Travel */}
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <div className="p-1.5 rounded-lg bg-accent/10"><Car className="h-4 w-4 text-accent" /></div>
                Daily Travel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">
                  Primary travel mode
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {TRAVEL_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const active = form.travelMode === opt.value;
                    return (
                      <button
                        key={opt.value}
                        data-testid={`travel-mode-${opt.value}`}
                        onClick={() => setForm(f => ({ ...f, travelMode: opt.value }))}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all duration-150 ${
                          active
                            ? "bg-accent/10 border-accent/40 text-accent"
                            : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground hover:bg-muted/40"
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-3">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Daily distance
                  </Label>
                  <span className="text-sm font-bold tabular-nums">{form.travelDistance} km</span>
                </div>
                <Slider
                  data-testid="slider-travel-distance"
                  value={[form.travelDistance]}
                  onValueChange={([v]) => setForm(f => ({ ...f, travelDistance: v }))}
                  min={0} max={200} step={5}
                  className="[&>[data-orientation=horizontal]]:bg-accent/20 [&_[role=slider]]:border-accent"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
                  <span>0 km</span><span>200 km</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Energy */}
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <div className="p-1.5 rounded-lg bg-yellow-500/10"><Zap className="h-4 w-4 text-yellow-500" /></div>
                Home Energy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Monthly electricity
                  </Label>
                  <span className="text-sm font-bold tabular-nums">{form.electricityUsage} kWh</span>
                </div>
                <Slider
                  data-testid="slider-electricity"
                  value={[form.electricityUsage]}
                  onValueChange={([v]) => setForm(f => ({ ...f, electricityUsage: v }))}
                  min={0} max={1000} step={10}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
                  <span>0 kWh</span><span>1,000 kWh</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/60">
                <div>
                  <p className="text-sm font-medium">Renewable energy</p>
                  <p className="text-xs text-muted-foreground">Green tariff or solar panels</p>
                </div>
                <Switch
                  data-testid="switch-renewable"
                  checked={form.renewableEnergy}
                  onCheckedChange={(v) => setForm(f => ({ ...f, renewableEnergy: v }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Water */}
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <div className="p-1.5 rounded-lg bg-sky-500/10"><Droplet className="h-4 w-4 text-sky-500" /></div>
                Water Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-3">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Daily usage
                </Label>
                <span className="text-sm font-bold tabular-nums">{form.waterUsage} L</span>
              </div>
              <Slider
                data-testid="slider-water"
                value={[form.waterUsage]}
                onValueChange={([v]) => setForm(f => ({ ...f, waterUsage: v }))}
                min={0} max={500} step={10}
                className="[&>[data-orientation=horizontal]]:bg-sky-500/20 [&_[role=slider]]:border-sky-400"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
                <span>0 L</span>
                <span className="text-sky-600 dark:text-sky-400 font-medium">Avg 150 L</span>
                <span>500 L</span>
              </div>
            </CardContent>
          </Card>

          {/* Diet */}
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <div className="p-1.5 rounded-lg bg-lime-500/10"><Utensils className="h-4 w-4 text-lime-600 dark:text-lime-400" /></div>
                Food Habits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">
                  Diet type
                </Label>
                <div className="space-y-2">
                  {DIET_OPTIONS.map((opt) => {
                    const active = form.dietType === opt.value;
                    return (
                      <button
                        key={opt.value}
                        data-testid={`diet-${opt.value}`}
                        onClick={() => setForm(f => ({ ...f, dietType: opt.value }))}
                        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm transition-all duration-150 ${
                          active
                            ? "bg-primary/10 border-primary/40 text-primary font-semibold"
                            : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground hover:bg-muted/40"
                        }`}
                      >
                        <span>{opt.label}</span>
                        <span className="text-xs opacity-70">{opt.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/60">
                <div>
                  <p className="text-sm font-medium">Local &amp; seasonal food</p>
                  <p className="text-xs text-muted-foreground">Farmers market or seasonal choices</p>
                </div>
                <Switch
                  data-testid="switch-local-food"
                  checked={form.localFood}
                  onCheckedChange={(v) => setForm(f => ({ ...f, localFood: v }))}
                />
              </div>
            </CardContent>
          </Card>

          <Button
            data-testid="button-analyze"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-accent text-white border-none shadow-md hover:opacity-90 transition-opacity gap-2"
          >
            {isAnalyzing ? (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                  <Sparkles className="h-5 w-5" />
                </motion.div>
                Analyzing your habits...
              </>
            ) : (
              <>
                <BrainCircuit className="h-5 w-5" />
                {result ? "Recalculate Eco Score" : "Analyze My Impact"}
              </>
            )}
          </Button>
        </div>

        {/* ── RESULTS PANEL ── */}
        <div className="lg:col-span-3 space-y-5">
          <AnimatePresence mode="wait">
            {!result && !isAnalyzing && (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card className="border-dashed border-border/60 bg-muted/20">
                  <CardContent className="flex flex-col items-center justify-center min-h-[480px] text-center gap-6">
                    <div className="p-5 rounded-full bg-primary/10">
                      <BrainCircuit className="h-12 w-12 text-primary/60" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Your Eco Score Awaits</h3>
                      <p className="text-muted-foreground max-w-sm mx-auto text-sm leading-relaxed">
                        Fill in your daily habits on the left, then click <strong>Analyze My Impact</strong> to get your personalized sustainability score and action plan.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 w-full max-w-xs text-left">
                      {[
                        { icon: Car, label: "Travel impact" },
                        { icon: Zap, label: "Energy footprint" },
                        { icon: Droplet, label: "Water efficiency" },
                        { icon: Utensils, label: "Diet analysis" },
                      ].map(({ icon: Icon, label }) => (
                        <div key={label} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Icon className="h-4 w-4 text-primary/50" />
                          {label}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {isAnalyzing && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Card className="border-border/60">
                  <CardContent className="flex flex-col items-center justify-center min-h-[480px] gap-6">
                    <motion.div
                      animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="p-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/10"
                    >
                      <BrainCircuit className="h-14 w-14 text-primary" />
                    </motion.div>
                    <div className="text-center">
                      <p className="text-lg font-semibold mb-1">Calculating your footprint...</p>
                      <p className="text-sm text-muted-foreground">Analyzing 4 categories against global benchmarks</p>
                    </div>
                    <div className="flex gap-2">
                      {["Travel", "Energy", "Water", "Diet"].map((label, i) => (
                        <motion.div
                          key={label}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.2 }}
                          className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-full border border-border/60"
                        >
                          <CheckCircle2 className="h-3 w-3 text-primary" />
                          {label}
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {result && scoreInfo && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-5"
              >
                {/* Score Card */}
                <Card className="border-border/60 overflow-hidden">
                  <div className="h-1.5 bg-gradient-to-r from-primary to-accent w-full" />
                  <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      {/* Radial Gauge */}
                      <div className="relative w-48 h-48 shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadialBarChart
                            cx="50%" cy="50%"
                            innerRadius="70%" outerRadius="90%"
                            startAngle={220} endAngle={-40}
                            barSize={14}
                            data={gaugeData}
                          >
                            <defs>
                              <linearGradient id="ecoGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="hsl(var(--primary))" />
                                <stop offset="100%" stopColor="hsl(var(--accent))" />
                              </linearGradient>
                            </defs>
                            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                            <RadialBar
                              dataKey="value"
                              cornerRadius={8}
                              background={{ fill: "hsl(var(--muted))" }}
                            />
                          </RadialBarChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <motion.span
                            className="text-4xl font-black tabular-nums"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                          >
                            {result.total}
                          </motion.span>
                          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">/ 100</span>
                        </div>
                      </div>

                      <div className="flex-1 text-center sm:text-left">
                        <Badge className={`mb-3 text-sm px-3 py-1 ${scoreInfo.color} bg-transparent border border-current`}>
                          {scoreInfo.label}
                        </Badge>
                        <h2 className="text-2xl font-bold mb-2">Your Eco Score</h2>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4">{scoreInfo.description}</p>

                        {/* Category breakdown */}
                        <div className="space-y-3">
                          {result.categories.map((cat) => {
                            const pct = Math.round((cat.score / cat.max) * 100);
                            const Icon = cat.icon;
                            return (
                              <div key={cat.label}>
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center gap-1.5 text-sm">
                                    <Icon className="h-3.5 w-3.5" style={{ color: cat.color }} />
                                    <span className="font-medium">{cat.label}</span>
                                  </div>
                                  <span className="text-xs tabular-nums text-muted-foreground font-semibold">
                                    {cat.score}/{cat.max}
                                  </span>
                                </div>
                                <div className="h-2 rounded-full bg-muted overflow-hidden">
                                  <motion.div
                                    className="h-full rounded-full"
                                    style={{ backgroundColor: cat.color }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${pct}%` }}
                                    transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Suggestions */}
                {suggestions.length > 0 && (
                  <Card className="border-border/60">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Sparkles className="h-4 w-4 text-primary" />
                        Your Personalized Action Plan
                      </CardTitle>
                      <CardDescription>
                        {suggestions.length} recommendation{suggestions.length > 1 ? "s" : ""} based on your highest-impact areas
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {suggestions.map((s, i) => {
                        const cfg = severityConfig[s.severity];
                        const SeverityIcon = cfg.icon;
                        const SuggIcon = s.icon;
                        return (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className={`p-4 rounded-xl border ${cfg.bg}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="p-2 rounded-lg bg-background/80 shrink-0 mt-0.5">
                                <SuggIcon className="h-4 w-4 text-foreground" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                  <span className="text-sm font-semibold">{s.title}</span>
                                  <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${cfg.color} border-current`}>
                                    <SeverityIcon className="h-2.5 w-2.5 mr-1" />
                                    {cfg.label}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed mb-2">{s.description}</p>
                                <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                                  <TrendingDown className="h-3 w-3" />
                                  {s.impact}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </CardContent>
                  </Card>
                )}

                {/* Global comparison */}
                <Card className="border-border/60 bg-gradient-to-br from-primary/5 to-accent/5">
                  <CardContent className="pt-5 pb-5">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="flex-1">
                        <p className="text-sm font-semibold mb-1 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-primary" /> How you compare globally
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          The global average Eco Score is <strong>41/100</strong>. You scored{" "}
                          <strong className={result.total >= 41 ? "text-primary" : "text-destructive"}>
                            {result.total >= 41 ? `${result.total - 41} points above` : `${41 - result.total} points below`}
                          </strong>{" "}
                          the average.
                        </p>
                      </div>
                      <div className="shrink-0 w-full sm:w-48 space-y-2">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium">You</span>
                            <span className="tabular-nums font-bold">{result.total}</span>
                          </div>
                          <Progress value={result.total} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1 text-muted-foreground">
                            <span>Global avg</span>
                            <span className="tabular-nums">41</span>
                          </div>
                          <Progress value={41} className="h-2 [&>div]:bg-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {savedScore ? (
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold text-sm p-3 bg-green-500/10 rounded-xl border border-green-500/20 w-full">
                    <CheckCircle2 className="h-5 w-5 shrink-0" /> Score saved to Dashboard!
                  </div>
                ) : (
                  <Button
                    onClick={handleSaveScore}
                    disabled={savingScore}
                    className="w-full gap-2 h-11 bg-gradient-to-r from-primary to-accent text-white border-none shadow-md hover:opacity-90"
                  >
                    <Sparkles className="h-4 w-4" />
                    {savingScore ? "Saving…" : "Save Score to Dashboard"}
                  </Button>
                )}

                <Button
                  data-testid="button-recalculate"
                  onClick={handleAnalyze}
                  variant="outline"
                  className="w-full gap-2 h-11"
                >
                  <RotateCcw className="h-4 w-4" />
                  Recalculate with new inputs
                  <ArrowRight className="h-4 w-4 ml-auto" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
