import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Recycle, Trash2, Smartphone, Battery, Package, ArrowDown, Leaf, ArrowRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const wasteData = [
  { name: 'Mon', organic: 1.2, recyclable: 0.8, trash: 0.5 },
  { name: 'Tue', organic: 0.9, recyclable: 1.1, trash: 0.6 },
  { name: 'Wed', organic: 1.5, recyclable: 0.7, trash: 0.8 },
  { name: 'Thu', organic: 1.1, recyclable: 1.3, trash: 0.4 },
  { name: 'Fri', organic: 1.8, recyclable: 0.9, trash: 0.5 },
  { name: 'Sat', organic: 2.2, recyclable: 1.5, trash: 1.1 },
  { name: 'Sun', organic: 2.0, recyclable: 1.2, trash: 0.9 },
];

export default function WasteAnalyzerPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Recycle className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Waste Analyzer</h1>
          <p className="text-sm text-muted-foreground">Track and optimize your disposal habits</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-l-4 border-l-primary bg-primary/5 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary">Diversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">68%</div>
            <p className="text-xs font-medium text-primary/80 mt-2 flex items-center gap-1">
              <ArrowDown className="h-3 w-3" /> +5% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-destructive shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Waste (kg)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">14.2</div>
            <p className="text-xs font-medium text-destructive mt-2 flex items-center gap-1">
              -1.2kg vs average
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-accent shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Composted (kg)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">5.4</div>
            <p className="text-xs font-medium text-accent mt-2 flex items-center gap-1">
              Great job!
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Weekly Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] md:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={wasteData} stackOffset="expand" margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickMargin={10} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    wrapperClassName="dark:bg-background dark:text-foreground border border-border rounded-lg shadow-md"
                    cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                  />
                  <Bar dataKey="organic" stackId="a" fill="hsl(var(--accent))" name="Organic" />
                  <Bar dataKey="recyclable" stackId="a" fill="hsl(var(--primary))" name="Recyclable" />
                  <Bar dataKey="trash" stackId="a" fill="hsl(var(--muted-foreground))" name="Landfill" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Classification Guide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-accent/10 border border-accent/20 cursor-pointer hover:bg-accent/20 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white dark:bg-black rounded-lg shadow-sm">
                  <Leaf className="h-6 w-6 text-accent shrink-0" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-foreground">Organic</h4>
                  <p className="text-xs text-muted-foreground mt-1">Food scraps, yard waste.</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-accent/50" />
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-xl bg-primary/10 border border-primary/20 cursor-pointer hover:bg-primary/20 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white dark:bg-black rounded-lg shadow-sm">
                  <Package className="h-6 w-6 text-primary shrink-0" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-foreground">Recyclables</h4>
                  <p className="text-xs text-muted-foreground mt-1">Paper, plastics, glass.</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-primary/50" />
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-xl bg-destructive/10 border border-destructive/20 cursor-pointer hover:bg-destructive/20 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white dark:bg-black rounded-lg shadow-sm">
                  <Battery className="h-6 w-6 text-destructive shrink-0" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-foreground">Hazardous</h4>
                  <p className="text-xs text-muted-foreground mt-1">Batteries, chemicals.</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-destructive/50" />
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 cursor-pointer hover:bg-blue-500/20 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white dark:bg-black rounded-lg shadow-sm">
                  <Smartphone className="h-6 w-6 text-blue-500 shrink-0" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-foreground">E-Waste</h4>
                  <p className="text-xs text-muted-foreground mt-1">Phones, cables, boards.</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-blue-500/50" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
