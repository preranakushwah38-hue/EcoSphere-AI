import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Trophy, TreePine, Globe } from "lucide-react";
import { sampleData } from "@/data/sampleData";

export default function CommunityPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Users className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Community Impact</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" /> Global Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">10,482</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-accent/10 to-transparent border-accent/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TreePine className="h-4 w-4 text-accent" /> CO2 Saved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2.4M kg</div>
            <p className="text-xs text-muted-foreground mt-1">~120,000 trees equivalent</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Challenges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4,192</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Water Saved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">850k L</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" /> Leaderboard
            </CardTitle>
            <CardDescription>Top sustainability champions this week</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Rank</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleData.leaderboard.map((user) => (
                  <TableRow key={user.id} className={user.isCurrentUser ? "bg-primary/5" : ""}>
                    <TableCell className="font-medium">
                      {user.rank <= 3 ? (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white
                          ${user.rank === 1 ? 'bg-yellow-500' : user.rank === 2 ? 'bg-slate-400' : 'bg-amber-700'}`}>
                          {user.rank}
                        </div>
                      ) : (
                        <span className="pl-3 text-muted-foreground">#{user.rank}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className={user.isCurrentUser ? "bg-primary text-primary-foreground" : ""}>
                            {user.initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className={user.isCurrentUser ? "font-bold text-primary" : "font-medium"}>
                          {user.name}
                          {user.isCurrentUser && " (You)"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-bold">{user.score}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Live Activity Feed</CardTitle>
            <CardDescription>What others are doing</CardDescription>
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
                <div key={i} className="flex gap-4">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="bg-muted text-xs">{act.name.split(' ')[0][0]}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      <span className="text-foreground">{act.name}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">{act.action}</p>
                    <p className="text-xs text-muted-foreground/60">{act.time}</p>
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
