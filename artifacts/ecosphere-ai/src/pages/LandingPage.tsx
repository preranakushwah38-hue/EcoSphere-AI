import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Leaf, Globe, Zap, Users, Droplet, Recycle, BarChart3, Check, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* SECTION 1: HERO */}
      <section className="relative overflow-hidden bg-background pt-28 pb-36">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?q=80&w=2560&auto=format&fit=crop')] bg-cover bg-center opacity-5 dark:opacity-10 pointer-events-none" />
        
        {/* Animated Gradient Mesh */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full animate-pulse pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[50%] bg-accent/20 blur-[120px] rounded-full animate-pulse pointer-events-none delay-1000" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Your Planet's Mission Control
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              EcoSphere AI is the premium sustainability intelligence platform. Track your carbon footprint, optimize your resources, and make a real difference.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Button size="lg" className="h-14 px-8 bg-gradient-to-r from-primary to-accent text-white border-none shadow-lg text-lg hover:opacity-90 transition-opacity" asChild>
                <Link href="/register">Start Your Journey</Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-border/60 hover:bg-muted/50" asChild>
                <Link href="/dashboard">View Demo</Link>
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground max-w-md mx-auto">
              <span>10,482 Users</span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span>2.4M kg CO2 Saved</span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span>4.2 Avg Score</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: STATS TICKER */}
      <section className="bg-foreground/5 border-y border-border/50 py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1">10,482</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Active Users</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-accent mb-1">2.4M kg</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">CO2 Reduced</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1">98%</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">User Satisfaction</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-accent mb-1">150+</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: FEATURES */}
      <section className="py-28 bg-background" id="features">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="text-primary text-xs font-semibold tracking-widest uppercase mb-3">FEATURES</div>
            <h2 className="text-3xl md:text-4xl font-bold">Intelligence for a Better World</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Globe, title: "Carbon Tracking", desc: "Real-time analysis of your daily emissions from transport to food." },
              { icon: Zap, title: "Energy Optimization", desc: "AI-driven insights to reduce your home energy consumption and bills." },
              { icon: Users, title: "Community Impact", desc: "Join thousands of others in global challenges and climb the leaderboard." },
              { icon: Droplet, title: "Water Conservation", desc: "Monitor daily water usage and discover actionable saving opportunities." },
              { icon: Recycle, title: "Waste Intelligence", desc: "Smart categorization tools to improve your recycling diversion rate." },
              { icon: BarChart3, title: "Sustainability Reports", desc: "Weekly comprehensive breakdowns of your overall environmental impact." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.1 }}
                className="bg-card p-8 rounded-2xl border border-border/60 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="p-3 rounded-xl bg-primary/10 w-fit mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: HOW IT WORKS */}
      <section className="py-28 bg-muted/40" id="how-it-works">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">Three simple steps to transform your environmental footprint.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-1/2 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 -translate-y-1/2 z-0" />
            
            {[
              { num: "1", title: "Track", desc: "Connect your data sources. Monitor carbon, water, energy and waste in one place.", icon: BarChart3 },
              { num: "2", title: "Analyze", desc: "Our AI processes your data and identifies patterns and opportunities for improvement.", icon: Zap },
              { num: "3", title: "Improve", desc: "Get personalized actions, join community challenges, and watch your score rise.", icon: Leaf }
            ].map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center">
                <div className="text-6xl font-black text-primary/20 mb-4">{step.num}</div>
                <div className="w-16 h-16 rounded-full bg-background border-4 border-primary flex items-center justify-center mb-6 shadow-md">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground px-4">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: PRICING */}
      <section className="py-28 bg-background" id="pricing">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Choose the plan that fits your sustainability journey.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Tier */}
            <Card className="flex flex-col border-border/60">
              <CardHeader>
                <CardTitle className="text-2xl">Basic</CardTitle>
                <CardDescription>Perfect for getting started</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {["Basic tracking", "3 categories", "Community access", "Standard support"].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Pro Tier */}
            <Card className="flex flex-col border-primary/30 shadow-lg relative bg-gradient-to-b from-primary/5 to-transparent">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Badge className="bg-gradient-to-r from-primary to-accent text-white border-none px-3 py-1">Most Popular</Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Pro</CardTitle>
                <CardDescription>For maximum impact</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$9</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {["All categories tracked", "AI assistant", "Weekly reports", "Priority support"].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-gradient-to-r from-primary to-accent text-white border-none shadow-md hover:opacity-90" asChild>
                  <Link href="/register">Start Free Trial</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Team Tier */}
            <Card className="flex flex-col border-border/60">
              <CardHeader>
                <CardTitle className="text-2xl">Team</CardTitle>
                <CardDescription>For households & groups</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$29</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {["Everything in Pro", "Team dashboard", "API access", "Custom reports"].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/register">Contact Sales</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* SECTION 6: CTA BANNER */}
      <section className="py-24 bg-gradient-to-r from-primary to-accent">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to reduce your impact?</h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Join 10,000+ people already making a difference every single day.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="h-14 px-8 bg-white text-primary hover:bg-white/90 text-lg shadow-lg" asChild>
              <Link href="/register">
                Start for Free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white text-white hover:bg-white/10 hover:text-white" asChild>
              <Link href="/dashboard">View Demo</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
