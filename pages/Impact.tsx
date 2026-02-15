
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trophy, TrendingUp, Zap, Sparkles, Loader2, Award, FileText, Download, ShieldCheck, Building2, Landmark, Star } from 'lucide-react';
import { getImpactInsights, getPredictiveAnalytics, generateCSRReport } from '../services/geminiService';

const RECOVERY_DATA = [
  { name: 'Mon', actual: 120, predicted: 110 },
  { name: 'Tue', actual: 150, predicted: 140 },
  { name: 'Wed', actual: 110, predicted: 130 },
  { name: 'Thu', actual: 200, predicted: 190 },
  { name: 'Fri', actual: 240, predicted: 250 },
  { name: 'Sat', actual: 180, predicted: 170 },
  { name: 'Sun', actual: 210, predicted: 220 },
];

const Impact: React.FC = () => {
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [csrReport, setCsrReport] = useState<any>(null);
  const [loadingCsr, setLoadingCsr] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const insight = await getImpactInsights(1210, 3400);
        setAiInsight(insight || '');
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleGenerateCSR = async () => {
    setLoadingCsr(true);
    try {
      const report = await generateCSRReport({
        name: "Green Plate Catering",
        totalKgSaved: 450,
        peopleServed: 1200,
        co2Reduction: "1.2 tons"
      });
      setCsrReport(report);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingCsr(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900">Impact Hub</h1>
          <p className="text-lg text-slate-500 font-medium">Municipal insights & institutional recognition.</p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={handleGenerateCSR}
             className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all flex items-center gap-2 shadow-xl shadow-slate-200"
           >
             {loadingCsr ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
             Generate CSR Report
           </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Achievements Section */}
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
             <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
               <Award className="w-6 h-6 text-amber-500" />
               Recognition
             </h3>
             <span className="text-[10px] font-black uppercase text-slate-400">Level 12</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'City Guardian', icon: Landmark, color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { name: 'Mass Feeder', icon: Building2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { name: 'Relief Hero', icon: ShieldCheck, color: 'text-red-600', bg: 'bg-red-50' },
              { name: 'Top Verified', icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
            ].map((badge, i) => (
              <div key={i} className={`${badge.bg} p-5 rounded-[32px] flex flex-col items-center text-center gap-3 border border-white group hover:scale-105 transition-transform cursor-pointer`}>
                <badge.icon className={`w-8 h-8 ${badge.color} group-hover:rotate-12 transition-transform`} />
                <p className="text-[10px] font-black uppercase tracking-widest leading-tight">{badge.name}</p>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-slate-50">
             <div className="bg-emerald-50 p-4 rounded-2xl flex items-center justify-between">
                <div>
                   <p className="text-[10px] font-black text-emerald-700 uppercase">Impact Certificate</p>
                   <p className="text-xs font-bold text-emerald-900">Ready for Download</p>
                </div>
                <button className="p-3 bg-white text-emerald-600 rounded-xl shadow-sm hover:bg-emerald-600 hover:text-white transition-all">
                   <Download className="w-4 h-4" />
                </button>
             </div>
          </div>
        </div>

        {/* Prediction Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-slate-800">Community Supply Analytics</h3>
            <div className="flex items-center gap-2 bg-slate-50 px-4 py-1.5 rounded-full">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
               <span className="text-[10px] font-black uppercase text-slate-500">Live Municipal Feed</span>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={RECOVERY_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                <Area type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={4} fill="#10b981" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
             {[
               { label: 'Saved', val: '1.2t', icon: Zap, bg: 'bg-amber-50', c: 'text-amber-600' },
               { label: 'Impact', val: '8.4k', icon: Trophy, bg: 'bg-indigo-50', c: 'text-indigo-600' },
               { label: 'Relief', val: '12', icon: ShieldCheck, bg: 'bg-red-50', c: 'text-red-600' },
               { label: 'CO2', val: '4.5t', icon: TrendingUp, bg: 'bg-emerald-50', c: 'text-emerald-600' },
             ].map((s, i) => (
               <div key={i} className={`${s.bg} p-4 rounded-3xl`}>
                  <p className="text-lg font-black text-slate-900">{s.val}</p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">{s.label}</p>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* AI CSR Report Preview */}
      {csrReport && (
        <div className="bg-slate-900 text-white p-12 rounded-[50px] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-500">
           <div className="absolute top-0 right-0 p-12 opacity-10">
              <Landmark className="w-64 h-64" />
           </div>
           <div className="relative z-10 grid md:grid-cols-2 gap-12">
              <div className="space-y-8">
                 <div className="flex items-center gap-3">
                    <div className="bg-emerald-500 p-3 rounded-2xl">
                       <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                       <h4 className="text-2xl font-black">AI CSR Sustainability Report</h4>
                       <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Powered by Gemini AI</p>
                    </div>
                 </div>
                 <div className="p-8 bg-white/5 backdrop-blur-md rounded-[32px] border border-white/10">
                    <p className="text-sm leading-relaxed text-slate-300 font-medium italic">
                      "{csrReport.executiveSummary}"
                    </p>
                 </div>
              </div>
              <div className="space-y-8 flex flex-col justify-center">
                 <div className="grid grid-cols-2 gap-6">
                    <div>
                       <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Social Vision</p>
                       <p className="text-sm font-bold text-slate-200">{csrReport.visionStatement}</p>
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-2">Tax/Audit Benefit</p>
                       <p className="text-sm font-bold text-slate-200">{csrReport.taxBenefitNote}</p>
                    </div>
                 </div>
                 <button className="w-full py-5 bg-emerald-600 text-white rounded-3xl font-black flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-900/40">
                    <Download className="w-5 h-5" />
                    Download Official Record
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Impact;
