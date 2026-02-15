
import React from 'react';
import { MapPin, Clock, Info, ShieldAlert, Utensils, Zap, Star, ShieldCheck } from 'lucide-react';
import { FoodItem, DonationStatus, FoodType, RiskLevel } from '../types';

interface FoodCardProps {
  item: FoodItem;
  onSelect?: (item: FoodItem) => void;
  showMatchPriority?: boolean;
}

const FoodCard: React.FC<FoodCardProps> = ({ item, onSelect, showMatchPriority }) => {
  const getStatusColor = (status: DonationStatus) => {
    switch (status) {
      case DonationStatus.AVAILABLE: return 'bg-green-100 text-green-700';
      case DonationStatus.REQUESTED: return 'bg-blue-100 text-blue-700';
      case DonationStatus.CLAIMED_BY_VOLUNTEER: return 'bg-indigo-100 text-indigo-700';
      case DonationStatus.EXPIRED: return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case RiskLevel.LOW: return 'text-emerald-500';
      case RiskLevel.MEDIUM: return 'text-amber-500';
      case RiskLevel.HIGH: return 'text-red-500';
      default: return 'text-slate-400';
    }
  };

  const getTypeStyles = (type: FoodType) => {
    switch (type) {
      case FoodType.VEG: return 'border-emerald-500 text-emerald-600';
      case FoodType.NON_VEG: return 'border-red-500 text-red-600';
      case FoodType.VEGAN: return 'border-teal-500 text-teal-600';
      default: return 'border-slate-300 text-slate-500';
    }
  };

  return (
    <div 
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col h-full relative"
      onClick={() => onSelect?.(item)}
    >
      <div className="relative h-44 overflow-hidden shrink-0">
        <img 
          src={item.imageUrl} 
          alt={item.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-2 pr-12">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm uppercase ${getStatusColor(item.status)}`}>
            {item.status}
          </span>
          <span className="bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-700 shadow-sm uppercase flex items-center gap-1">
            <ShieldCheck className={`w-3 h-3 ${getRiskColor(item.riskLevel)}`} />
            {item.riskLevel}
          </span>
        </div>
        
        <div className={`absolute top-3 right-3 bg-white w-6 h-6 rounded flex items-center justify-center border-2 ${getTypeStyles(item.foodType)} shadow-sm`}>
          <div className={`w-2 h-2 rounded-full ${item.foodType === FoodType.NON_VEG ? 'bg-red-500' : 'bg-emerald-500'}`} />
        </div>

        {showMatchPriority && item.priorityScore && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-amber-500 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg animate-pulse">
            <Zap className="w-3 h-3 fill-current" />
            {item.priorityScore}% Match
          </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start gap-2 mb-1">
          <h3 className="text-base font-bold text-slate-800 line-clamp-1">{item.title}</h3>
          <div className="flex items-center gap-1 shrink-0 bg-slate-50 px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-600">
            <Star className="w-2.5 h-2.5 text-amber-500 fill-current" />
            {item.donorRating}
          </div>
        </div>
        
        <p className="text-slate-500 text-xs mb-3 line-clamp-2 h-8">{item.description}</p>
        
        <div className="space-y-1.5 mb-4 flex-grow">
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <MapPin className="w-3 h-3 text-emerald-500" />
            <span className="line-clamp-1">{item.location.address}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <Clock className="w-3 h-3 text-emerald-500" />
            <span>Ends: <span className="font-semibold text-slate-700">{item.expiryWindow}</span></span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <Utensils className="w-3 h-3 text-emerald-500" />
            <span>Prep: <span className="font-semibold text-slate-700">{item.prepTime}</span></span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-[10px] font-bold">
              {item.donorName.charAt(0)}
            </div>
            <span className="text-[10px] font-medium text-slate-700 truncate max-w-[80px]">{item.donorName}</span>
          </div>
          <button className="bg-emerald-600 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm">
            Reserve
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
