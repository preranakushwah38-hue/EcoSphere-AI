import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, Leaf, Car, Home, ShoppingBag, CheckCircle2, Flame } from "lucide-react";
import { sampleData } from "@/data/sampleData";

export default function ChallengesPage() {
  const getIcon = (category: string) => {
    switch (category) {
      case 'Food': return <Leaf className="h-6 w-6 text-primary" />;
      case 'Transport': return <Car className="h-6 w-6 text-accent" />;
      case 'Home': return <Home className="h-6 w-6 text-yellow-500" />;
      case 'Shopping': return <ShoppingBag className="h-6 w-6 text-purple-500" />;
      default: return <Target className="h-6 w-6" />;
    }
  };

  const getIconBg = (category: string) => {
    switch (category) {
      case 'Food': return "bg-primary/10";
      case 'Transport': return "bg-accent/10";
      case 'Home': return "bg-yellow-500/10";
      case 'Shopping': return "bg-purple-500/10";
      default: return "bg-muted";
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy': return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
      case 'Medium': return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20";
      case 'Hard': return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
      default: return "";
    }
  };

  const ChallengeGrid = ({ challenges }: { challenges: typeof sampleData.challenges }) => (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {challenges.map((challenge) => (
        <Card 
          key={challenge.id} 
          className={`flex flex-col shadow-sm transition-all hover:shadow-md ${
            challenge.status === 'Completed' ? 'opacity-75 grayscale-[0.3] border-t-2 border-t-green-500' : 
            challenge.status === 'Ongoing' ? 'border-t-2 border-t-primary' : ''
          }`}
        >
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${getIconBg(challenge.category)}`}>
                {getIcon(challenge.category)}
              </div>
              <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
                {challenge.difficulty}
              </Badge>
            </div>
            <CardTitle className="text-xl">{challenge.title}</CardTitle>
            <CardDescription className="text-sm text-primary font-medium mt-1">{challenge.impact}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-4 space-y-5">
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-muted-foreground">Reward</span>
              <span className="text-accent bg-accent/10 px-2 py-0.5 rounded text-xs font-bold">+{challenge.xp} XP</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-muted-foreground">Progress</span>
                <span>{challenge.progress}%</span>
              </div>
              <Progress 
                value={challenge.progress} 
                className={`h-2.5 ${challenge.status === 'Completed' ? '[&>div]:bg-green-500' : ''}`} 
              />
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            {challenge.status === 'Completed' ? (
              <Button variant="secondary" className="w-full gap-2 cursor-default font-semibold text-green-600 bg-green-500/10 hover:bg-green-500/10 border-none" disabled>
                <CheckCircle2 className="h-5 w-5" /> Completed
              </Button>
            ) : challenge.status === 'Ongoing' ? (
              <Button variant="outline" className="w-full text-primary border-primary/50 hover:bg-primary/10 font-semibold">
                Update Progress
              </Button>
            ) : (
              <Button className="w-full bg-primary text-primary-foreground font-semibold shadow-sm hover:opacity-90">
                Join Challenge
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Target className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Challenges</h1>
            <p className="text-sm text-muted-foreground">Complete goals to level up your impact</p>
          </div>
        </div>
        <div className="bg-card px-5 py-3 rounded-xl flex items-center gap-3 border border-border shadow-sm">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Active Streak</span>
            <span className="text-lg font-bold text-orange-500 leading-none">12 Days</span>
          </div>
          <div className="p-2 bg-orange-500/10 rounded-full">
            <Flame className="h-6 w-6 text-orange-500" />
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6 h-12 p-1 bg-muted/50 border border-border/50">
          <TabsTrigger value="all" className="rounded-md px-6 font-medium">All Challenges</TabsTrigger>
          <TabsTrigger value="ongoing" className="rounded-md px-6 font-medium">Ongoing</TabsTrigger>
          <TabsTrigger value="completed" className="rounded-md px-6 font-medium">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <ChallengeGrid challenges={sampleData.challenges} />
        </TabsContent>
        <TabsContent value="ongoing" className="mt-0">
          <ChallengeGrid challenges={sampleData.challenges.filter(c => c.status === 'Ongoing')} />
        </TabsContent>
        <TabsContent value="completed" className="mt-0">
          <ChallengeGrid challenges={sampleData.challenges.filter(c => c.status === 'Completed')} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
