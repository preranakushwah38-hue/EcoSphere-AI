import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, Calculator, Recycle, Droplet, Zap, Users, 
  Target, BarChart3, User, Bot, Moon, Sun, Menu, Leaf,
  BrainCircuit, ScanLine, Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { sampleData } from "@/data/sampleData";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navGroups = [
  {
    label: "OVERVIEW",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "AI Assistant", href: "/ai-assistant", icon: Bot },
      { name: "Eco Coach", href: "/eco-coach", icon: BrainCircuit },
    ]
  },
  {
    label: "TRACK",
    items: [
      { name: "Calculator", href: "/calculator", icon: Calculator },
      { name: "Waste Analyzer", href: "/waste-analyzer", icon: Recycle },
      { name: "Waste Scanner", href: "/waste-scanner", icon: ScanLine },
      { name: "Water Tracker", href: "/water-tracker", icon: Droplet },
      { name: "Energy", href: "/energy", icon: Zap },
    ]
  },
  {
    label: "ENGAGE",
    items: [
      { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
      { name: "Community", href: "/community", icon: Users },
      { name: "Challenges", href: "/challenges", icon: Target },
      { name: "Reports", href: "/reports", icon: BarChart3 },
      { name: "Profile", href: "/profile", icon: User },
    ]
  }
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const NavLinks = () => (
    <div className="flex flex-col space-y-4 py-4">
      {navGroups.map((group, i) => (
        <div key={i}>
          <div className="text-[10px] font-semibold tracking-widest text-muted-foreground/60 uppercase px-3 mb-1 mt-2">
            {group.label}
          </div>
          <div className="flex flex-col space-y-0.5">
            {group.items.map((item) => {
              const isActive = location === item.href;
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm ${
                    isActive 
                      ? "bg-primary text-primary-foreground font-semibold shadow-sm" 
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  }`}
                  data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <item.icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? "text-primary-foreground" : ""}`} />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  const LogoBrand = ({ mobile = false }: { mobile?: boolean }) => (
    <Link href="/dashboard" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
      <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary/20 to-accent/10">
        <Leaf className={`${mobile ? "h-5 w-5" : "h-6 w-6"} text-primary`} />
      </div>
      <span className={`font-bold tracking-tight ${mobile ? "text-base" : "text-lg"}`}>EcoSphere AI</span>
    </Link>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-60 flex-col border-r border-border/60 bg-card shrink-0">
        <div className="p-4 border-b border-border/60">
          <LogoBrand />
        </div>
        
        <div className="px-4 py-3 border-b border-border/60 flex items-center gap-3">
          <Avatar className="h-9 w-9 ring-2 ring-primary ring-offset-2 ring-offset-background shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
              {sampleData.user.initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold truncate">{sampleData.user.name}</span>
            <span className="text-xs text-muted-foreground">Level 7 Eco Champion</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2">
          <NavLinks />
        </div>

        <div className="p-3 border-t border-border/60 mt-auto space-y-2">
          <div className="flex items-center justify-between px-2 py-1.5 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg">
            <div className="flex flex-col">
              <span className="text-xs font-semibold">Pro Plan</span>
              <span className="text-[10px] text-muted-foreground">Impact maximized</span>
            </div>
            <Badge variant="default" className="bg-gradient-to-r from-primary to-accent border-none text-white shadow-sm text-[10px]">PRO</Badge>
          </div>
          
          <div className="flex items-center justify-between px-2">
            <span className="text-xs text-muted-foreground">Theme</span>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Header & Sidebar */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden h-14 border-b border-border/60 bg-card flex items-center justify-between px-4 sticky top-0 z-10">
          <LogoBrand mobile />
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 ring-1 ring-primary ring-offset-1 ring-offset-background">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                {sampleData.user.initials}
              </AvatarFallback>
            </Avatar>
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-60 p-0">
                <div className="p-4 border-b border-border/60">
                  <LogoBrand />
                </div>
                <div className="px-4 py-3 border-b border-border/60 flex items-center gap-3">
                  <Avatar className="h-9 w-9 ring-2 ring-primary ring-offset-2 ring-offset-background">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                      {sampleData.user.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold truncate">{sampleData.user.name}</span>
                    <span className="text-xs text-muted-foreground">Eco Champion</span>
                  </div>
                </div>
                <div className="px-2 overflow-y-auto h-[calc(100vh-220px)]">
                  <NavLinks />
                </div>
                <div className="p-3 border-t border-border/60 absolute bottom-0 w-full bg-background">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2 h-9 text-sm"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  >
                    {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    Toggle Theme
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-5 md:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
