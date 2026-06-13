import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Zap, Sun, Lightbulb, Thermometer } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { sampleData } from "@/data/sampleData";
import { Progress } from "@/components/ui/progress";

export default function EnergyPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-yellow-500/10 rounded-lg">
          <Zap className="h-6 w-6 text-yellow-500" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Energy Dashboard</h1>
          <p className="text-sm text-muted-foreground">Monitor and optimize your power consumption</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-muted-foreground shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">580 kWh</div>
            <p className="text-xs font-medium text-muted-foreground mt-2">This month</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500 shadow-sm bg-gradient-to-br from-yellow-500/5 to-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Solar Generation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">280 kWh</div>
            <p className="text-xs font-medium text-yellow-600/80 dark:text-yellow-400/80 mt-2">+12% vs last month</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-primary shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Grid Dependency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">51%</div>
            <p className="text-xs font-medium text-muted-foreground mt-2">Target: &lt; 40%</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Est. Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">$42.50</div>
            <p className="text-xs font-medium text-green-600 dark:text-green-400 mt-2">$35 saved via solar</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Grid vs Solar Trend</CardTitle>
            <CardDescription>Monthly energy sources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] md:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sampleData.energyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip wrapperClassName="dark:bg-background dark:text-foreground border border-border rounded-lg shadow-md" cursor={{ fill: 'hsl(var(--muted))' }} />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="grid" fill="hsl(var(--muted-foreground))" name="Grid Power (kWh)" radius={[4, 4, 0, 0]} maxBarSize={50} />
                  <Bar dataKey="solar" fill="hsl(var(--primary))" name="Solar Generation (kWh)" radius={[4, 4, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Appliance Breakdown</CardTitle>
              <CardDescription>Estimated usage by category</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-semibold">HVAC</span>
                  </div>
                  <span className="text-sm font-bold text-foreground">45%</span>
                </div>
                <Progress value={45} className="h-3 rounded-full [&>div]:bg-orange-500" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-accent" />
                    <span className="text-sm font-semibold">Appliances</span>
                  </div>
                  <span className="text-sm font-bold text-foreground">30%</span>
                </div>
                <Progress value={30} className="h-3 rounded-full [&>div]:bg-accent" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-semibold">Lighting</span>
                  </div>
                  <span className="text-sm font-bold text-foreground">15%</span>
                </div>
                <Progress value={15} className="h-3 rounded-full [&>div]:bg-yellow-500" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-semibold">Always On</span>
                  </div>
                  <span className="text-sm font-bold text-foreground">10%</span>
                </div>
                <Progress value={10} className="h-3 rounded-full [&>div]:bg-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-primary bg-gradient-to-br from-primary/5 to-transparent shadow-sm">
            <CardContent className="p-5 flex gap-4">
              <div className="p-2 bg-primary/10 rounded-lg h-fit shrink-0">
                <Lightbulb className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1 text-foreground">Tip of the day</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Lowering your thermostat by just 1 degree in winter can save up to 10% on your heating energy usage.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
