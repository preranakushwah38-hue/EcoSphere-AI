import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplet, TrendingDown, Target, CheckCircle2 } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { sampleData } from "@/data/sampleData";
import { Progress } from "@/components/ui/progress";

export default function WaterTrackerPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-accent/10 rounded-lg">
          <Droplet className="h-6 w-6 text-accent" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Water Tracker</h1>
          <p className="text-sm text-muted-foreground">Monitor your daily water consumption</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-full">
              <Droplet className="h-5 w-5 text-blue-500" />
            </div>
            <CardTitle className="text-sm font-medium text-muted-foreground">Daily Avg</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">130 L</div>
            <p className="text-xs font-medium text-green-600 dark:text-green-400 mt-1">-5 L from target</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-full">
              <Target className="h-5 w-5 text-accent" />
            </div>
            <CardTitle className="text-sm font-medium text-muted-foreground">Weekly Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">910 L</div>
            <p className="text-xs font-medium text-muted-foreground mt-1">Normal range</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <TrendingDown className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-sm font-medium text-muted-foreground">Regional Compare</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">-18%</div>
            <p className="text-xs font-medium text-muted-foreground mt-1 flex items-center gap-1">
               vs neighbors
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-primary to-accent text-white shadow-sm border-none">
          <CardHeader className="pb-2 flex flex-row items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-sm font-medium text-white/90">Est. Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">$14.50</div>
            <p className="text-xs font-medium text-white/80 mt-1">This month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Usage Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] md:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sampleData.waterData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickMargin={10} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip wrapperClassName="dark:bg-background dark:text-foreground border border-border rounded-lg shadow-md" cursor={{ stroke: 'hsl(var(--accent))', strokeWidth: 1, strokeDasharray: '5 5' }} />
                  <Area type="monotone" dataKey="usage" stroke="hsl(var(--accent))" strokeWidth={3} fillOpacity={1} fill="url(#colorUsage)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-sm border-l-4 border-l-accent bg-accent/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Water Saving Goal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end mb-2">
                <div>
                  <span className="text-3xl font-bold text-accent">130</span>
                  <span className="text-muted-foreground font-medium ml-1">/ 120 L/day</span>
                </div>
                <span className="text-sm font-bold text-foreground">92%</span>
              </div>
              <Progress value={92} className="h-3 rounded-full [&>div]:bg-accent" />
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Tips to Save</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                "Fix leaky faucets: Saves up to 20L/day",
                "Shorter showers: 2 mins less = 15L saved",
                "Full loads only: Wait to run laundry/dishes",
                "Collect rainwater for indoor plants",
                "Turn off tap while brushing teeth"
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-bold shrink-0">
                    {i + 1}
                  </div>
                  <span className="text-sm font-medium text-foreground mt-0.5">{tip}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
