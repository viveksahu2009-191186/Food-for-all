
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Leaf, Users, ShieldCheck, HeartPulse, MapPin, Zap, 
  AlertCircle, Building2, Trophy, Camera, Upload, Loader2, 
  CheckCircle2, Trash2, Clock, Info, ShieldAlert, ClipboardCheck, 
  AlertTriangle, Landmark, FileText, Send, Radio, Sparkles
} from 'lucide-react';
import { analyzeFoodDonation } from '../services/geminiService';
import { FoodCategory, FoodType, RiskLevel } from '../types';

const RECIPIENTS = [
  { id: 'ngo1', name: 'Akshaya Patra', type: 'Mass Kitchen', icon: '🍲', color: 'bg-orange-50' },
  { id: 'ngo2', name: 'Feed the City', type: 'Distribution', icon: '🏙️', color: 'bg-blue-50' },
  { id: 'ngo3', name: 'St. Mary Shelter', type: 'Homeless Care', icon: '🏠', color: 'bg-purple-50' },
  { id: 'ngo4', name: 'Global Relief', type: 'Disaster NGO', icon: '🌍', color: 'bg-red-50' },
];

const Home: React.FC = () => {
  // Donation State
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<string | null>(null);
  const [pingStatus, setPingStatus] = useState<'idle' | 'pinging' | 'sent'>('idle');
  
  const [checklist, setChecklist] = useState({
    fresh: false,
    sealed: false,
    tempControlled: false,
    cleanEnvironment: false
  });

  const [formData, setFormData] = useState({
    title: '',
    category: FoodCategory.COOKED,
    foodType: FoodType.VEG,
    quantity: '',
    prepTime: '',
    expiryWindow: '',
    location: 'Current Location (Regent St, London)'
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!description && !image) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeFoodDonation(description, image || undefined);
      setAnalysisResult(result);
      setFormData(prev => ({
        ...prev,
        title: result.suggestedTitle,
        category: result.category as FoodCategory || FoodCategory.COOKED,
        foodType: result.foodType as FoodType || FoodType.VEG,
        prepTime: result.prepTime,
        expiryWindow: result.expiryWindow
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePing = (id: string) => {
    setSelectedRecipient(id);
    setPingStatus('pinging');
    // Immediate simulated feedback for "ping"
    setTimeout(() => {
      setPingStatus('sent');
      setTimeout(() => setPingStatus('idle'), 3000);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!Object.values(checklist).every(Boolean)) {
      alert("Please complete the hygiene checklist before listing.");
      return;
    }
    if (!selectedRecipient) {
      alert("Please select a recipient to ping for pickup.");
      return;
    }
    setIsSubmitted(true);
  };

  return (
    <div className="animate-in fade-in duration-1000">
      {/* Relief Mode Alert */}
      <div className="bg-red-600 text-white py-3 px-4 overflow-hidden relative shadow-lg z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
           <div className="flex items-center gap-3">
             <AlertCircle className="w-4 h-4 text-white animate-pulse" />
             <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] whitespace-nowrap">
               Emergency Relief Mode Active: <span className="opacity-80">Coordination in South District</span>
             </p>
           </div>
           <Link to="/explore" className="text-[10px] font-black uppercase border-b border-white hover:opacity-70 transition-opacity">Join Response</Link>
        </div>
      </div>

      {/* Hero / Donation Section - Starts with Donate */}
      <section className="relative py-12 md:py-24 px-4 overflow-hidden bg-slate-50">
        <div className="absolute top-0 right-0 -z-10 w-1/3 h-full bg-emerald-50 rounded-l-[100px] blur-3xl opacity-50" />
        <div className="max-w-7xl mx-auto">
          {isSubmitted ? (
            <div className="max-w-xl mx-auto py-20 px-4 text-center animate-in zoom-in duration-500">
              <div className="bg-emerald-100 p-8 rounded-full w-28 h-28 flex items-center justify-center mx-auto mb-8 text-emerald-600 shadow-inner relative">
                <div className="ripple"></div>
                <CheckCircle2 className="w-16 h-16 relative z-10" />
              </div>
              <h2 className="text-4xl font-black mb-4 text-slate-900">Mission Active!</h2>
              <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                We've alerted <span className="font-bold text-slate-800">{RECIPIENTS.find(r => r.id === selectedRecipient)?.name}</span>. Their transport team is synchronizing with your location.
              </p>
              <button 
                onClick={() => { 
                  setIsSubmitted(false); 
                  setAnalysisResult(null); 
                  setImage(null); 
                  setDescription('');
                  setSelectedRecipient(null);
                  setChecklist({fresh: false, sealed: false, tempControlled: false, cleanEnvironment: false});
                }}
                className="px-10 py-4 bg-emerald-600 text-white rounded-[24px] font-black hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 active:scale-95"
              >
                List Another Donation
              </button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              <div className="space-y-10 animate-in slide-in-from-left duration-700">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-black uppercase tracking-widest">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Real-time Community Feeding</span>
                  </div>
                  <h1 className="text-5xl md:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter">
                    Donate <br />
                    <span className="text-emerald-600">Surplus.</span>
                  </h1>
                  <p className="text-xl text-slate-500 max-w-lg leading-relaxed font-medium">
                    Bridge the gap between waste and want. One snap, one ping, and you've fed a family.
                  </p>
                </div>

                {/* Recipient NGO Selection - Always visible for immediate "Ping" */}
                <div className="space-y-4 pt-4 border-t border-slate-200 stagger-1 animate-in slide-in-from-bottom-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                      <Radio className="w-4 h-4 text-emerald-500" />
                      Immediate Recipients
                    </h3>
                    {pingStatus === 'sent' && (
                      <span className="text-[10px] font-black text-emerald-600 uppercase flex items-center gap-1 animate-pulse">
                        <CheckCircle2 className="w-3 h-3" /> Signal Logged
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {RECIPIENTS.map(ngo => (
                      <button
                        key={ngo.id}
                        type="button"
                        onClick={() => handlePing(ngo.id)}
                        className={`p-4 rounded-3xl border-2 transition-all duration-300 flex items-center gap-4 relative overflow-hidden group ${
                          selectedRecipient === ngo.id 
                            ? 'border-emerald-500 bg-emerald-50 shadow-lg scale-105' 
                            : 'border-white bg-white hover:border-emerald-200 hover:shadow-md'
                        }`}
                      >
                        <span className="text-3xl group-hover:scale-125 transition-transform">{ngo.icon}</span>
                        <div className="text-left">
                           <p className="text-sm font-black text-slate-800">{ngo.name}</p>
                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{ngo.type}</p>
                        </div>
                        {selectedRecipient === ngo.id && (
                          <div className="absolute top-2 right-2">
                            <Zap className="w-3 h-3 text-emerald-500 animate-pulse fill-current" />
                          </div>
                        )}
                        {pingStatus === 'pinging' && selectedRecipient === ngo.id && (
                          <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-[1px] flex items-center justify-center">
                            <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-10 pt-4 stagger-2 animate-in slide-in-from-bottom-4">
                  <div className="group">
                    <p className="text-4xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors">25k+</p>
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Meals Saved</p>
                  </div>
                  <div className="h-12 w-px bg-slate-200" />
                  <div className="group">
                    <p className="text-4xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors">1.2k</p>
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Active Donors</p>
                  </div>
                </div>
              </div>

              {/* Right side: The Dynamic Form */}
              <div className="bg-white rounded-[50px] border border-slate-100 p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] relative animate-in slide-in-from-right duration-700 stagger-1">
                <div className="absolute -top-6 -right-6 bg-amber-400 text-amber-950 px-5 py-2.5 rounded-[20px] font-black text-xs shadow-xl flex items-center gap-2 animate-float">
                  <Zap className="w-4 h-4 fill-current" /> AI CORE
                </div>

                <div className="mb-10 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black text-slate-900">Food Listing</h3>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => fileInputRef.current?.click()} 
                        className={`p-4 rounded-2xl transition-all duration-300 border ${
                          image ? 'bg-emerald-100 border-emerald-300 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100'
                        }`}
                      >
                        {image ? <CheckCircle2 className="w-6 h-6" /> : <Camera className="w-6 h-6" />}
                      </button>
                    </div>
                  </div>
                  
                  {image && (
                    <div className="relative group rounded-[32px] overflow-hidden aspect-video shadow-inner animate-in zoom-in duration-300">
                      <img src={image} className="w-full h-full object-cover" alt="Preview" />
                      <button 
                        onClick={() => setImage(null)} 
                        className="absolute top-4 right-4 p-3 bg-white/20 backdrop-blur-md text-white rounded-2xl hover:bg-red-500 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  )}

                  <div className="relative">
                    <textarea 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="e.g. 50 servings of veg curry prepared 1hr ago..."
                      className="w-full h-32 p-6 rounded-[32px] border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-emerald-500 outline-none transition-all resize-none text-sm font-bold placeholder:font-medium shadow-inner"
                    />
                    <div className="absolute bottom-4 right-4">
                      <button 
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || (!description && !image)}
                        className="px-6 py-2.5 bg-slate-900 text-white rounded-2xl font-black text-xs flex items-center gap-2 hover:bg-emerald-600 disabled:opacity-30 transition-all shadow-xl shadow-slate-200"
                      >
                        {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                        {analysisResult ? "Update AI Sync" : "Verify Safety"}
                      </button>
                    </div>
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                </div>

                {analysisResult ? (
                  <form onSubmit={handleSubmit} className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="p-6 bg-emerald-50 rounded-[32px] border border-emerald-100 flex gap-4">
                      <div className="bg-emerald-600 p-3 rounded-2xl h-fit shadow-lg shadow-emerald-200">
                        <Zap className="w-5 h-5 text-white fill-current" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-emerald-900 uppercase tracking-[0.1em]">AI Assessment</p>
                        <p className="text-sm text-emerald-800 leading-snug mt-1 font-medium">{analysisResult.shortSummary}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-2">Estimated Life</label>
                        <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          <Clock className="w-4 h-4 text-emerald-500" />
                          <input value={formData.expiryWindow} onChange={e => setFormData({...formData, expiryWindow: e.target.value})} className="bg-transparent text-xs font-black outline-none w-full" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-2">Food Class</label>
                        <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          <Leaf className="w-4 h-4 text-emerald-500" />
                          <select value={formData.foodType} onChange={e => setFormData({...formData, foodType: e.target.value as FoodType})} className="bg-transparent text-xs font-black outline-none w-full appearance-none">
                            {Object.values(FoodType).map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Mandatory Compliance</p>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { id: 'fresh', label: 'Fresh' },
                          { id: 'sealed', label: 'Sealed' },
                          { id: 'tempControlled', label: 'Heated' },
                          { id: 'cleanEnvironment', label: 'Sanitized' },
                        ].map(item => (
                          <label key={item.id} className={`flex items-center gap-3 cursor-pointer p-3 rounded-[20px] transition-all border ${
                            (checklist as any)[item.id] ? 'bg-emerald-50 border-emerald-100 shadow-sm' : 'bg-slate-50 border-transparent hover:border-slate-200'
                          }`}>
                            <input 
                              type="checkbox" 
                              checked={(checklist as any)[item.id]} 
                              onChange={e => setChecklist({...checklist, [item.id]: e.target.checked})} 
                              className="w-5 h-5 rounded-[6px] border-slate-200 text-emerald-600 focus:ring-0" 
                            />
                            <span className="text-[11px] font-black text-slate-600 uppercase tracking-tight">{item.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <button type="submit" className="w-full py-5 bg-emerald-600 text-white rounded-[28px] font-black text-lg shadow-[0_20px_40px_-12px_rgba(16,185,129,0.3)] hover:bg-emerald-700 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3">
                      <Send className="w-5 h-5" />
                      Post Donation & Ping NGO
                    </button>
                  </form>
                ) : (
                  <div className="py-20 border-4 border-dashed border-slate-50 rounded-[40px] flex flex-col items-center justify-center text-slate-300 text-center px-8 transition-opacity duration-500">
                    <ShieldAlert className="w-16 h-16 mb-6 opacity-5 flex shrink-0" />
                    <p className="text-lg font-black text-slate-400">Security Verification Needed</p>
                    <p className="text-xs mt-2 font-bold leading-relaxed max-w-[240px]">
                      Our AI needs to verify hygiene and risk levels before we alert the network.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Stats & Impact Summary */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: FileText, title: "CSR Readiness", desc: "Automated sustainability reports for corporate auditing and social credit." },
              { icon: Trophy, title: "Community Rank", desc: "Earn prestige badges like 'Life Saver' or 'Guardian' for consistent impact." },
              { icon: Landmark, title: "City Integration", desc: "Directly synced with municipal emergency relief and local smart city hubs." }
            ].map((f, i) => (
              <div key={i} className="p-12 rounded-[50px] bg-slate-50 hover:bg-emerald-50 transition-all duration-500 border border-slate-100 group text-center hover:shadow-2xl hover:shadow-emerald-100/40">
                <div className="bg-white p-5 rounded-[24px] w-fit mx-auto shadow-sm mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all">
                   <f.icon className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-black mb-4 text-slate-800">{f.title}</h3>
                <p className="text-slate-500 text-base leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
