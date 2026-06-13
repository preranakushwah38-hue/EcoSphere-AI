import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Calculator, 
  Recycle, 
  Droplet, 
  Zap, 
  Users, 
  Target, 
  BarChart3, 
  User,
  Bot,
  Moon,
  Sun,
  Menu,
  Leaf
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
    ]
  },
  {
    label: "TRACK",
    items: [
      { name: "Calculator", href: "/calculator", icon: Calculator },
      { name: "Waste Analyzer", href: "/waste-analyzer", icon: Recycle },
      { name: "Water Tracker", href: "/water-tracker", icon: Droplet },
      { name: "Energy", href: "/energy", icon: Zap },
    ]
  },
  {
    label: "ENGAGE",
    items: [
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
          <div className="flex flex-col space-y-1">
            {group.items.map((item) => {
              const isActive = location === item.href;
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all ${
                    isActive 
                      ? "bg-primary text-primary-foreground font-medium shadow-sm" 
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  }`}
                  data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <item.icon className={`h-5 w-5 ${isActive ? "text-primary-foreground" : ""}`} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border/60 bg-card">
        <div className="p-4 border-b border-border/60 flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary/20 to-accent/10">
            <Leaf className="h-6 w-6 text-primary" />
          </div>
          <span className="font-bold text-lg tracking-tight">EcoSphere AI</span>
        </div>
        
        <div className="px-4 py-4 border-b border-border/60 flex items-center gap-3">
          <Avatar className="h-10 w-10 ring-2 ring-primary ring-offset-2 ring-offset-background">
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {sampleData.user.initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{sampleData.user.name}</span>
            <span className="text-xs text-muted-foreground">Level 7 Eco Champion</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3">
          <NavLinks />
        </div>

        <div className="p-4 border-t border-border/60 mt-auto">
          <div className="flex items-center justify-between mb-4 p-3 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg">
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Pro Plan</span>
              <span className="text-xs text-muted-foreground">Impact maximized</span>
            </div>
            <Badge variant="default" className="bg-gradient-to-r from-primary to-accent border-none text-white shadow-sm">PRO</Badge>
          </div>
          
          <div className="flex items-center justify-between px-2">
            <span className="text-sm text-muted-foreground">Theme</span>
            <Button 
              variant="ghost" 
              size="icon" 
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
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary/20 to-accent/10">
              <Leaf className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold">EcoSphere</span>
          </div>
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
              <SheetContent side="left" className="w-64 p-0">
                <div className="p-4 border-b border-border/60 flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary/20 to-accent/10">
                    <Leaf className="h-6 w-6 text-primary" />
                  </div>
                  <span className="font-bold text-lg">EcoSphere AI</span>
                </div>
                <div className="px-4 py-4 border-b border-border/60 flex items-center gap-3">
                  <Avatar className="h-10 w-10 ring-2 ring-primary ring-offset-2 ring-offset-background">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {sampleData.user.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{sampleData.user.name}</span>
                    <span className="text-xs text-muted-foreground">Eco Champion</span>
                  </div>
                </div>
                <div className="px-3 overflow-y-auto h-[calc(100vh-210px)]">
                  <NavLinks />
                </div>
                <div className="p-4 border-t border-border/60 absolute bottom-0 w-full bg-background">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2"
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

        <main className="flex-1 overflow-auto p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
