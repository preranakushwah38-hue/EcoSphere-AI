import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Leaf, Globe, Zap, Users } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative overflow-hidden bg-background pt-24 pb-32">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?q=80&w=2560&auto=format&fit=crop')] bg-cover bg-center opacity-5 dark:opacity-10 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Your Planet's Mission Control
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              EcoSphere AI is the premium sustainability intelligence platform. Track your carbon footprint, optimize your resources, and make a real difference.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" className="h-12 px-8 bg-primary text-primary-foreground text-lg" asChild>
                <Link href="/register">Start Your Journey</Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg" asChild>
                <Link href="/dashboard">View Demo</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-muted/30" id="features">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Intelligence for a Better World</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Globe, title: "Carbon Tracking", desc: "Real-time analysis of your daily emissions." },
              { icon: Zap, title: "Energy Optimization", desc: "AI-driven insights to reduce energy consumption." },
              { icon: Users, title: "Community Impact", desc: "Join thousands of others in global challenges." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card p-6 rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-shadow"
              >
                <feature.icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
