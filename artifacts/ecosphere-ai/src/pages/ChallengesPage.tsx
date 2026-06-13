import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, Leaf, Car, Home, ShoppingBag, CheckCircle2 } from "lucide-react";
import { sampleData } from "@/data/sampleData";

export default function ChallengesPage() {
  const getIcon = (category: string) => {
    switch (category) {
      case 'Food': return <Leaf className="h-5 w-5 text-primary" />;
      case 'Transport': return <Car className="h-5 w-5 text-accent" />;
      case 'Home': return <Home className="h-5 w-5 text-yellow-500" />;
      case 'Shopping': return <ShoppingBag className="h-5 w-5 text-purple-500" />;
      default: return <Target className="h-5 w-5" />;
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Target className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Challenges</h1>
        </div>
        <div className="bg-muted px-4 py-2 rounded-lg flex items-center gap-2 border border-border">
          <span className="text-sm font-medium">Active Streak:</span>
          <span className="text-lg font-bold text-orange-500">12 Days</span>
          <span className="text-xl">🔥</span>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Challenges</TabsTrigger>
          <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sampleData.challenges.map((challenge) => (
            <Card key={challenge.id} className={`flex flex-col ${challenge.status === 'Completed' ? 'opacity-70 grayscale-[0.5]' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <div className="p-2 bg-muted rounded-lg border border-border">
                    {getIcon(challenge.category)}
                  </div>
                  <Badge variant="outline" className={getDifficultyColor(challenge.difficulty)}>
                    {challenge.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{challenge.title}</CardTitle>
                <CardDescription className="text-sm text-primary font-medium">{challenge.impact}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pb-3 space-y-4">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-muted-foreground">Reward</span>
                  <span className="text-accent">+{challenge.xp} XP</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span>{challenge.progress}%</span>
                  </div>
                  <Progress value={challenge.progress} className={`h-2 ${challenge.status === 'Completed' ? '[&>div]:bg-muted-foreground' : ''}`} />
                </div>
              </CardContent>
              <CardFooter>
                {challenge.status === 'Completed' ? (
                  <Button variant="secondary" className="w-full gap-2 cursor-default" disabled>
                    <CheckCircle2 className="h-4 w-4 text-green-500" /> Completed
                  </Button>
                ) : challenge.status === 'Ongoing' ? (
                  <Button variant="outline" className="w-full text-primary border-primary hover:bg-primary/5">
                    Update Progress
                  </Button>
                ) : (
                  <Button className="w-full bg-primary text-primary-foreground">
                    Join Challenge
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
