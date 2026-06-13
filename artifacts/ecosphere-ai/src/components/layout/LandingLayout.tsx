import { Link } from "wouter";
import { Leaf, Menu, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export function LandingLayout({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2" data-testid="link-logo">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl tracking-tight">EcoSphere AI</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">How it Works</a>
            <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Pricing</a>
          </nav>
          <div className="hidden md:flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login" data-testid="link-login">Log In</Link>
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 shadow-sm border-none" asChild>
              <Link href="/register" data-testid="link-register">Get Started</Link>
            </Button>
          </div>
          
          <div className="md:hidden flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] p-6 flex flex-col">
                <div className="flex items-center gap-2 mb-8">
                  <Leaf className="h-6 w-6 text-primary" />
                  <span className="font-bold text-xl tracking-tight">EcoSphere AI</span>
                </div>
                <nav className="flex flex-col gap-4">
                  <a href="#features" onClick={() => setIsMobileOpen(false)} className="text-lg font-medium text-foreground hover:text-primary">Features</a>
                  <a href="#how-it-works" onClick={() => setIsMobileOpen(false)} className="text-lg font-medium text-foreground hover:text-primary">How it Works</a>
                  <a href="#pricing" onClick={() => setIsMobileOpen(false)} className="text-lg font-medium text-foreground hover:text-primary">Pricing</a>
                </nav>
                <div className="mt-auto flex flex-col gap-4">
                  <Button variant="outline" className="w-full" asChild onClick={() => setIsMobileOpen(false)}>
                    <Link href="/login">Log In</Link>
                  </Button>
                  <Button className="w-full bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 shadow-sm border-none" asChild onClick={() => setIsMobileOpen(false)}>
                    <Link href="/register">Get Started</Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border pt-16 pb-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <Leaf className="h-5 w-5 text-primary" />
                <span className="font-bold text-lg">EcoSphere AI</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                Mission control for your planet footprint. Tracking, analyzing, and improving your environmental impact.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Product</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/calculator" className="hover:text-primary transition-colors">Calculator</Link></li>
                <li><Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
                <li><Link href="/community" className="hover:text-primary transition-colors">Community</Link></li>
                <li><Link href="/challenges" className="hover:text-primary transition-colors">Challenges</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Company</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><span className="hover:text-primary cursor-pointer transition-colors">About Us</span></li>
                <li><span className="hover:text-primary cursor-pointer transition-colors">Blog</span></li>
                <li><span className="hover:text-primary cursor-pointer transition-colors">Careers</span></li>
                <li><span className="hover:text-primary cursor-pointer transition-colors">Contact</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Resources</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><span className="hover:text-primary cursor-pointer transition-colors">Documentation</span></li>
                <li><span className="hover:text-primary cursor-pointer transition-colors">API</span></li>
                <li><span className="hover:text-primary cursor-pointer transition-colors">Status</span></li>
                <li><span className="hover:text-primary cursor-pointer transition-colors">Help Center</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Legal</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><span className="hover:text-primary cursor-pointer transition-colors">Privacy Policy</span></li>
                <li><span className="hover:text-primary cursor-pointer transition-colors">Terms of Service</span></li>
                <li><span className="hover:text-primary cursor-pointer transition-colors">Cookie Policy</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            © 2024 EcoSphere AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
