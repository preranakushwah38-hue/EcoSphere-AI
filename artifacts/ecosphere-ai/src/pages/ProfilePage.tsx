import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { User, MapPin, Calendar, Award, Zap, Activity, ShieldCheck, Car } from "lucide-react";
import { sampleData } from "@/data/sampleData";

export default function ProfilePage() {
  const { user, badges } = sampleData;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Profile Card */}
      <Card className="overflow-hidden border-border/50 shadow-sm relative">
        <div className="h-32 bg-gradient-to-r from-primary/80 to-accent/80" />
        <CardContent className="pt-0 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 -mt-12 sm:-mt-16 mb-6">
            <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-card bg-card shadow-md">
              <AvatarFallback className="text-3xl sm:text-4xl bg-muted text-muted-foreground font-bold">
                {user.initials}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left flex-1 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{user.name}</h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {user.location}</span>
                <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Joined {user.joined}</span>
              </div>
            </div>
            <Button variant="outline" className="sm:mb-2">Edit Profile</Button>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{user.score}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Eco Score</div>
            </div>
            <div className="text-center border-l border-r border-border">
              <div className="text-2xl font-bold text-accent">#{user.rank}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Global Rank</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">12</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Badges</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Badges Section */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" /> Achievement Badges
            </CardTitle>
            <CardDescription>Badges earned through sustainability actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {badges.map((badge) => (
                <div 
                  key={badge.id} 
                  className={`flex flex-col items-center p-4 rounded-xl border transition-all ${
                    badge.earned 
                      ? 'bg-card border-primary/20 shadow-sm hover:border-primary/50' 
                      : 'bg-muted/30 border-border/50 opacity-60 grayscale'
                  }`}
                >
                  <div className={`p-3 rounded-full mb-3 ${badge.earned ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    <ShieldCheck className="h-8 w-8" />
                  </div>
                  <span className="text-sm font-medium text-center leading-tight">{badge.name}</span>
                  {!badge.earned && <Badge variant="secondary" className="mt-2 text-[10px] px-1.5 py-0">Locked</Badge>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Settings & Integrations */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Integrations</CardTitle>
              <CardDescription>Connect devices for automated tracking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg"><Activity className="h-4 w-4 text-blue-500" /></div>
                  <span className="text-sm font-medium">Fitbit</span>
                </div>
                <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">Connected</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/10 rounded-lg"><Car className="h-4 w-4 text-red-500" /></div>
                  <span className="text-sm font-medium">Tesla</span>
                </div>
                <Button variant="ghost" size="sm" className="h-7 text-xs">Connect</Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-500/10 rounded-lg"><Zap className="h-4 w-4 text-yellow-500" /></div>
                  <span className="text-sm font-medium">Google Home</span>
                </div>
                <Button variant="ghost" size="sm" className="h-7 text-xs">Connect</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications" className="flex flex-col gap-1">
                  <span>Push Notifications</span>
                  <span className="font-normal text-xs text-muted-foreground">Weekly reports and alerts</span>
                </Label>
                <Switch id="notifications" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="units" className="flex flex-col gap-1">
                  <span>Imperial Units</span>
                  <span className="font-normal text-xs text-muted-foreground">Use lbs, miles, gallons</span>
                </Label>
                <Switch id="units" />
              </div>
              
              <div className="pt-4 mt-4 border-t border-border">
                <Button variant="outline" className="w-full text-destructive border-destructive/50 hover:bg-destructive/10">Sign Out</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
