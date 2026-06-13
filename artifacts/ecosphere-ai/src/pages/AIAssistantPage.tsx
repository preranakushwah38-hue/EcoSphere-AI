import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, Leaf, Plus, Trash2, MessageSquare, Sparkles, AlertCircle, RotateCcw } from "lucide-react";
import { sampleData } from "@/data/sampleData";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

interface Conversation {
  id: number;
  title: string;
  createdAt: string;
}

const BASE = "/api";

const SUGGESTED = [
  "How can I reduce my carbon footprint?",
  "Are solar panels worth it?",
  "How can I save water at home?",
  "What's the most eco-friendly diet?",
  "How do I start composting?",
  "What are the best ways to save energy?",
  "How does recycling actually help?",
  "What's the impact of fast fashion?",
];

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1 py-0.5">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-primary/60"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 86400000 && d.getDate() === now.getDate()) return "Today";
  if (diff < 172800000) return "Yesterday";
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

export default function AIAssistantPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loadingConv, setLoadingConv] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Auto-scroll on new content
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, streamingText]);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  async function loadConversations() {
    try {
      const res = await fetch(`${BASE}/gemini/conversations`);
      if (!res.ok) throw new Error("Failed");
      const data: Conversation[] = await res.json();
      setConversations(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch {
      // silently fail — user can still create new conversations
    }
  }

  async function loadConversation(id: number) {
    setLoadingConv(true);
    setError(null);
    try {
      const res = await fetch(`${BASE}/gemini/conversations/${id}`);
      if (!res.ok) throw new Error("Failed");
      const data: { id: number; title: string; createdAt: string; messages: Message[] } = await res.json();
      setActiveConvId(id);
      setMessages(data.messages as Message[]);
    } catch {
      setError("Failed to load conversation.");
    } finally {
      setLoadingConv(false);
    }
  }

  async function createConversation(firstMessage: string) {
    const title = firstMessage.length > 50 ? firstMessage.slice(0, 47) + "…" : firstMessage;
    const res = await fetch(`${BASE}/gemini/conversations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) throw new Error("Failed to create conversation");
    const conv: Conversation = await res.json();
    setConversations((prev) => [conv, ...prev]);
    setActiveConvId(conv.id);
    setMessages([]);
    return conv.id;
  }

  async function deleteConversation(id: number, e: React.MouseEvent) {
    e.stopPropagation();
    try {
      await fetch(`${BASE}/gemini/conversations/${id}`, { method: "DELETE" });
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeConvId === id) {
        setActiveConvId(null);
        setMessages([]);
      }
    } catch {
      // ignore
    }
  }

  const sendMessage = useCallback(async (text: string) => {
    const content = text.trim();
    if (!content || isStreaming) return;
    setInput("");
    setError(null);

    // Optimistically add user message
    const tempUserMsg: Message = {
      id: Date.now(),
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    let convId = activeConvId;
    try {
      if (!convId) {
        convId = await createConversation(content);
      }
    } catch {
      setError("Failed to start conversation. Please try again.");
      setMessages((prev) => prev.filter((m) => m.id !== tempUserMsg.id));
      return;
    }

    // Stream the response
    setIsStreaming(true);
    setStreamingText("");

    abortRef.current = new AbortController();

    try {
      const res = await fetch(`${BASE}/gemini/conversations/${convId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
        signal: abortRef.current.signal,
      });

      if (!res.ok || !res.body) {
        throw new Error("Stream failed");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const payload = JSON.parse(line.slice(6));
            if (payload.done) {
              // Finalize: replace streaming text with real message
              setMessages((prev) => [
                ...prev,
                {
                  id: Date.now(),
                  role: "assistant",
                  content: accumulated,
                  createdAt: new Date().toISOString(),
                },
              ]);
              setStreamingText("");
            } else if (payload.error) {
              setError(payload.error);
              setStreamingText("");
            } else if (payload.content) {
              accumulated += payload.content;
              setStreamingText(accumulated);
            }
          } catch {
            // skip malformed chunk
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError("Something went wrong. Please try again.");
      setStreamingText("");
    } finally {
      setIsStreaming(false);
      inputRef.current?.focus();
    }
  }, [activeConvId, isStreaming]);

  function handleNewChat() {
    if (isStreaming) {
      abortRef.current?.abort();
    }
    setActiveConvId(null);
    setMessages([]);
    setStreamingText("");
    setError(null);
    inputRef.current?.focus();
  }

  const activeConv = conversations.find((c) => c.id === activeConvId);
  const allMessages = isStreaming && streamingText
    ? [...messages, { id: -1, role: "assistant" as const, content: streamingText, createdAt: new Date().toISOString() }]
    : messages;

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)]">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-xl">
          <Bot className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">AI Assistant</h1>
          <p className="text-sm text-muted-foreground hidden sm:block">Powered by Google Gemini</p>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden bg-card border border-border/60 rounded-2xl shadow-sm">
        {/* Sidebar */}
        <div className="hidden md:flex w-72 flex-col border-r border-border/60 bg-muted/10">
          <div className="p-4 border-b border-border/60">
            <Button
              onClick={handleNewChat}
              className="w-full gap-2 bg-gradient-to-r from-primary to-accent text-white border-none shadow-sm hover:opacity-90"
              size="sm"
            >
              <Plus className="h-4 w-4" /> New Conversation
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-3 space-y-1">
              {conversations.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-6 px-4">
                  Your conversations will appear here.
                </p>
              )}
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => loadConversation(conv.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && loadConversation(conv.id)}
                  className={`w-full text-left group flex items-start justify-between gap-2 py-3 px-3 rounded-lg transition-all cursor-pointer ${
                    activeConvId === conv.id
                      ? "bg-primary/10 border border-primary/20"
                      : "hover:bg-muted/50 border border-transparent"
                  }`}
                >
                  <div className="flex items-start gap-2 min-w-0">
                    <MessageSquare className={`h-4 w-4 mt-0.5 shrink-0 ${activeConvId === conv.id ? "text-primary" : "text-muted-foreground"}`} />
                    <div className="min-w-0">
                      <p className={`text-sm font-medium truncate leading-tight ${activeConvId === conv.id ? "text-primary" : "text-foreground"}`}>
                        {conv.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{formatDate(conv.createdAt)}</p>
                    </div>
                  </div>
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => deleteConversation(conv.id, e)}
                    onKeyDown={(e) => e.key === "Enter" && deleteConversation(conv.id, e as unknown as React.MouseEvent)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/10 hover:text-destructive transition-all shrink-0"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-background/50">
          {/* Chat Header */}
          <div className="h-14 border-b border-border/60 flex items-center justify-between px-6 bg-card">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                  <Leaf className="h-4 w-4 text-primary" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-card" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm leading-tight">
                  {activeConv ? activeConv.title : "EcoSphere AI"}
                </span>
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                  {isStreaming ? "Typing..." : "Online"}
                </span>
              </div>
            </div>
            {activeConvId && (
              <Button variant="ghost" size="sm" onClick={handleNewChat} className="gap-1.5 text-xs">
                <Plus className="h-3.5 w-3.5" /> New
              </Button>
            )}
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4 md:p-6" ref={scrollRef}>
            <div className="space-y-6">
              {/* Welcome state */}
              {allMessages.length === 0 && !loadingConv && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-12 text-center gap-4"
                >
                  <div className="p-5 rounded-full bg-gradient-to-br from-primary/20 to-accent/10">
                    <Sparkles className="h-10 w-10 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Ask your Eco Coach anything</h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      Get personalised advice on reducing your carbon footprint, saving energy, water conservation, and more.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg mt-2">
                    {SUGGESTED.slice(0, 4).map((q) => (
                      <button
                        key={q}
                        onClick={() => sendMessage(q)}
                        className="text-left text-sm px-4 py-3 rounded-xl border border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all text-muted-foreground hover:text-foreground"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {loadingConv && (
                <div className="flex items-center justify-center py-16">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Leaf className="h-6 w-6 text-primary" />
                  </motion.div>
                </div>
              )}

              {/* Message list */}
              <AnimatePresence initial={false}>
                {allMessages.map((msg, idx) => (
                  <motion.div
                    key={msg.id === -1 ? `streaming-${idx}` : msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "assistant" && (
                      <Avatar className="h-8 w-8 mt-1 border border-border/40 shrink-0 shadow-sm">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <Leaf className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`max-w-[80%] md:max-w-[72%] flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                      <div className={`p-4 shadow-sm rounded-2xl ${
                        msg.role === "user"
                          ? "bg-gradient-to-br from-primary to-primary/80 text-white rounded-tr-sm"
                          : "bg-muted/70 text-foreground border border-border/40 rounded-tl-sm"
                      }`}>
                        {msg.id === -1 && streamingText === "" ? (
                          <TypingDots />
                        ) : (
                          <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                        )}
                        {msg.id === -1 && msg.content && (
                          <motion.span
                            className="inline-block w-0.5 h-3.5 bg-current ml-0.5 align-middle"
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                          />
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground mt-1 px-1">
                        {formatTime(msg.createdAt)}
                      </span>
                    </div>
                    {msg.role === "user" && (
                      <Avatar className="h-8 w-8 mt-1 border border-border/40 shrink-0 shadow-sm">
                        <AvatarFallback className="bg-muted font-semibold text-muted-foreground">
                          {sampleData.user.initials}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setError(null)}
                    className="ml-auto text-destructive hover:text-destructive hover:bg-destructive/10 gap-1"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Dismiss
                  </Button>
                </motion.div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t border-border/60 bg-card">
            {/* Suggested chips */}
            {allMessages.length === 0 && (
              <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-none">
                {SUGGESTED.slice(4).map((q) => (
                  <Button
                    key={q}
                    variant="outline"
                    size="sm"
                    onClick={() => sendMessage(q)}
                    className="h-8 rounded-full border-primary/30 text-primary bg-primary/5 hover:bg-primary/10 hover:text-primary whitespace-nowrap text-xs"
                  >
                    {q}
                  </Button>
                ))}
              </div>
            )}
            {allMessages.length > 0 && (
              <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-none">
                {SUGGESTED.slice(0, 3).map((q) => (
                  <Button
                    key={q}
                    variant="outline"
                    size="sm"
                    onClick={() => sendMessage(q)}
                    disabled={isStreaming}
                    className="h-7 rounded-full border-primary/30 text-primary bg-primary/5 hover:bg-primary/10 hover:text-primary whitespace-nowrap text-xs"
                  >
                    {q}
                  </Button>
                ))}
              </div>
            )}
            <form
              onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
              className="flex gap-3"
            >
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isStreaming ? "EcoSphere AI is typing…" : "Ask about sustainability, energy, water, diet…"}
                disabled={isStreaming}
                className="flex-1 h-12 rounded-xl border-border/60 bg-background focus-visible:ring-primary/20"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isStreaming}
                className="h-12 w-12 rounded-xl bg-gradient-to-r from-primary to-accent text-white shadow-md hover:opacity-90 shrink-0 border-none disabled:opacity-40"
              >
                {isStreaming ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                    <Leaf className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </form>
            <p className="text-[10px] text-muted-foreground text-center mt-2">
              Powered by Google Gemini · Responses are AI-generated
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
