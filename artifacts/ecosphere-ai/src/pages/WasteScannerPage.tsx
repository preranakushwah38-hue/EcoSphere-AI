import { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import {
  ScanLine, Upload, Camera, Leaf, Package, Layers,
  CircleDot, Cpu, Recycle, AlertTriangle, CheckCircle2,
  Lightbulb, Trash2, X, Loader2, Sparkles, RotateCcw
} from "lucide-react";

interface ClassificationResult {
  wasteType: "Plastic" | "Paper" | "Glass" | "Metal" | "Organic" | "E-Waste" | "Mixed" | "Unknown";
  confidence: number;
  recyclable: boolean;
  sustainabilityGrade: "A" | "B" | "C" | "D" | "F";
  recyclingInstructions: string;
  environmentalImpact: string;
  disposalRecommendations: string;
  funFact: string;
}

const WASTE_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string; border: string }> = {
  Plastic: { icon: Layers, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/30" },
  Paper: { icon: Package, color: "text-yellow-600", bg: "bg-yellow-500/10", border: "border-yellow-500/30" },
  Glass: { icon: CircleDot, color: "text-cyan-500", bg: "bg-cyan-500/10", border: "border-cyan-500/30" },
  Metal: { icon: Layers, color: "text-slate-500", bg: "bg-slate-500/10", border: "border-slate-500/30" },
  Organic: { icon: Leaf, color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/30" },
  "E-Waste": { icon: Cpu, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/30" },
  Mixed: { icon: Trash2, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/30" },
  Unknown: { icon: AlertTriangle, color: "text-muted-foreground", bg: "bg-muted", border: "border-border" },
};

const GRADE_COLORS: Record<string, string> = {
  A: "bg-green-500 text-white",
  B: "bg-lime-500 text-white",
  C: "bg-yellow-500 text-white",
  D: "bg-orange-500 text-white",
  F: "bg-red-500 text-white",
};

export default function WasteScannerPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState("image/jpeg");
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) { setError("Please upload an image file."); return; }
    setMimeType(file.type || "image/jpeg");
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImagePreview(dataUrl);
      const base64 = dataUrl.split(",")[1];
      setImageBase64(base64);
      setResult(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }, []);

  const handleClassify = async () => {
    if (!imageBase64) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/waste-scanner/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64, mimeType }),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error ?? "Classification failed");
      }
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImagePreview(null);
    setImageBase64(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const wasteConfig = result ? (WASTE_CONFIG[result.wasteType] ?? WASTE_CONFIG.Unknown) : null;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-xl">
          <ScanLine className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">AI Waste Scanner</h1>
          <p className="text-sm text-muted-foreground">Upload or photograph any waste to get instant AI classification</p>
        </div>
        <Badge className="ml-auto bg-gradient-to-r from-primary to-accent text-white border-none shadow-sm">
          <Sparkles className="h-3 w-3 mr-1" /> Gemini Vision
        </Badge>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upload Panel */}
        <div className="space-y-4">
          {/* Hidden inputs */}
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
          <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onFileChange} />

          {!imagePreview ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex flex-col items-center justify-center gap-4 p-10 rounded-2xl border-2 border-dashed transition-all cursor-pointer min-h-[300px]
                ${isDragging
                  ? "border-primary bg-primary/10 scale-[1.01]"
                  : "border-border/60 bg-muted/20 hover:bg-muted/40 hover:border-primary/50"
                }`}
            >
              <motion.div
                animate={{ y: isDragging ? -8 : 0 }}
                className="p-5 rounded-full bg-primary/10 border border-primary/20"
              >
                <Upload className="h-10 w-10 text-primary" />
              </motion.div>
              <div className="text-center">
                <p className="font-semibold text-foreground">Drop an image here</p>
                <p className="text-sm text-muted-foreground mt-1">or click to browse your files</p>
              </div>
              <p className="text-xs text-muted-foreground">Supports JPG, PNG, WebP, HEIC</p>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="relative rounded-2xl overflow-hidden border border-border shadow-sm bg-muted/20">
              <img src={imagePreview} alt="Uploaded waste" className="w-full object-contain max-h-[320px]" />
              <button
                onClick={handleReset}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-sm hover:bg-background transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
              {result && wasteConfig && (
                <div className={`absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-full border ${wasteConfig.bg} ${wasteConfig.border} backdrop-blur-sm`}>
                  <wasteConfig.icon className={`h-4 w-4 ${wasteConfig.color}`} />
                  <span className={`text-sm font-bold ${wasteConfig.color}`}>{result.wasteType}</span>
                </div>
              )}
            </motion.div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 gap-2 h-11" onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4" /> Upload Photo
            </Button>
            <Button variant="outline" className="flex-1 gap-2 h-11" onClick={() => cameraInputRef.current?.click()}>
              <Camera className="h-4 w-4" /> Use Camera
            </Button>
          </div>

          {imageBase64 && !loading && (
            <Button
              onClick={handleClassify}
              disabled={loading}
              className="w-full h-12 gap-2 text-base bg-gradient-to-r from-primary to-accent text-white border-none shadow-md hover:opacity-90"
            >
              <ScanLine className="h-5 w-5" /> Classify with AI
            </Button>
          )}

          {loading && (
            <div className="flex items-center justify-center gap-3 py-4 bg-primary/5 rounded-xl border border-primary/20">
              <Loader2 className="h-5 w-5 text-primary animate-spin" />
              <p className="text-sm font-medium text-primary">Analyzing with Gemini Vision...</p>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {/* Supported waste types */}
          {!result && (
            <Card className="bg-muted/30 border-border/50">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Classifies 6 Waste Types</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {(["Plastic", "Paper", "Glass", "Metal", "Organic", "E-Waste"] as const).map((type) => {
                    const cfg = WASTE_CONFIG[type];
                    return (
                      <div key={type} className={`flex items-center gap-2 p-2 rounded-lg ${cfg.bg} border ${cfg.border}`}>
                        <cfg.icon className={`h-4 w-4 ${cfg.color} shrink-0`} />
                        <span className={`text-xs font-medium ${cfg.color}`}>{type}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Results Panel */}
        <AnimatePresence mode="wait">
          {result && wasteConfig ? (
            <motion.div key="result" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              {/* Main classification card */}
              <Card className={`border-2 ${wasteConfig.border} shadow-md overflow-hidden`}>
                <div className={`h-1.5 w-full bg-gradient-to-r from-primary to-accent`} />
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl ${wasteConfig.bg} border ${wasteConfig.border}`}>
                        <wasteConfig.icon className={`h-7 w-7 ${wasteConfig.color}`} />
                      </div>
                      <div>
                        <h2 className={`text-2xl font-bold ${wasteConfig.color}`}>{result.wasteType}</h2>
                        <div className="flex items-center gap-2 mt-1">
                          {result.recyclable
                            ? <Badge className="bg-green-500/10 text-green-600 border-green-500/20 text-xs"><CheckCircle2 className="h-3 w-3 mr-1" /> Recyclable</Badge>
                            : <Badge className="bg-red-500/10 text-red-600 border-red-500/20 text-xs"><AlertTriangle className="h-3 w-3 mr-1" /> Non-Recyclable</Badge>
                          }
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black ${GRADE_COLORS[result.sustainabilityGrade] ?? "bg-muted"} shadow-sm`}>
                        {result.sustainabilityGrade}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Grade</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-muted-foreground">AI Confidence</span>
                      <span className="font-bold tabular-nums">{result.confidence}%</span>
                    </div>
                    <Progress value={result.confidence} className={`h-3 rounded-full ${result.confidence >= 80 ? "[&>div]:bg-green-500" : result.confidence >= 50 ? "[&>div]:bg-yellow-500" : "[&>div]:bg-red-500"}`} />
                  </div>
                </CardContent>
              </Card>

              {/* Recycling Instructions */}
              <Card className="shadow-sm">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-500/10 rounded-lg shrink-0">
                      <Recycle className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm mb-1">Recycling Instructions</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{result.recyclingInstructions}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Environmental Impact */}
              <Card className="shadow-sm">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-destructive/10 rounded-lg shrink-0">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm mb-1">Environmental Impact</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{result.environmentalImpact}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Disposal */}
              <Card className="shadow-sm">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-accent/10 rounded-lg shrink-0">
                      <Trash2 className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm mb-1">Where to Dispose</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{result.disposalRecommendations}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Fun Fact */}
              <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20 shadow-sm">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                      <Lightbulb className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm mb-1 text-primary">Did You Know?</h3>
                      <p className="text-sm text-foreground leading-relaxed">{result.funFact}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button variant="outline" onClick={handleReset} className="w-full gap-2 h-10">
                <RotateCcw className="h-4 w-4" /> Scan Another Item
              </Button>
            </motion.div>
          ) : !loading && !imageBase64 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full min-h-[420px] gap-5">
              <div className="p-6 rounded-full bg-muted/50 border border-border">
                <ScanLine className="h-12 w-12 text-muted-foreground/50" />
              </div>
              <div className="text-center space-y-1">
                <p className="font-semibold text-foreground">No image scanned yet</p>
                <p className="text-sm text-muted-foreground">Upload or photograph waste to see AI classification results here</p>
              </div>
              <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
                {[
                  { label: "6 categories", sub: "classified" },
                  { label: "AI confidence", sub: "percentage" },
                  { label: "Recycling guide", sub: "step-by-step" },
                  { label: "Eco impact", sub: "assessment" },
                ].map(({ label, sub }) => (
                  <div key={label} className="p-3 rounded-xl bg-muted/30 border border-border/50 text-center">
                    <p className="text-sm font-semibold">{label}</p>
                    <p className="text-xs text-muted-foreground">{sub}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
