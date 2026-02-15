
import React, { useState, useRef } from 'react';
// Added ShieldAlert to the lucide-react imports
import { Camera, Upload, Loader2, CheckCircle2, AlertCircle, Trash2, MapPin, Clock, Info, ShieldCheck, ClipboardCheck, AlertTriangle, ShieldAlert } from 'lucide-react';
import { analyzeFoodDonation } from '../services/geminiService';
import { FoodCategory, FoodType, RiskLevel } from '../types';

const Donate: React.FC = () => {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Hygiene Checklist
  const [checklist, setChecklist] = useState({
    fresh: false,
    sealed: false,
    tempControlled: false,
    cleanEnvironment: false
  });

  // Custom states for the form
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
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!Object.values(checklist).every(Boolean)) {
      alert("Please complete the hygiene checklist before listing.");
      return;
    }
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center animate-in zoom-in duration-300">
        <div className="bg-emerald-100 p-8 rounded-full w-28 h-28 flex items-center justify-center mx-auto mb-8 text-emerald-600 shadow-inner">
          <CheckCircle2 className="w-16 h-16" />
        </div>
        <h2 className="text-4xl font-black mb-4 text-slate-900">Trust Verified!</h2>
        <p className="text-slate-500 text-lg mb-8 leading-relaxed">
          Your donation has been verified for safety and is now live. Recipients can see your hygiene commitment.
        </p>
        <button 
          onClick={() => { 
            setIsSubmitted(false); 
            setAnalysisResult(null); 
            setImage(null); 
            setDescription('');
            setChecklist({fresh: false, sealed: false, tempControlled: false, cleanEnvironment: false});
          }}
          className="px-10 py-4 bg-emerald-600 text-white rounded-[20px] font-black hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200"
        >
          List New Item
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black mb-2 text-slate-900">Verified Donation</h1>
          <p className="text-slate-500 font-medium">Hygiene-first community sharing powered by AI.</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl max-w-sm">
          <div className="flex items-center gap-2 mb-1">
            <Info className="w-4 h-4 text-amber-600" />
            <p className="text-xs font-black text-amber-900 uppercase tracking-widest">Donor Guidelines</p>
          </div>
          <p className="text-[10px] text-amber-800 font-medium leading-relaxed">
            Ensure food is prepared in a sanitized environment. Use clean, leak-proof containers. Avoid listing high-risk raw items.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800">
              <Camera className="w-5 h-5 text-emerald-600" />
              1. Document the Food
            </h3>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`aspect-square rounded-[40px] border-4 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 overflow-hidden relative shadow-sm ${
                image ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-emerald-300 bg-white'
              }`}
            >
              {image ? (
                <div className="w-full h-full group">
                  <img src={image} className="w-full h-full object-cover" alt="Preview" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <button 
                        onClick={(e) => { e.stopPropagation(); setImage(null); }}
                        className="p-4 bg-white/20 backdrop-blur-md text-white rounded-3xl hover:bg-white/30 transition-colors"
                      >
                        <Trash2 className="w-6 h-6" />
                      </button>
                  </div>
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black shadow-sm">
                    {new Date().toLocaleString()}
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4 p-8">
                  <div className="p-6 bg-slate-50 rounded-full w-fit mx-auto shadow-sm group-hover:scale-110 transition-transform">
                    <Upload className="w-10 h-10 text-slate-300" />
                  </div>
                  <div>
                    <p className="font-black text-slate-700">Drop food photo</p>
                    <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">AI verification required</p>
                  </div>
                </div>
              )}
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800">
              <ClipboardCheck className="w-5 h-5 text-emerald-600" />
              2. Hygiene Checklist
            </h3>
            <div className="bg-white p-6 rounded-[32px] border border-slate-100 space-y-3 shadow-sm">
              {[
                { id: 'fresh', label: 'Food is fresh and fits for consumption' },
                { id: 'sealed', label: 'Containers are clean and leak-proof' },
                { id: 'tempControlled', label: 'Stored at appropriate temperature' },
                { id: 'cleanEnvironment', label: 'Prepared in a sanitized area' },
              ].map(item => (
                <label key={item.id} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={(checklist as any)[item.id]} 
                    onChange={e => setChecklist({...checklist, [item.id]: e.target.checked})}
                    className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 transition-all"
                  />
                  <span className="text-xs font-bold text-slate-600 group-hover:text-emerald-700 transition-colors">
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800">
              <Info className="w-5 h-5 text-emerald-600" />
              3. Describe & Verify
            </h3>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. 5kg fresh rice prepared 1hr ago at wedding. Pure veg. Stored in high-grade containers."
              className="w-full h-32 p-6 rounded-[28px] border-2 border-slate-100 bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all resize-none text-slate-700 font-medium placeholder:text-slate-300"
            />
            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || (!description && !image)}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-slate-800 disabled:opacity-50 transition-all shadow-xl shadow-slate-200 group"
            >
              {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5 group-hover:scale-125 transition-transform" />}
              Analyze Risk Level
            </button>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className={`bg-white rounded-[40px] border border-slate-100 p-8 md:p-12 shadow-sm transition-all duration-500 ${!analysisResult ? 'opacity-30 pointer-events-none' : 'opacity-100 shadow-2xl'}`}>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black">AI Trust Report</h3>
              {analysisResult && (
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm ${
                  analysisResult.riskLevel === 'High Risk' ? 'bg-red-50 text-red-600' :
                  analysisResult.riskLevel === 'Moderate Risk' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                }`}>
                  <AlertTriangle className="w-3 h-3" />
                  {analysisResult.riskLevel}
                </div>
              )}
            </div>

            {analysisResult && analysisResult.riskLevel === 'High Risk' && (
              <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-2xl flex gap-3 animate-bounce-subtle">
                <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />
                <div>
                  <p className="text-sm font-black text-red-900">High Risk Listing Warning</p>
                  <p className="text-xs text-red-800 leading-relaxed font-medium">
                    {analysisResult.safetyNotes}
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Listing Title</label>
                  <input 
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full p-4 rounded-xl bg-slate-50 border border-slate-100 font-bold focus:bg-white focus:border-emerald-500 transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Food Type</label>
                  <div className="flex bg-slate-50 p-1 rounded-xl gap-1">
                    {Object.values(FoodType).map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({...formData, foodType: type})}
                        className={`flex-1 py-2.5 rounded-lg text-[10px] font-black transition-all uppercase ${formData.foodType === type ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quantity</label>
                  <input 
                    placeholder="e.g. 50 servings"
                    value={formData.quantity}
                    onChange={e => setFormData({...formData, quantity: e.target.value})}
                    className="w-full p-4 rounded-xl bg-slate-50 border border-slate-100 font-bold focus:bg-white focus:border-emerald-500 transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Prep Time</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      value={formData.prepTime}
                      onChange={e => setFormData({...formData, prepTime: e.target.value})}
                      className="w-full p-4 pl-12 rounded-xl bg-slate-50 border border-slate-100 font-bold focus:bg-white focus:border-emerald-500 transition-all outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shelf Life</label>
                  <input 
                    value={formData.expiryWindow}
                    onChange={e => setFormData({...formData, expiryWindow: e.target.value})}
                    className="w-full p-4 rounded-xl bg-slate-50 border border-slate-100 font-bold focus:bg-white focus:border-emerald-500 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pickup Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                  <input 
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                    className="w-full p-4 pl-12 rounded-xl bg-slate-50 border border-slate-100 font-bold focus:bg-white focus:border-emerald-500 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-[28px] border border-slate-100 space-y-3">
                <div className="flex items-center gap-2">
                   <ShieldCheck className="w-5 h-5 text-indigo-600" />
                   <p className="text-sm font-black text-slate-900 uppercase tracking-widest">AI Safety Assessment</p>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  "{analysisResult?.shortSummary}"
                  <br /><br />
                  <strong>Guidance:</strong> {analysisResult?.safetyNotes}
                </p>
              </div>

              <button 
                type="submit"
                disabled={analysisResult?.riskLevel === 'High Risk'}
                className={`w-full py-5 rounded-3xl font-black text-lg transition-all shadow-2xl active:scale-[0.98] ${
                  analysisResult?.riskLevel === 'High Risk' 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200'
                }`}
              >
                {analysisResult?.riskLevel === 'High Risk' ? "Safety Rejection" : "Confirm Community Posting"}
              </button>
            </form>
          </div>
          
          {!analysisResult && (
            <div className="h-full min-h-[600px] border-4 border-dashed border-slate-100 rounded-[40px] flex flex-col items-center justify-center p-12 text-center text-slate-300">
              <div className="bg-slate-50 p-6 rounded-full mb-6">
                 <ShieldAlert className="w-12 h-12 opacity-20" />
              </div>
              <p className="font-black text-slate-400 text-xl">Compliance Check Pending</p>
              <p className="text-sm max-w-[280px] mt-2 font-medium">Complete the documentation steps to trigger our AI hygiene and risk assessment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Donate;
