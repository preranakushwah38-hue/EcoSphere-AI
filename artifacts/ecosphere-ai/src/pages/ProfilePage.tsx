import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MapPin, Calendar, Award, Zap, Activity, ShieldCheck, Car, Trophy } from "lucide-react";
import { sampleData } from "@/data/sampleData";

export default function ProfilePage() {
  const { user, badges } = sampleData;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header Profile Card */}
      <Card className="overflow-hidden border-border/60 shadow-sm relative">
        <div className="h-40 bg-gradient-to-r from-primary via-primary/70 to-accent/60" />
        <CardContent className="pt-0 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 -mt-16 sm:-mt-20 mb-6">
            <div className="relative">
              <Avatar className="h-28 w-28 sm:h-36 sm:w-36 ring-4 ring-background bg-card shadow-md">
                <AvatarFallback className="text-3xl sm:text-5xl bg-muted text-muted-foreground font-bold">
                  {user.initials}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm border-2 border-background">
                Level 7
              </div>
            </div>
            
            <div className="text-center sm:text-left flex-1 mb-2">
              <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">{user.name}</h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2 text-sm text-muted-foreground font-medium">
                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" /> {user.location}</span>
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-primary" /> Joined {user.joined}</span>
              </div>
            </div>
            <Button variant="outline" className="sm:mb-2 border-primary/30 hover:bg-primary/5 text-primary font-medium">Edit Profile</Button>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/60">
            <div className="flex flex-col items-center justify-center">
              <Activity className="h-5 w-5 text-primary mb-2" />
              <div className="text-2xl sm:text-3xl font-bold text-foreground">{user.score}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Eco Score</div>
            </div>
            <div className="flex flex-col items-center justify-center border-l border-r border-border/60">
              <Trophy className="h-5 w-5 text-accent mb-2" />
              <div className="text-2xl sm:text-3xl font-bold text-accent">#{user.rank}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Global Rank</div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <Award className="h-5 w-5 text-yellow-500 mb-2" />
              <div className="text-2xl sm:text-3xl font-bold text-foreground">12</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Badges</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Badges Section */}
        <Card className="md:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <div className="p-1.5 bg-yellow-500/10 rounded-md">
                <Award className="h-5 w-5 text-yellow-500" />
              </div>
              Achievement Badges
            </CardTitle>
            <CardDescription>Badges earned through sustainability actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {badges.map((badge) => (
                <div 
                  key={badge.id} 
                  className={`flex flex-col items-center p-5 rounded-xl border transition-all duration-300 ${
                    badge.earned 
                      ? 'bg-card border-primary/20 shadow-sm hover:border-primary/50 hover:shadow-[0_0_12px_rgba(52,211,153,0.3)] hover:-translate-y-1' 
                      : 'bg-muted/30 border-border/50 opacity-60 grayscale'
                  }`}
                >
                  <div className={`p-4 rounded-full mb-3 ${badge.earned ? 'bg-gradient-to-br from-primary/20 to-accent/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    <ShieldCheck className="h-8 w-8" />
                  </div>
                  <span className="text-sm font-semibold text-center leading-tight text-foreground">{badge.name}</span>
                  {!badge.earned && <Badge variant="secondary" className="mt-2 text-[10px] px-2 py-0.5 uppercase tracking-wider font-bold">Locked</Badge>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Settings & Integrations */}
        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Integrations</CardTitle>
              <CardDescription>Connect devices for automated tracking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg"><Activity className="h-5 w-5 text-blue-500" /></div>
                  <span className="text-sm font-semibold text-foreground">Fitbit</span>
                </div>
                <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 font-bold">Connected</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/10 rounded-lg"><Car className="h-5 w-5 text-red-500" /></div>
                  <span className="text-sm font-semibold text-foreground">Tesla</span>
                </div>
                <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold hover:bg-muted/50 border border-border/60">Connect</Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-500/10 rounded-lg"><Zap className="h-5 w-5 text-yellow-500" /></div>
                  <span className="text-sm font-semibold text-foreground">Google Home</span>
                </div>
                <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold hover:bg-muted/50 border border-border/60">Connect</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications" className="flex flex-col gap-1 cursor-pointer">
                  <span className="font-semibold text-foreground">Push Notifications</span>
                  <span className="font-medium text-xs text-muted-foreground">Weekly reports and alerts</span>
                </Label>
                <Switch id="notifications" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="units" className="flex flex-col gap-1 cursor-pointer">
                  <span className="font-semibold text-foreground">Imperial Units</span>
                  <span className="font-medium text-xs text-muted-foreground">Use lbs, miles, gallons</span>
                </Label>
                <Switch id="units" />
              </div>
              
              <div className="pt-6 mt-6 border-t border-border/60">
                <Button variant="outline" className="w-full text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive font-semibold">Sign Out</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
