import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { ThemeProvider } from "@/components/ThemeProvider";

import { LandingLayout } from "@/components/layout/LandingLayout";
import { AppLayout } from "@/components/layout/AppLayout";

import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import DashboardPage from "@/pages/DashboardPage";
import AIAssistantPage from "@/pages/AIAssistantPage";
import CalculatorPage from "@/pages/CalculatorPage";
import WasteAnalyzerPage from "@/pages/WasteAnalyzerPage";
import WaterTrackerPage from "@/pages/WaterTrackerPage";
import EnergyPage from "@/pages/EnergyPage";
import CommunityPage from "@/pages/CommunityPage";
import ChallengesPage from "@/pages/ChallengesPage";
import ReportsPage from "@/pages/ReportsPage";
import ProfilePage from "@/pages/ProfilePage";
import EcoCoachPage from "@/pages/EcoCoachPage";
import WasteScannerPage from "@/pages/WasteScannerPage";
import LeaderboardPage from "@/pages/LeaderboardPage";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/">
        <LandingLayout><LandingPage /></LandingLayout>
      </Route>
      <Route path="/login">
        <LandingLayout><LoginPage /></LandingLayout>
      </Route>
      <Route path="/register">
        <LandingLayout><RegisterPage /></LandingLayout>
      </Route>

      <Route path="/dashboard"><AppLayout><DashboardPage /></AppLayout></Route>
      <Route path="/ai-assistant"><AppLayout><AIAssistantPage /></AppLayout></Route>
      <Route path="/calculator"><AppLayout><CalculatorPage /></AppLayout></Route>
      <Route path="/waste-analyzer"><AppLayout><WasteAnalyzerPage /></AppLayout></Route>
      <Route path="/waste-scanner"><AppLayout><WasteScannerPage /></AppLayout></Route>
      <Route path="/water-tracker"><AppLayout><WaterTrackerPage /></AppLayout></Route>
      <Route path="/energy"><AppLayout><EnergyPage /></AppLayout></Route>
      <Route path="/community"><AppLayout><CommunityPage /></AppLayout></Route>
      <Route path="/challenges"><AppLayout><ChallengesPage /></AppLayout></Route>
      <Route path="/leaderboard"><AppLayout><LeaderboardPage /></AppLayout></Route>
      <Route path="/reports"><AppLayout><ReportsPage /></AppLayout></Route>
      <Route path="/profile"><AppLayout><ProfilePage /></AppLayout></Route>
      <Route path="/eco-coach"><AppLayout><EcoCoachPage /></AppLayout></Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ecosphere-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
