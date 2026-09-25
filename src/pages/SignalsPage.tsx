import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '@/src/firebase';
import { Signal } from '@/src/types/signal';
import { SignalCard } from '@/src/components/SignalCard';

export function SignalsPage() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'signals'),
      where('published', '==', true),
      orderBy('createdAt', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const signalData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Signal[];
        setSignals(signalData);
        setLoading(false);
      },
      (error) => {
        console.error('Firestore subscription error:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-5 max-w-md mx-auto">
      <header className="mb-8 pt-4">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Gold <span className="text-yellow-600">Signals</span>
        </h1>
        <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mt-1">XAUUSD Trading Signals</p>
      </header>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="h-64 bg-white rounded-2xl animate-pulse border border-slate-100" />
          ))}
        </div>
      ) : signals.length > 0 ? (
        <div className="space-y-4">
          {signals.map((signal) => (
            <SignalCard key={signal.id} signal={signal} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-2xl">
            📉
          </div>
          <h3 className="text-slate-900 font-bold text-lg">No Active Signals</h3>
          <p className="text-slate-400 text-sm max-w-[200px] mt-1">
            New XAUUSD trading signals will appear here when published.
          </p>
        </div>
      )}
    </div>
  );
}
