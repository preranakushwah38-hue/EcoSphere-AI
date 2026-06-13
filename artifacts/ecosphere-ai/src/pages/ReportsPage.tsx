import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BarChart3, Download, Sparkles, Leaf, Droplet, Zap, Recycle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { sampleData } from "@/data/sampleData";

export default function ReportsPage() {
  const pieData = sampleData.categoryBreakdown;
  const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--chart-3))', 'hsl(var(--muted-foreground))'];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Impact Reports</h1>
            <p className="text-sm text-muted-foreground">Detailed analysis of your footprint</p>
          </div>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Select defaultValue="month">
            <SelectTrigger className="w-[160px] h-10 border-border/60">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2 shrink-0 h-10 border-border/60 font-medium hover:bg-muted/50">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl">
              <Leaf className="h-6 w-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Carbon</p>
              <div className="text-2xl font-bold">42.5 kg</div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-accent/10 rounded-xl">
              <Droplet className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Water Saved</p>
              <div className="text-2xl font-bold">250 L</div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-yellow-500/10 rounded-xl">
              <Zap className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Energy Delta</p>
              <div className="text-2xl font-bold text-red-500">+15 kWh</div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Recycle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Waste Diverted</p>
              <div className="text-2xl font-bold">68%</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border-primary/20 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <CardContent className="p-6 relative z-10">
          <div className="flex gap-5">
            <div className="p-3 bg-white dark:bg-black border border-primary/20 rounded-xl shadow-sm h-fit shrink-0">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2 text-foreground">AI Insight for October</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-4xl">
                Your transport emissions decreased by 15% this month compared to September, largely due to your consistent participation in the "Bike to Work" challenge. However, home energy use saw a slight uptick. Focusing on heating optimization could reduce next month's footprint by an estimated 8%.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Emission Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] md:h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    wrapperClassName="dark:bg-background dark:text-foreground border border-border rounded-lg shadow-md"
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 flex-wrap mt-2">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  <span>{entry.name} <span className="text-muted-foreground font-normal ml-1">({entry.value}%)</span></span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Monthly Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] md:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sampleData.carbonData.slice(-4)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="week" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickMargin={10} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    wrapperClassName="dark:bg-background dark:text-foreground border border-border rounded-lg shadow-md"
                    cursor={{ fill: 'hsl(var(--muted))' }}
                  />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} name="CO2 (kg)" maxBarSize={60} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm overflow-hidden">
        <CardHeader className="bg-muted/20 border-b border-border/50 pb-4">
          <CardTitle className="text-xl">Metric Comparison</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase tracking-wider bg-muted/40">
                <tr>
                  <th className="px-6 py-4 font-semibold">Metric</th>
                  <th className="px-6 py-4 font-semibold">This Month</th>
                  <th className="px-6 py-4 font-semibold">Last Month</th>
                  <th className="px-6 py-4 font-semibold text-right">Change</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50 hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4 font-semibold text-foreground">Carbon Footprint</td>
                  <td className="px-6 py-4">42.5 kg</td>
                  <td className="px-6 py-4 text-muted-foreground">48.2 kg</td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 font-bold text-xs">-11.8%</span>
                  </td>
                </tr>
                <tr className="border-b border-border/50 bg-muted/20 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-semibold text-foreground">Water Usage</td>
                  <td className="px-6 py-4">3,850 L</td>
                  <td className="px-6 py-4 text-muted-foreground">4,100 L</td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 font-bold text-xs">-6.1%</span>
                  </td>
                </tr>
                <tr className="border-b border-border/50 hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4 font-semibold text-foreground">Energy Consumption</td>
                  <td className="px-6 py-4">580 kWh</td>
                  <td className="px-6 py-4 text-muted-foreground">565 kWh</td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 font-bold text-xs">+2.6%</span>
                  </td>
                </tr>
                <tr className="bg-muted/20 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-semibold text-foreground">Waste Diverted</td>
                  <td className="px-6 py-4">68%</td>
                  <td className="px-6 py-4 text-muted-foreground">63%</td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 font-bold text-xs">+5.0%</span>
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
