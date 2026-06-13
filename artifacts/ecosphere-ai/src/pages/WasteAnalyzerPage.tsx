import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Recycle, Trash2, Smartphone, Battery, Package, ArrowDown, Leaf } from "lucide-react";
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
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Recycle className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Waste Analyzer</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary">Diversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">68%</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <ArrowDown className="h-3 w-3 text-primary" /> +5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Waste (kg)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">14.2</div>
            <p className="text-xs text-muted-foreground mt-1 text-destructive flex items-center gap-1">
              -1.2kg vs average
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Composted (kg)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">5.4</div>
            <p className="text-xs text-muted-foreground mt-1 text-accent flex items-center gap-1">
              Great job!
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={wasteData} stackOffset="expand">
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip wrapperClassName="dark:bg-black dark:text-white" />
                  <Bar dataKey="organic" stackId="a" fill="hsl(var(--accent))" name="Organic" />
                  <Bar dataKey="recyclable" stackId="a" fill="hsl(var(--primary))" name="Recyclable" />
                  <Bar dataKey="trash" stackId="a" fill="hsl(var(--muted-foreground))" name="Landfill" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Classification Guide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/10 border border-accent/20">
              <Leaf className="h-5 w-5 text-accent mt-0.5 shrink-0" />
              <div>
                <h4 className="font-medium text-sm">Organic</h4>
                <p className="text-xs text-muted-foreground">Food scraps, coffee grounds, yard waste.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
              <Package className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <h4 className="font-medium text-sm">Recyclables</h4>
                <p className="text-xs text-muted-foreground">Clean paper, cardboard, rigid plastics, glass.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <Battery className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
              <div>
                <h4 className="font-medium text-sm">Hazardous</h4>
                <p className="text-xs text-muted-foreground">Batteries, paint, chemicals. Do not bin.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <Smartphone className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-medium text-sm">E-Waste</h4>
                <p className="text-xs text-muted-foreground">Phones, cables, appliances. Requires special drop-off.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
