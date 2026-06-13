import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sampleData } from "@/data/sampleData";
import { Activity, Droplet, Leaf, Zap, Bot, TrendingDown, TrendingUp } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Good morning, Alex</h1>
        <p className="text-muted-foreground">Here's your sustainability overview for today.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sustainability Score</CardTitle>
            <div className="p-2 rounded-lg bg-primary/10">
              <Activity className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{sampleData.user.score}<span className="text-xl text-muted-foreground font-medium">/100</span></div>
            <p className="text-sm font-medium text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
              <TrendingUp className="h-4 w-4" /> +2% from last week
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Carbon Footprint</CardTitle>
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <Leaf className="h-5 w-5 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">9.8 kg</div>
            <p className="text-sm font-medium text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
              <TrendingDown className="h-4 w-4" /> -1.2 kg from yesterday
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-accent shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Water Usage</CardTitle>
            <div className="p-2 rounded-lg bg-accent/10">
              <Droplet className="h-5 w-5 text-accent" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">120 L</div>
            <p className="text-sm font-medium text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
              <TrendingDown className="h-4 w-4" /> -15 L from average
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Energy Offset</CardTitle>
            <div className="p-2 rounded-lg bg-yellow-500/10">
              <Zap className="h-5 w-5 text-yellow-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">35%</div>
            <p className="text-sm font-medium text-muted-foreground mt-2">Generated via solar</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 rounded-xl p-4 flex items-start sm:items-center gap-4 shadow-sm">
        <div className="p-2 bg-primary/10 rounded-lg shrink-0">
          <Bot className="h-6 w-6 text-primary" />
        </div>
        <p className="text-sm md:text-base font-medium text-foreground">
          <span className="font-bold text-primary mr-2">AI Insight</span> 
          Your footprint is 23% below the national average this week. Transport emissions improved most.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Carbon Footprint Trend</CardTitle>
            <p className="text-sm text-muted-foreground">Carbon CO2 emissions vs. global average</p>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] md:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sampleData.carbonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="week" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip wrapperClassName="dark:bg-background dark:text-foreground border border-border rounded-lg shadow-md" />
                  <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={3} fill="hsl(var(--primary))" fillOpacity={0.15} />
                  <Area type="monotone" dataKey="average" stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" fill="none" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-3 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {sampleData.activities.map(activity => (
                <div key={activity.id} className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <div className="font-bold text-sm text-primary bg-primary/10 px-2 py-1 rounded-md">{activity.points}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
