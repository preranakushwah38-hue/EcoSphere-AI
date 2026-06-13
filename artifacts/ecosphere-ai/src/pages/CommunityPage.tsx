import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Trophy, TreePine, Globe, Target, Droplet } from "lucide-react";
import { sampleData } from "@/data/sampleData";
import { Badge } from "@/components/ui/badge";

export default function CommunityPage() {
  const avatarColors = [
    "bg-red-500/20 text-red-700 dark:text-red-400",
    "bg-blue-500/20 text-blue-700 dark:text-blue-400",
    "bg-green-500/20 text-green-700 dark:text-green-400",
    "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
    "bg-purple-500/20 text-purple-700 dark:text-purple-400"
  ];

  const changeData = ["+2", "0", "+1", "-1", "+3", "+0"];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Users className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Community Impact</h1>
          <p className="text-sm text-muted-foreground">Together we are making a difference</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 flex flex-row items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-sm font-medium text-muted-foreground">Global Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">10,482</div>
            <p className="text-xs text-green-600 font-medium mt-1">+124 this week</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 flex flex-row items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-full">
              <TreePine className="h-5 w-5 text-emerald-500" />
            </div>
            <CardTitle className="text-sm font-medium text-muted-foreground">CO2 Saved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">2.4M kg</div>
            <p className="text-xs text-muted-foreground mt-1">~120,000 trees equivalent</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 flex flex-row items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-full">
              <Target className="h-5 w-5 text-orange-500" />
            </div>
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Challenges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">4,192</div>
            <p className="text-xs text-muted-foreground mt-1">Across 5 categories</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2 flex flex-row items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-full">
              <Droplet className="h-5 w-5 text-accent" />
            </div>
            <CardTitle className="text-sm font-medium text-muted-foreground">Water Saved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">850k L</div>
            <p className="text-xs text-muted-foreground mt-1">Enough for 340 pools</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="p-1.5 bg-yellow-500/10 rounded-md">
                <Trophy className="h-5 w-5 text-yellow-500" />
              </div>
              Leaderboard
            </CardTitle>
            <CardDescription>Top sustainability champions this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-lg border border-border/50">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[80px] text-center">Rank</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead className="text-center">Change</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleData.leaderboard.map((user, idx) => (
                    <TableRow key={user.id} className={`${user.isCurrentUser ? "bg-primary/5" : ""} ${user.rank === 1 ? "bg-gradient-to-r from-yellow-500/10 to-transparent" : user.rank === 2 ? "bg-gradient-to-r from-slate-400/10 to-transparent" : user.rank === 3 ? "bg-gradient-to-r from-amber-700/10 to-transparent" : ""}`}>
                      <TableCell className="font-medium text-center">
                        {user.rank <= 3 ? (
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white mx-auto shadow-sm
                            ${user.rank === 1 ? 'bg-yellow-500' : user.rank === 2 ? 'bg-slate-400' : 'bg-amber-700'}`}>
                            {user.rank}
                          </div>
                        ) : (
                          <span className="text-muted-foreground font-semibold">#{user.rank}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className={`h-9 w-9 border ${user.isCurrentUser ? 'border-primary ring-2 ring-primary/20' : 'border-border'}`}>
                            <AvatarFallback className={user.isCurrentUser ? "bg-primary text-primary-foreground font-bold" : "bg-muted font-medium text-muted-foreground"}>
                              {user.initials}
                            </AvatarFallback>
                          </Avatar>
                          <span className={`${user.isCurrentUser ? "font-bold text-primary" : "font-semibold text-foreground"}`}>
                            {user.name}
                            {user.isCurrentUser && <span className="ml-2 text-xs font-normal text-muted-foreground">(You)</span>}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                          changeData[idx].startsWith('+') && changeData[idx] !== '+0' ? 'text-green-600 bg-green-500/10' : 
                          changeData[idx].startsWith('-') ? 'text-red-600 bg-red-500/10' : 
                          'text-muted-foreground bg-muted'
                        }`}>
                          {changeData[idx]}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary" className="font-bold text-sm bg-background border border-border px-3 py-1">
                          {user.score}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Live Activity</CardTitle>
            <CardDescription>What others are doing right now</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { name: "Sarah J.", action: "Logged a zero-waste grocery run", time: "2m ago" },
                { name: "Marcus C.", action: "Earned Solar Champion badge", time: "15m ago" },
                { name: "Priya P.", action: "Started 'Bike to Work' challenge", time: "1h ago" },
                { name: "David K.", action: "Planted 5 trees (equivalent)", time: "2h ago" },
                { name: "Elena R.", action: "Reduced monthly water by 10%", time: "5h ago" },
              ].map((act, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <Avatar className="h-10 w-10 shrink-0 border border-border">
                    <AvatarFallback className={`font-semibold ${avatarColors[i % avatarColors.length]}`}>
                      {act.name.split(' ')[0][0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1 mt-0.5">
                    <p className="text-sm font-semibold leading-none text-foreground">
                      {act.name}
                    </p>
                    <p className="text-sm text-muted-foreground leading-snug">{act.action}</p>
                    <p className="text-xs font-medium text-muted-foreground/60">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
