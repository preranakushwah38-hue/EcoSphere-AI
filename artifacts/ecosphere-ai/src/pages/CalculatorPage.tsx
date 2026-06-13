import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Calculator, ArrowRight, Car, Home, ShoppingBag, Utensils } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  { id: "transport", title: "Transport", icon: Car },
  { id: "energy", title: "Home Energy", icon: Home },
  { id: "diet", title: "Diet", icon: Utensils },
  { id: "shopping", title: "Shopping", icon: ShoppingBag }
];

export default function CalculatorPage() {
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<number | null>(null);

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setResult(12.4); // Mock calculation
    }
  };

  const handleReset = () => {
    setStep(0);
    setResult(null);
  };

  const CurrentIcon = steps[step].icon;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-2 mb-8">
        <Calculator className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Footprint Calculator</h1>
      </div>

      {!result ? (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="mb-8">
              <div className="flex justify-between text-sm mb-2 text-muted-foreground">
                <span>Step {step + 1} of {steps.length}</span>
                <span>{steps[step].title}</span>
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
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Miles driven per week</Label>
                      <Slider defaultValue={[50]} max={500} step={10} />
                    </div>
                    <div className="space-y-2">
                      <Label>Public transit hours per week</Label>
                      <Input type="number" defaultValue={2} />
                    </div>
                    <div className="space-y-2">
                      <Label>Flights per year</Label>
                      <Input type="number" defaultValue={1} />
                    </div>
                  </motion.div>
                )}
                {step === 1 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Average monthly electricity bill ($)</Label>
                      <Slider defaultValue={[100]} max={500} step={10} />
                    </div>
                    <div className="space-y-2">
                      <Label>Do you use renewable energy?</Label>
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1">Yes</Button>
                        <Button variant="default" className="flex-1 bg-primary text-primary-foreground">No</Button>
                      </div>
                    </div>
                  </motion.div>
                )}
                {step === 2 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Diet type</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline">Vegan</Button>
                        <Button variant="outline">Vegetarian</Button>
                        <Button variant="default" className="bg-primary">Omnivore</Button>
                        <Button variant="outline">Pescatarian</Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Meat meals per week</Label>
                      <Slider defaultValue={[10]} max={21} step={1} />
                    </div>
                  </motion.div>
                )}
                {step === 3 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <div className="space-y-2">
                      <Label>New clothing items per month</Label>
                      <Slider defaultValue={[2]} max={20} step={1} />
                    </div>
                    <div className="space-y-2">
                      <Label>Recycling habit</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <Button variant="outline">Rarely</Button>
                        <Button variant="default" className="bg-primary">Sometimes</Button>
                        <Button variant="outline">Always</Button>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div className="pt-4 flex justify-end">
                  <Button onClick={handleNext} className="gap-2 bg-primary text-primary-foreground">
                    {step === steps.length - 1 ? "Calculate" : "Next"} <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="hidden md:block">
            <Card className="h-full bg-muted/20 border-border">
              <CardHeader>
                <CardTitle className="text-lg">Live Estimate</CardTitle>
                <CardDescription>Updates as you answer</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center min-h-[300px] text-center">
                <div className="text-5xl font-bold text-primary mb-2">~14.2</div>
                <div className="text-sm text-muted-foreground uppercase tracking-widest font-semibold">Tons CO2/Year</div>
                <p className="mt-8 text-sm text-muted-foreground">This is currently 15% above the global average.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
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
                    <div className="absolute inset-0 rounded-full border-8 border-primary border-t-transparent -rotate-45"></div>
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-5xl font-bold text-primary">{result}</span>
                      <span className="text-sm font-medium text-muted-foreground mt-1">Tons / Year</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">How you compare</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>You</span>
                          <span className="font-bold">{result} t</span>
                        </div>
                        <Progress value={70} className="h-2 [&>div]:bg-primary" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1 text-muted-foreground">
                          <span>National Average</span>
                          <span>16.0 t</span>
                        </div>
                        <Progress value={90} className="h-2 [&>div]:bg-muted-foreground" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1 text-accent">
                          <span>Global Target</span>
                          <span>2.0 t</span>
                        </div>
                        <Progress value={15} className="h-2 [&>div]:bg-accent" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <Button onClick={handleReset} variant="outline" className="w-full">Recalculate</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
