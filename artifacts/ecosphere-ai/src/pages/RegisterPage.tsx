import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { Leaf, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Column - Hidden on mobile */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary/90 to-accent/70 p-12 text-white flex-col justify-between">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
            <Leaf className="h-8 w-8 text-white" />
          </div>
          <span className="font-bold text-2xl tracking-tight">EcoSphere AI</span>
        </Link>
        
        <div className="space-y-8 max-w-md">
          <h1 className="text-5xl font-bold leading-tight">Join the movement.</h1>
          <p className="text-xl text-white/80">Start tracking, reducing, and optimizing your environmental footprint today.</p>
          
          <ul className="space-y-4 pt-8">
            {["Access to the full AI sustainability assistant", "Connect utilities for automatic tracking", "Join a global community of eco-champions"].map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-white/80 shrink-0" />
                <span className="text-lg text-white/90">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="text-sm text-white/60">
          © 2024 EcoSphere AI. All rights reserved.
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-card">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="space-y-2 text-center md:text-left">
            <div className="flex justify-center md:hidden mb-6">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <Leaf className="h-10 w-10 text-primary" />
              </div>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Create an account</h2>
            <p className="text-muted-foreground">Start your sustainability journey</p>
          </div>
          
          <div className="space-y-5">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" className="h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" className="h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" className="h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirm-password" type="password" className="h-11" />
              </div>
            </div>
            
            <div className="flex items-start space-x-3 pt-2">
              <Checkbox id="terms" className="mt-1" />
              <Label htmlFor="terms" className="text-sm font-normal text-muted-foreground leading-snug">
                I pledge to reduce my environmental impact and agree to the Terms of Service.
              </Label>
            </div>
            
            <Button className="w-full h-11 text-base bg-gradient-to-r from-primary to-primary/80 text-white border-none shadow-sm mt-4" asChild>
              <Link href="/dashboard">Sign Up</Link>
            </Button>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/60" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground font-medium">Or continue with</span>
              </div>
            </div>
            
            <Button variant="outline" className="w-full h-11 border-2 gap-3 font-medium hover:bg-muted/50">
              <span className="text-lg font-bold">G</span> Sign up with Google
            </Button>
          </div>
          
          <div className="text-center text-sm text-muted-foreground mt-8">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">Sign in</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
