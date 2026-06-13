import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BarChart3, Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { sampleData } from "@/data/sampleData";

export default function ReportsPage() {
  const pieData = sampleData.categoryBreakdown;
  const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--chart-3))', 'hsl(var(--muted-foreground))'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Impact Reports</h1>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Select defaultValue="month">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2 shrink-0">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="p-3 bg-primary/10 rounded-full h-fit">
              <span className="text-2xl">✨</span>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">AI Insight for October</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Your transport emissions decreased by 15% this month compared to September, largely due to your consistent participation in the "Bike to Work" challenge. However, home energy use saw a slight uptick. Focusing on heating optimization could reduce next month's footprint by an estimated 8%.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Emission Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip wrapperClassName="dark:bg-black dark:text-white" />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 flex-wrap mt-4">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  <span>{entry.name} ({entry.value}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sampleData.carbonData.slice(-4)}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="week" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip wrapperClassName="dark:bg-black dark:text-white" />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="CO2 (kg)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Metric Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">Metric</th>
                  <th className="px-4 py-3">This Month</th>
                  <th className="px-4 py-3">Last Month</th>
                  <th className="px-4 py-3 rounded-tr-lg">Change</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-4 py-4 font-medium">Carbon Footprint</td>
                  <td className="px-4 py-4">42.5 kg</td>
                  <td className="px-4 py-4">48.2 kg</td>
                  <td className="px-4 py-4 text-primary font-medium">-11.8%</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-4 font-medium">Water Usage</td>
                  <td className="px-4 py-4">3,850 L</td>
                  <td className="px-4 py-4">4,100 L</td>
                  <td className="px-4 py-4 text-primary font-medium">-6.1%</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-4 font-medium">Energy Consumption</td>
                  <td className="px-4 py-4">580 kWh</td>
                  <td className="px-4 py-4">565 kWh</td>
                  <td className="px-4 py-4 text-destructive font-medium">+2.6%</td>
                </tr>
                <tr>
                  <td className="px-4 py-4 font-medium">Waste Diverted</td>
                  <td className="px-4 py-4">68%</td>
                  <td className="px-4 py-4">63%</td>
                  <td className="px-4 py-4 text-primary font-medium">+5.0%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
