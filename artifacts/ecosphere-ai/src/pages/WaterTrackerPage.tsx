import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplet, TrendingDown } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { sampleData } from "@/data/sampleData";

export default function WaterTrackerPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Droplet className="h-6 w-6 text-accent" />
        <h1 className="text-3xl font-bold tracking-tight">Water Tracker</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Daily Avg</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">130 L</div>
            <p className="text-xs text-muted-foreground mt-1">-5 L from target</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Weekly Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">910 L</div>
            <p className="text-xs text-muted-foreground mt-1">Normal range</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Regional Compare</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">-18%</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
               vs neighbors
            </p>
          </CardContent>
        </Card>
        <Card className="bg-primary text-primary-foreground">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary-foreground/80">Est. Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$14.50</div>
            <p className="text-xs text-primary-foreground/80 mt-1">This month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Usage Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sampleData.waterData}>
                  <defs>
                    <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip wrapperClassName="dark:bg-black dark:text-white border-none rounded-lg shadow-lg" />
                  <Area type="monotone" dataKey="usage" stroke="hsl(var(--accent))" fillOpacity={1} fill="url(#colorUsage)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tips to Save</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              "Fix leaky faucets: Saves up to 20L/day",
              "Shorter showers: 2 mins less = 15L saved",
              "Full loads only: Wait to run laundry/dishes",
              "Collect rainwater for indoor plants",
              "Turn off tap while brushing teeth"
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-muted/20">
                <TrendingDown className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                <span className="text-sm font-medium">{tip}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
