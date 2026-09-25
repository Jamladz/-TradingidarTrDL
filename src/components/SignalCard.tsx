import { Signal } from '@/src/types/signal';
import { cn } from '@/src/lib/utils';
import { TrendingUp, TrendingDown, Target, ShieldAlert, Clock } from 'lucide-react';

interface SignalCardProps {
  signal: Signal;
  onClick?: () => void;
}

export function SignalCard({ signal, onClick }: SignalCardProps) {
  const isBuy = signal.direction === 'BUY';
  
  const getStatusColor = (status: string) => {
    if (status.includes('TP')) return 'text-green-600 bg-green-50 border-green-100';
    if (status === 'SL HIT') return 'text-red-600 bg-red-50 border-red-100';
    if (status === 'ACTIVE') return 'text-blue-600 bg-blue-50 border-blue-100';
    return 'text-gray-600 bg-gray-50 border-gray-100';
  };

  const getStatusIcon = (status: string) => {
    if (status.includes('TP')) return '🎯';
    if (status === 'SL HIT') return '🔴';
    if (status === 'ACTIVE') return '🟢';
    return '⚪';
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm active:scale-[0.98] transition-transform"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={cn(
              "px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1",
              isBuy ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            )}>
              {isBuy ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {signal.direction} POSITION
            </span>
            <span className="text-sm font-bold text-slate-800">{signal.symbol}</span>
            {isBuy ? '🟢' : '🚨'}
          </div>
          <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
            {signal.signalDate} • {signal.signalTime}
          </div>
        </div>
        <div className={cn(
          "px-3 py-1 rounded-full text-[10px] font-bold border",
          getStatusColor(signal.status)
        )}>
          {getStatusIcon(signal.status)} {signal.status}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Entry Range</div>
          <div className="text-sm font-bold text-slate-800 tracking-tight">
            {signal.openFrom.toFixed(2)} – {signal.openTo.toFixed(2)}
          </div>
        </div>
        <div className="bg-red-50/50 p-3 rounded-xl border border-red-100">
          <div className="text-[10px] text-red-400 font-bold uppercase mb-1 flex items-center gap-1">
            <ShieldAlert size={10} /> Stop Loss
          </div>
          <div className="text-sm font-bold text-red-600 tracking-tight">
            {signal.stopLoss.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400">TP1</span>
            <span className="text-xs font-bold text-slate-800">{signal.tp1.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400">TP2</span>
            <span className="text-xs font-bold text-slate-800">{signal.tp2.toFixed(2)}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400">TP3</span>
            <span className="text-xs font-bold text-slate-800">{signal.tp3.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400">TP4</span>
            <span className="text-xs font-bold text-slate-800">{signal.tp4.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
