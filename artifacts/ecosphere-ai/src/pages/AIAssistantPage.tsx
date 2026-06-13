import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Send, User, Leaf } from "lucide-react";
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
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center gap-2 mb-4">
        <Bot className="h-6 w-6 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">AI Assistant</h1>
      </div>
      
      <div className="flex-1 flex overflow-hidden bg-card border border-border rounded-xl shadow-sm">
        {/* Sidebar */}
        <div className="hidden md:flex w-64 flex-col border-r border-border bg-muted/20">
          <div className="p-4 border-b border-border font-semibold">Conversations</div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-2">
              <Button variant="secondary" className="w-full justify-start font-normal">Reducing Diet Carbon</Button>
              <Button variant="ghost" className="w-full justify-start font-normal">Solar Panel ROI</Button>
              <Button variant="ghost" className="w-full justify-start font-normal">Winter Heating Tips</Button>
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 max-w-[80%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                  <Avatar className="h-8 w-8 mt-1 border border-border">
                    {msg.sender === 'user' ? (
                      <AvatarFallback className="bg-primary/10 text-primary">U</AvatarFallback>
                    ) : (
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Leaf className="h-4 w-4" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className={`rounded-xl p-3 ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t border-border bg-card">
            <div className="flex gap-2 mb-2">
              <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => setInput("How can I save water?")}>How can I save water?</Button>
              <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => setInput("Are solar panels worth it?")}>Are solar panels worth it?</Button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
              <Input 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                placeholder="Ask about reducing your footprint..." 
                className="flex-1"
              />
              <Button type="submit" size="icon" className="bg-primary shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
