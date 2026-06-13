import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Calculator, ArrowRight, Car, Home, ShoppingBag, Utensils, Save, CheckCircle2, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

type Diet = "vegan" | "vegetarian" | "pescatarian" | "omnivore" | "meat-heavy";
type Recycling = "rarely" | "sometimes" | "always";

const steps = [
  { id: "transport", title: "Transport", icon: Car },
  { id: "energy", title: "Home Energy", icon: Home },
  { id: "diet", title: "Diet", icon: Utensils },
  { id: "shopping", title: "Shopping", icon: ShoppingBag },
];

const DIET_CO2: Record<Diet, number> = { vegan: 1.5, vegetarian: 2.5, pescatarian: 3.0, omnivore: 3.3, "meat-heavy": 4.5 };
const RECYCLE_FACTOR: Record<Recycling, number> = { rarely: 1.2, sometimes: 1.0, always: 0.8 };

function calcCO2(inputs: {
  milesDriven: number; transitHours: number; flights: number;
  electricityBill: number; isRenewable: boolean;
  dietType: Diet; meatMeals: number;
  clothingItems: number; recyclingHabit: Recycling;
}) {
  const transport = inputs.milesDriven * 52 * 0.000404 + inputs.transitHours * 52 * 0.005 + inputs.flights * 0.9;
  const energy = inputs.electricityBill * 12 * 0.005 * (inputs.isRenewable ? 0.1 : 1);
  const diet = DIET_CO2[inputs.dietType] + inputs.meatMeals * 0.05;
  const shopping = inputs.clothingItems * 12 * 0.02 * RECYCLE_FACTOR[inputs.recyclingHabit];
  return {
    transport: Math.round(transport * 100) / 100,
    energy: Math.round(energy * 100) / 100,
    diet: Math.round(diet * 100) / 100,
    shopping: Math.round(shopping * 100) / 100,
    total: Math.round((transport + energy + diet + shopping) * 100) / 100,
  };
}

export default function CalculatorPage() {
  const [step, setStep] = useState(0);
  const [calculated, setCalculated] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const [milesDriven, setMilesDriven] = useState(50);
  const [transitHours, setTransitHours] = useState(2);
  const [flights, setFlights] = useState(1);
  const [electricityBill, setElectricityBill] = useState(100);
  const [isRenewable, setIsRenewable] = useState(false);
  const [dietType, setDietType] = useState<Diet>("omnivore");
  const [meatMeals, setMeatMeals] = useState(10);
  const [clothingItems, setClothingItems] = useState(2);
  const [recyclingHabit, setRecyclingHabit] = useState<Recycling>("sometimes");

  const inputs = { milesDriven, transitHours, flights, electricityBill, isRenewable, dietType, meatMeals, clothingItems, recyclingHabit };
  const result = calcCO2(inputs);

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else setCalculated(true);
  };

  const handleReset = () => { setStep(0); setCalculated(false); setSaved(false); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      await fetch("/api/carbon/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: today,
          transportCo2: result.transport,
          energyCo2: result.energy,
          dietCo2: result.diet,
          shoppingCo2: result.shopping,
          totalCo2: result.total,
        }),
      });
      setSaved(true);
    } catch {
      // silently handle
    } finally {
      setSaving(false);
    }
  };

  const CurrentIcon = steps[step].icon;
  const liveEstimate = calcCO2(inputs).total;
  const nationalAvg = 16.0;
  const globalTarget = 2.0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-2 mb-8">
        <div className="p-2 bg-primary/10 rounded-xl"><Calculator className="h-6 w-6 text-primary" /></div>
        <h1 className="text-3xl font-bold tracking-tight">Footprint Calculator</h1>
      </div>

      <AnimatePresence mode="wait">
        {!calculated ? (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="mb-8">
                <div className="flex justify-between text-sm mb-2 text-muted-foreground">
                  <span>Step {step + 1} of {steps.length}</span>
                  <span className="font-medium">{steps[step].title}</span>
                </div>
                <Progress value={((step + 1) / steps.length) * 100} className="h-2" />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CurrentIcon className="h-5 w-5 text-primary" />
                    {steps[step].title}
                  </CardTitle>
                  <CardDescription>Tell us about your habits in this category.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 min-h-[300px]">
                  {step === 0 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                      <div className="space-y-3">
                        <div className="flex justify-between"><Label>Miles driven per week</Label><span className="text-sm font-bold tabular-nums">{milesDriven} mi</span></div>
                        <Slider value={[milesDriven]} onValueChange={([v]) => setMilesDriven(v)} max={500} step={10} />
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between"><Label>Public transit hours/week</Label><span className="text-sm font-bold tabular-nums">{transitHours} hrs</span></div>
                        <Slider value={[transitHours]} onValueChange={([v]) => setTransitHours(v)} max={40} step={1} />
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between"><Label>Flights per year</Label><span className="text-sm font-bold tabular-nums">{flights}</span></div>
                        <Slider value={[flights]} onValueChange={([v]) => setFlights(v)} max={20} step={1} />
                      </div>
                    </motion.div>
                  )}
                  {step === 1 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                      <div className="space-y-3">
                        <div className="flex justify-between"><Label>Monthly electricity bill ($)</Label><span className="text-sm font-bold tabular-nums">${electricityBill}</span></div>
                        <Slider value={[electricityBill]} onValueChange={([v]) => setElectricityBill(v)} max={500} step={10} />
                      </div>
                      <div className="space-y-2">
                        <Label>Use renewable energy?</Label>
                        <div className="flex gap-2">
                          <Button variant={isRenewable ? "default" : "outline"} className="flex-1" onClick={() => setIsRenewable(true)}>Yes</Button>
                          <Button variant={!isRenewable ? "default" : "outline"} className="flex-1" onClick={() => setIsRenewable(false)}>No</Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  {step === 2 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                      <div className="space-y-2">
                        <Label>Diet type</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {(["vegan","vegetarian","pescatarian","omnivore","meat-heavy"] as Diet[]).map(d => (
                            <Button key={d} variant={dietType === d ? "default" : "outline"} className="capitalize" onClick={() => setDietType(d)}>{d}</Button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between"><Label>Meat meals per week</Label><span className="text-sm font-bold tabular-nums">{meatMeals}</span></div>
                        <Slider value={[meatMeals]} onValueChange={([v]) => setMeatMeals(v)} max={21} step={1} />
                      </div>
                    </motion.div>
                  )}
                  {step === 3 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                      <div className="space-y-3">
                        <div className="flex justify-between"><Label>New clothing items/month</Label><span className="text-sm font-bold tabular-nums">{clothingItems}</span></div>
                        <Slider value={[clothingItems]} onValueChange={([v]) => setClothingItems(v)} max={20} step={1} />
                      </div>
                      <div className="space-y-2">
                        <Label>Recycling habit</Label>
                        <div className="grid grid-cols-3 gap-2">
                          {(["rarely","sometimes","always"] as Recycling[]).map(r => (
                            <Button key={r} variant={recyclingHabit === r ? "default" : "outline"} className="capitalize" onClick={() => setRecyclingHabit(r)}>{r}</Button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div className="pt-4 flex justify-between items-center">
                    {step > 0 && <Button variant="outline" onClick={() => setStep(s => s - 1)}>Back</Button>}
                    <div className="ml-auto">
                      <Button onClick={handleNext} className="gap-2 bg-primary text-primary-foreground">
                        {step === steps.length - 1 ? "Calculate" : "Next"} <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Live estimate */}
            <div className="hidden md:block">
              <Card className="h-full bg-muted/20 border-border sticky top-4">
                <CardHeader>
                  <CardTitle className="text-lg">Live Estimate</CardTitle>
                  <CardDescription>Updates as you answer</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center min-h-[300px] text-center gap-4">
                  <motion.div key={liveEstimate} initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-5xl font-bold text-primary">{liveEstimate.toFixed(1)}</motion.div>
                  <div className="text-sm text-muted-foreground uppercase tracking-widest font-semibold">Tons CO2/Year</div>
                  <div className="w-full space-y-3 mt-4">
                    {[
                      { label: "Transport", value: calcCO2(inputs).transport, color: "bg-accent" },
                      { label: "Energy", value: calcCO2(inputs).energy, color: "bg-yellow-500" },
                      { label: "Diet", value: calcCO2(inputs).diet, color: "bg-primary" },
                      { label: "Shopping", value: calcCO2(inputs).shopping, color: "bg-blue-500" },
                    ].map(({ label, value, color }) => (
                      <div key={label}>
                        <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">{label}</span><span className="font-semibold tabular-nums">{value.toFixed(2)} t</span></div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <motion.div className={`h-full rounded-full ${color}`} animate={{ width: `${Math.min((value / liveEstimate) * 100, 100)}%` }} transition={{ duration: 0.3 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="border-primary/50 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-primary to-accent w-full" />
              <CardHeader className="text-center pb-0">
                <CardTitle className="text-3xl">Your Footprint Result</CardTitle>
                <CardDescription>Based on your responses</CardDescription>
              </CardHeader>
              <CardContent className="pt-8">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-48 h-48 rounded-full border-8 border-primary/20 relative">
                      <div className="absolute inset-0 rounded-full border-8 border-primary border-t-transparent -rotate-45" />
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-5xl font-bold text-primary">{result.total}</span>
                        <span className="text-sm font-medium text-muted-foreground mt-1">Tons / Year</span>
                      </div>
                    </div>
                    <div className="flex justify-center gap-2 mt-4 flex-wrap">
                      {[
                        { label: "Transport", value: result.transport },
                        { label: "Energy", value: result.energy },
                        { label: "Diet", value: result.diet },
                        { label: "Shopping", value: result.shopping },
                      ].map(({ label, value }) => (
                        <Badge key={label} variant="secondary" className="text-xs">{label}: {value}t</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">How you compare</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1"><span>You</span><span className="font-bold">{result.total} t</span></div>
                          <Progress value={Math.min((result.total / 20) * 100, 100)} className="h-2 [&>div]:bg-primary" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1 text-muted-foreground"><span>National Average</span><span>{nationalAvg} t</span></div>
                          <Progress value={Math.min((nationalAvg / 20) * 100, 100)} className="h-2 [&>div]:bg-muted-foreground" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1 text-accent"><span>Global Target</span><span>{globalTarget} t</span></div>
                          <Progress value={Math.min((globalTarget / 20) * 100, 100)} className="h-2 [&>div]:bg-accent" />
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-3">
                        {result.total < nationalAvg
                          ? `You're ${(nationalAvg - result.total).toFixed(1)} tons below the national average.`
                          : `You're ${(result.total - nationalAvg).toFixed(1)} tons above the national average.`}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-border space-y-3">
                      {saved ? (
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold text-sm p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                          <CheckCircle2 className="h-5 w-5" /> Saved to Dashboard!
                        </div>
                      ) : (
                        <Button onClick={handleSave} disabled={saving} className="w-full gap-2 bg-gradient-to-r from-primary to-accent text-white border-none shadow-md hover:opacity-90">
                          <Save className="h-4 w-4" />
                          {saving ? "Saving…" : "Save to Dashboard"}
                        </Button>
                      )}
                      <Button onClick={handleReset} variant="outline" className="w-full gap-2">
                        <RotateCcw className="h-4 w-4" /> Recalculate
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
