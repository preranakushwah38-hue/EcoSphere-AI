import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Send, Leaf } from "lucide-react";
import { sampleData } from "@/data/sampleData";

export default function AIAssistantPage() {
  const [messages, setMessages] = useState(sampleData.chatMessages);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newUserMsg = {
      id: messages.length + 1,
      sender: "user",
      text: input
    };
    
    setMessages(prev => [...prev, newUserMsg]);
    setInput("");

    // Simulate AI typing
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: prev.length + 2,
        sender: "ai",
        text: "That's a great question! I'm analyzing your request and will provide personalized sustainability recommendations shortly."
      }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)]">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-xl">
          <Bot className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">AI Assistant</h1>
          <p className="text-sm text-muted-foreground hidden sm:block">Powered by sustainability intelligence</p>
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden bg-card border border-border/60 rounded-2xl shadow-sm">
        {/* Sidebar */}
        <div className="hidden md:flex w-72 flex-col border-r border-border/60 bg-muted/10">
          <div className="p-5 border-b border-border/60">
            <h3 className="font-semibold text-foreground">Conversations</h3>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-2">
              <Button variant="ghost" className="w-full justify-start flex-col items-start h-auto py-3 px-4 border-l-2 border-primary bg-primary/5 hover:bg-primary/10 rounded-r-lg rounded-l-none">
                <span className="font-medium text-foreground">Reducing Diet Carbon</span>
                <span className="text-xs text-muted-foreground mt-1">Today, 10:42 AM</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start flex-col items-start h-auto py-3 px-4 rounded-lg hover:bg-muted/50">
                <span className="font-medium text-foreground">Solar Panel ROI</span>
                <span className="text-xs text-muted-foreground mt-1">Yesterday</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start flex-col items-start h-auto py-3 px-4 rounded-lg hover:bg-muted/50">
                <span className="font-medium text-foreground">Winter Heating Tips</span>
                <span className="text-xs text-muted-foreground mt-1">Oct 12</span>
              </Button>
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-background/50">
          {/* Internal Header */}
          <div className="h-14 border-b border-border/60 flex items-center px-6 bg-card">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                  <Leaf className="h-4 w-4 text-primary" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-card" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm leading-tight">EcoSphere AI</span>
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Online</span>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4 md:p-6" ref={scrollRef}>
            <div className="space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                  <Avatar className="h-8 w-8 mt-1 border border-border/40 shrink-0 shadow-sm">
                    {msg.sender === 'user' ? (
                      <AvatarFallback className="bg-muted font-semibold text-muted-foreground">{sampleData.user.initials}</AvatarFallback>
                    ) : (
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Leaf className="h-4 w-4" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className={`p-4 shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-gradient-to-br from-primary to-primary/80 text-white rounded-2xl rounded-tr-sm' 
                      : 'bg-muted/70 text-foreground border border-border/40 rounded-2xl rounded-tl-sm'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t border-border/60 bg-card">
            <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-none">
              <Button variant="outline" size="sm" className="h-8 rounded-full border-primary/30 text-primary bg-primary/5 hover:bg-primary/10 hover:text-primary whitespace-nowrap" onClick={() => setInput("How can I save water?")}>
                How can I save water?
              </Button>
              <Button variant="outline" size="sm" className="h-8 rounded-full border-primary/30 text-primary bg-primary/5 hover:bg-primary/10 hover:text-primary whitespace-nowrap" onClick={() => setInput("Are solar panels worth it?")}>
                Are solar panels worth it?
              </Button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-3">
              <Input 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                placeholder="Ask about reducing your footprint..." 
                className="flex-1 h-12 rounded-xl border-border/60 bg-background focus-visible:ring-primary/20"
              />
              <Button type="submit" size="icon" className="h-12 w-12 rounded-xl bg-gradient-to-r from-primary to-accent text-white shadow-md hover:opacity-90 shrink-0 border-none">
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
