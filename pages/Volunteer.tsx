
import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Package, Clock, Phone, ChevronRight, CheckCircle2, User, Star, Navigation, Zap, Loader2 } from 'lucide-react';
import { getRouteOptimizationInsight } from '../services/geminiService';

interface Task {
  id: string;
  donorName: string;
  recipientName: string;
  item: string;
  pickupAddress: string;
  deliveryAddress: string;
  status: 'pending' | 'active' | 'completed';
  time: string;
}

const TASKS: Task[] = [
  {
    id: 't1',
    donorName: 'Royal Palace Hall',
    recipientName: 'City Hope Shelter',
    item: '50x Biryani Packets',
    pickupAddress: '45 Mall Rd, London',
    deliveryAddress: '22 Shelter Row, London',
    status: 'pending',
    time: 'Prepared 1hr ago'
  },
  {
    id: 't2',
    donorName: 'Fresh Bakery',
    recipientName: 'Community Kitchen',
    item: '12x Assorted Muffins',
    pickupAddress: '10 High St, London',
    deliveryAddress: '88 Soup St, London',
    status: 'active',
    time: 'Pickup by 6 PM'
  }
];

const Volunteer: React.FC = () => {
  const [activeTasks, setActiveTasks] = useState(TASKS);
  const [routeInsight, setRouteInsight] = useState<string>('');
  const [loadingInsight, setLoadingInsight] = useState(false);

  useEffect(() => {
    const activeTask = activeTasks.find(t => t.status === 'active');
    if (activeTask) {
      setLoadingInsight(true);
      getRouteOptimizationInsight(activeTask.pickupAddress, activeTask.deliveryAddress)
        .then(res => setRouteInsight(res || ''))
        .finally(() => setLoadingInsight(false));
    }
  }, [activeTasks]);

  const handleClaim = (id: string) => {
    setActiveTasks(prev => prev.map(t => t.id === id ? {...t, status: 'active'} : t));
  };

  const handleComplete = (id: string) => {
    setActiveTasks(prev => prev.map(t => t.id === id ? {...t, status: 'completed'} : t));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">Fleet Operations</h1>
          <p className="text-slate-500 font-medium">AI-optimized routes for maximum community impact.</p>
        </div>
        <div className="bg-white px-6 py-4 rounded-[24px] border border-slate-100 flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
            <User className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Driver Rating</p>
            <div className="flex items-center gap-1">
              <span className="font-black text-slate-800">128</span>
              <Star className="w-3 h-3 text-amber-500 fill-current" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping" />
            Available Assignemnts
          </h3>
          <div className="space-y-4">
            {activeTasks.filter(t => t.status === 'pending').map(task => (
              <div key={task.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                <div className="flex flex-col md:flex-row gap-6 md:items-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-emerald-50 transition-colors">
                    <Package className="w-8 h-8 text-slate-300 group-hover:text-emerald-500" />
                  </div>
                  <div className="flex-grow space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-slate-800 text-lg">{task.item}</h4>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-black uppercase tracking-widest">{task.time}</span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                        From: <span className="font-bold text-slate-700">{task.donorName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <Truck className="w-3.5 h-3.5 text-blue-500" />
                        To: <span className="font-bold text-slate-700">{task.recipientName}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleClaim(task.id)}
                    className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-emerald-600 transition-all flex items-center gap-2 group-hover:translate-x-1"
                  >
                    Accept
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Optimized Routing</h3>
          {activeTasks.filter(t => t.status === 'active').map(task => (
            <div key={task.id} className="bg-emerald-600 text-white p-8 rounded-[40px] shadow-xl shadow-emerald-100 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                 <Truck className="w-32 h-32" />
               </div>
               <div className="relative z-10 space-y-8">
                 <div className="flex items-start justify-between">
                   <div>
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-70">Active Mission</p>
                     <h4 className="text-2xl font-black">{task.item}</h4>
                   </div>
                   <div className="flex gap-2">
                     <button className="p-3 bg-white/20 rounded-2xl backdrop-blur-md hover:bg-white/30 transition-colors">
                       <Phone className="w-5 h-5" />
                     </button>
                     <button className="p-3 bg-white/20 rounded-2xl backdrop-blur-md hover:bg-white/30 transition-colors">
                       <Navigation className="w-5 h-5" />
                     </button>
                   </div>
                 </div>

                 <div className="bg-white/10 p-5 rounded-[28px] border border-white/10 space-y-4">
                    <div className="flex items-center gap-2">
                       <Zap className="w-4 h-4 text-emerald-300" />
                       <p className="text-[10px] font-black uppercase tracking-widest text-emerald-200">AI Route Intelligence</p>
                    </div>
                    {loadingInsight ? (
                      <div className="flex items-center gap-3">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <p className="text-xs font-bold animate-pulse">Calculating optimal path...</p>
                      </div>
                    ) : (
                      <p className="text-xs font-bold leading-relaxed">
                        {routeInsight || "Optimizing pickup sequence to minimize fuel and time."}
                      </p>
                    )}
                 </div>

                 <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-white" />
                        <div className="w-0.5 h-12 bg-white/30 my-1 border-dashed border-l" />
                        <div className="w-3 h-3 border-2 border-white rounded-full" />
                      </div>
                      <div className="space-y-6 flex-grow">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Pick up</p>
                          <p className="font-bold">{task.pickupAddress}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Deliver</p>
                          <p className="font-bold">{task.deliveryAddress}</p>
                        </div>
                      </div>
                    </div>
                 </div>

                 <button 
                  onClick={() => handleComplete(task.id)}
                  className="w-full py-4 bg-white text-emerald-700 rounded-2xl font-black shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                 >
                   <CheckCircle2 className="w-5 h-5" />
                   Confirm Delivery
                 </button>
               </div>
            </div>
          ))}
          {activeTasks.filter(t => t.status === 'active').length === 0 && (
            <div className="py-20 border-2 border-dashed border-slate-100 rounded-[40px] flex flex-col items-center justify-center text-slate-300 gap-4">
              <Package className="w-12 h-12 opacity-10" />
              <p className="font-black text-sm uppercase tracking-widest">No active deliveries</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Volunteer;
