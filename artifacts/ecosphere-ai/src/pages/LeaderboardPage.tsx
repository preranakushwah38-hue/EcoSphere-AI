import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import {
  Trophy, Flame, Star, Zap, Shield, Award,
  TrendingUp, Crown, Medal, Leaf
} from "lucide-react";

interface EcoScore { ecoScore: number; travelScore: number; energyScore: number; waterScore: number; dietScore: number; createdAt: string; }

type LeaderEntry = { rank: number; name: string; location: string; score: number; xp: number; streak: number; level: number; badge: string; isYou?: boolean };

const STATIC_LEADERS: LeaderEntry[] = [
  { rank: 1, name: "Sofia Chen", location: "Singapore", score: 94, xp: 12400, streak: 45, level: 12, badge: "Planet Protector" },
  { rank: 2, name: "Marcus Green", location: "Copenhagen", score: 91, xp: 11200, streak: 38, level: 11, badge: "Carbon Crusher" },
  { rank: 3, name: "Amara Osei", location: "Accra", score: 89, xp: 10800, streak: 32, level: 11, badge: "Green Guardian" },
  { rank: 4, name: "Yuki Tanaka", location: "Tokyo", score: 85, xp: 9600, streak: 28, level: 10, badge: "Eco Warrior" },
  { rank: 5, name: "Elena Vasquez", location: "Barcelona", score: 82, xp: 8900, streak: 21, level: 9, badge: "Sun Chaser" },
  { rank: 6, name: "Oliver Schmidt", location: "Berlin", score: 79, xp: 8100, streak: 17, level: 8, badge: "Transit Pro" },
  { rank: 7, name: "Priya Sharma", location: "Mumbai", score: 76, xp: 7400, streak: 14, level: 8, badge: "Plant Power" },
  { rank: 8, name: "James Okafor", location: "Lagos", score: 73, xp: 6800, streak: 9, level: 7, badge: "Waste Warrior" },
  { rank: 9, name: "Lucia Bianchi", location: "Milan", score: 69, xp: 6100, streak: 7, level: 7, badge: "Slow Fashion" },
  { rank: 10, name: "Alex Kim", location: "Seoul", score: 65, xp: 5600, streak: 5, level: 6, badge: "Getting Started" },
];

const BADGES = [
  { icon: Leaf, label: "Carbon Reducer", desc: "Logged 5 carbon entries", color: "text-green-500", bg: "bg-green-500/10", earned: true },
  { icon: Zap, label: "Energy Saver", desc: "Used renewable energy", color: "text-yellow-500", bg: "bg-yellow-500/10", earned: true },
  { icon: Shield, label: "Water Guardian", desc: "Stay under 120L/day for 7 days", color: "text-blue-500", bg: "bg-blue-500/10", earned: false },
  { icon: Star, label: "Eco Coach", desc: "Complete Eco Coach analysis", color: "text-primary", bg: "bg-primary/10", earned: true },
  { icon: Flame, label: "7-Day Streak", desc: "Log data for 7 consecutive days", color: "text-orange-500", bg: "bg-orange-500/10", earned: false },
  { icon: Crown, label: "Waste Warrior", desc: "Achieve 80%+ diversion rate", color: "text-purple-500", bg: "bg-purple-500/10", earned: false },
];

function getBadgeTitle(score: number) {
  if (score >= 80) return "Eco Champion";
  if (score >= 60) return "Sustainability Star";
  if (score >= 40) return "Eco Learner";
  if (score >= 20) return "Green Starter";
  return "Newcomer";
}

function getLevel(xp: number) { return Math.floor(xp / 1000) + 1; }

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
  if (rank === 2) return <Medal className="h-5 w-5 text-slate-400" />;
  if (rank === 3) return <Medal className="h-5 w-5 text-orange-400" />;
  return <span className="text-sm font-bold text-muted-foreground tabular-nums w-5 text-center">{rank}</span>;
}

export default function LeaderboardPage() {
  const [userScore, setUserScore] = useState<EcoScore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/eco-scores?limit=1")
      .then(r => r.json())
      .then((data: EcoScore[]) => { setUserScore(data[0] ?? null); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const userEcoScore = userScore?.ecoScore ?? 0;
  const userXp = userEcoScore * 120;
  const userLevel = getLevel(userXp);
  const userBadge = getBadgeTitle(userEcoScore);
  const earnedBadges = BADGES.filter(b => b.earned).length;

  // Build leaderboard with "You" inserted at right position
  const fullLeaderboard = [...STATIC_LEADERS];
  let userRank = fullLeaderboard.filter(e => e.score > userEcoScore).length + 1;

  if (userEcoScore > 0) {
    const userEntry = {
      rank: userRank, name: "You (Alex Rivera)", location: "Your City",
      score: userEcoScore, xp: userXp, streak: 3, level: userLevel, badge: userBadge, isYou: true,
    };
    // Adjust other ranks
    const above = fullLeaderboard.filter(e => e.score >= userEcoScore);
    const below = fullLeaderboard.filter(e => e.score < userEcoScore);
    const merged = [
      ...above.map((e, i) => ({ ...e, rank: i + 1 })),
      { ...userEntry, rank: above.length + 1 },
      ...below.map((e, i) => ({ ...e, rank: above.length + 2 + i })),
    ];
    userRank = above.length + 1;
    fullLeaderboard.splice(0, fullLeaderboard.length, ...merged.slice(0, 12).map((e, i) => ({ ...e, rank: i + 1 })));
  }

  const top3 = STATIC_LEADERS.slice(0, 3);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-500/10 rounded-xl"><Trophy className="h-6 w-6 text-yellow-500" /></div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Leaderboard</h1>
            <p className="text-sm text-muted-foreground">Weekly eco champion rankings</p>
          </div>
        </div>
        {!loading && userEcoScore > 0 && (
          <div className="flex items-center gap-3 px-4 py-2.5 bg-primary/5 border border-primary/20 rounded-xl">
            <div className="p-1.5 bg-primary/10 rounded-lg"><Trophy className="h-4 w-4 text-primary" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Your Rank</p>
              <p className="font-bold text-primary">#{userRank} of {fullLeaderboard.length + 1}</p>
            </div>
          </div>
        )}
      </div>

      {/* Podium */}
      <Card className="bg-gradient-to-br from-yellow-500/10 via-primary/5 to-accent/10 border-yellow-500/20 shadow-sm overflow-hidden">
        <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2"><Crown className="h-5 w-5 text-yellow-500" /> Top Eco Champions</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-end justify-center gap-4 pt-2 pb-4">
            {/* 2nd */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="flex flex-col items-center gap-2 pb-0">
              <div className="w-14 h-14 rounded-full bg-slate-400/20 border-2 border-slate-400/40 flex items-center justify-center text-lg font-bold text-slate-500">
                {top3[1].name[0]}
              </div>
              <Medal className="h-5 w-5 text-slate-400" />
              <div className="text-center">
                <p className="text-xs font-bold">{top3[1].name.split(" ")[0]}</p>
                <p className="text-xs text-muted-foreground">{top3[1].score}/100</p>
              </div>
              <div className="w-16 h-16 bg-slate-400/20 rounded-t-lg flex items-end justify-center pb-1">
                <span className="text-lg font-black text-slate-400">2</span>
              </div>
            </motion.div>

            {/* 1st */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}
              className="flex flex-col items-center gap-2">
              <Crown className="h-6 w-6 text-yellow-500" />
              <div className="w-16 h-16 rounded-full bg-yellow-500/20 border-2 border-yellow-500/60 ring-2 ring-yellow-500/20 ring-offset-2 flex items-center justify-center text-xl font-bold text-yellow-600">
                {top3[0].name[0]}
              </div>
              <div className="text-center">
                <p className="text-sm font-bold">{top3[0].name.split(" ")[0]}</p>
                <p className="text-xs text-muted-foreground">{top3[0].score}/100</p>
              </div>
              <div className="w-20 h-24 bg-yellow-500/20 rounded-t-lg flex items-end justify-center pb-1">
                <span className="text-2xl font-black text-yellow-500">1</span>
              </div>
            </motion.div>

            {/* 3rd */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full bg-orange-400/20 border-2 border-orange-400/40 flex items-center justify-center text-lg font-bold text-orange-500">
                {top3[2].name[0]}
              </div>
              <Medal className="h-5 w-5 text-orange-400" />
              <div className="text-center">
                <p className="text-xs font-bold">{top3[2].name.split(" ")[0]}</p>
                <p className="text-xs text-muted-foreground">{top3[2].score}/100</p>
              </div>
              <div className="w-16 h-10 bg-orange-400/20 rounded-t-lg flex items-end justify-center pb-1">
                <span className="text-lg font-black text-orange-400">3</span>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Full leaderboard */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="font-bold text-lg">Global Rankings</h2>
          {fullLeaderboard.map((entry, i) => {
            const isYou = "isYou" in entry && entry.isYou;
            return (
              <motion.div
                key={`${entry.name}-${i}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Card className={`shadow-sm transition-all ${isYou ? "border-primary/50 bg-primary/5 ring-1 ring-primary/20" : "hover:shadow-md"}`}>
                  <CardContent className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-7 flex items-center justify-center shrink-0">
                        <RankIcon rank={entry.rank} />
                      </div>
                      <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-foreground border border-border shrink-0">
                        {entry.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className={`text-sm font-semibold truncate ${isYou ? "text-primary" : ""}`}>{entry.name}</p>
                          {isYou && <Badge className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0 border-none">YOU</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground">{entry.location}</p>
                      </div>
                      <div className="hidden sm:flex items-center gap-1 text-orange-500">
                        <Flame className="h-3.5 w-3.5" />
                        <span className="text-xs font-bold">{entry.streak}d</span>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold tabular-nums">{entry.score}<span className="text-xs text-muted-foreground font-normal">/100</span></p>
                        <p className="text-xs text-muted-foreground">{entry.xp.toLocaleString()} XP</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Your stats */}
        <div className="space-y-4">
          <h2 className="font-bold text-lg">Your Progress</h2>

          {/* Score card */}
          <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5 shadow-sm">
            <CardContent className="pt-5 pb-5">
              <div className="text-center">
                <div className="text-4xl font-black text-primary mb-1">
                  {loading ? "—" : userEcoScore > 0 ? userEcoScore : "?"}
                </div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Eco Score</p>
                {userEcoScore > 0 && (
                  <Badge className="mt-2 bg-primary/10 text-primary border-primary/20">{userBadge}</Badge>
                )}
              </div>

              {userEcoScore > 0 && (
                <div className="mt-4 space-y-3">
                  {[
                    { label: "Travel", value: userScore?.travelScore ?? 0, max: 30, color: "bg-accent" },
                    { label: "Energy", value: userScore?.energyScore ?? 0, max: 25, color: "bg-yellow-500" },
                    { label: "Water", value: userScore?.waterScore ?? 0, max: 20, color: "bg-blue-500" },
                    { label: "Diet", value: userScore?.dietScore ?? 0, max: 25, color: "bg-primary" },
                  ].map(({ label, value, max, color }) => (
                    <div key={label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">{label}</span>
                        <span className="font-bold tabular-nums">{value}/{max}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div className={`h-full rounded-full ${color}`} animate={{ width: `${(value / max) * 100}%` }} transition={{ delay: 0.3, duration: 0.6 }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loading && userEcoScore === 0 && (
                <p className="text-xs text-muted-foreground text-center mt-3">Complete the Eco Coach to appear on the leaderboard</p>
              )}
            </CardContent>
          </Card>

          {/* XP & Level */}
          {userEcoScore > 0 && (
            <Card className="shadow-sm">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-yellow-500/10 rounded-lg"><Zap className="h-4 w-4 text-yellow-500" /></div>
                    <span className="font-semibold text-sm">Level {userLevel}</span>
                  </div>
                  <span className="text-sm font-bold tabular-nums text-yellow-600">{userXp.toLocaleString()} XP</span>
                </div>
                <Progress value={(userXp % 1000) / 10} className="h-2.5 [&>div]:bg-yellow-500" />
                <p className="text-xs text-muted-foreground mt-1.5">{1000 - (userXp % 1000)} XP to Level {userLevel + 1}</p>
              </CardContent>
            </Card>
          )}

          {/* Badges */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                <span className="flex items-center gap-2"><Award className="h-4 w-4 text-primary" /> Achievements</span>
                <Badge variant="secondary" className="text-xs">{earnedBadges}/{BADGES.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {BADGES.map(({ icon: Icon, label, desc, color, bg, earned }) => (
                <div key={label} className={`flex items-center gap-3 p-2.5 rounded-lg border transition-colors ${earned ? `${bg} border-transparent` : "bg-muted/20 border-border/40 opacity-50"}`}>
                  <div className={`p-1.5 rounded-md ${earned ? bg : "bg-muted"} shrink-0`}>
                    <Icon className={`h-4 w-4 ${earned ? color : "text-muted-foreground"}`} />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-xs font-semibold truncate ${earned ? color : "text-muted-foreground"}`}>{label}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{desc}</p>
                  </div>
                  {earned && <CheckCircle2 className={`h-4 w-4 ${color} shrink-0 ml-auto`} />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function CheckCircle2({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
