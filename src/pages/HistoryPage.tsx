import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/src/firebase';
import { Signal } from '@/src/types/signal';
import { SignalCard } from '@/src/components/SignalCard';

export function HistoryPage() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'signals'),
      where('published', '==', true),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const signalData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Signal[];
      setSignals(signalData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Group by date
  const groupedSignals = signals.reduce((groups: { [key: string]: Signal[] }, signal) => {
    const date = signal.signalDate;
    if (!groups[date]) groups[date] = [];
    groups[date].push(signal);
    return groups;
  }, {});

  return (
    <div className="p-5 max-w-md mx-auto">
      <header className="mb-8 pt-4">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Signal <span className="text-slate-400">History</span>
        </h1>
        <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mt-1">Previous Trading Sessions</p>
      </header>

      {loading ? (
        <div className="space-y-8">
          {[1, 2].map(i => (
            <div key={i}>
              <div className="h-4 w-32 bg-slate-100 rounded animate-pulse mb-4" />
              <div className="space-y-4">
                <div className="h-64 bg-white rounded-2xl animate-pulse border border-slate-100" />
              </div>
            </div>
          ))}
        </div>
      ) : Object.keys(groupedSignals).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(groupedSignals).map(([date, signals]) => (
            <div key={date}>
              <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                {date}
              </h2>
              <div className="space-y-4">
                {signals.map((signal) => (
                  <SignalCard key={signal.id} signal={signal} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-2xl">
            📅
          </div>
          <h3 className="text-slate-900 font-bold text-lg">No Signal History</h3>
          <p className="text-slate-400 text-sm max-w-[200px] mt-1">
            Completed signals will be archived here.
          </p>
        </div>
      )}
    </div>
  );
}
