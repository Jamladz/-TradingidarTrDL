import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/src/firebase';
import { Signal, SignalStatus, SignalDirection } from '@/src/types/signal';
import { SignalCard } from '@/src/components/SignalCard';
import { Plus, Trash2, Edit3, Send, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { format } from 'date-fns';

export function AdminPage() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSignal, setEditingSignal] = useState<Partial<Signal> | null>(null);

  const initialSignal: Partial<Signal> = {
    direction: 'BUY',
    symbol: 'XAUUSD',
    openFrom: 2000,
    openTo: 2005,
    stopLoss: 1995,
    tp1: 2010,
    tp2: 2020,
    tp3: 2030,
    tp4: 2040,
    status: 'ACTIVE',
    published: false,
  };

  const [formData, setFormData] = useState<Partial<Signal>>(initialSignal);

  useEffect(() => {
    const q = query(collection(db, 'signals'), orderBy('createdAt', 'desc'));
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const data = {
      ...formData,
      updatedAt: serverTimestamp(),
      signalDate: format(now, 'dd MMMM yyyy'),
      signalTime: format(now, 'HH:mm'),
    };

    if (editingSignal?.id) {
      await updateDoc(doc(db, 'signals', editingSignal.id), data);
    } else {
      await addDoc(collection(db, 'signals'), {
        ...data,
        createdAt: serverTimestamp(),
      });
    }

    setFormData(initialSignal);
    setEditingSignal(null);
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this signal?')) {
      await deleteDoc(doc(db, 'signals', id));
    }
  };

  const togglePublish = async (signal: Signal) => {
    await updateDoc(doc(db, 'signals', signal.id), {
      published: !signal.published
    });
  };

  const updateStatus = async (signal: Signal, status: SignalStatus) => {
    await updateDoc(doc(db, 'signals', signal.id), {
      status
    });
  };

  return (
    <div className="p-5 max-w-md mx-auto">
      <header className="mb-8 pt-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Admin <span className="text-yellow-600">Panel</span>
          </h1>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mt-1">Manage Signals</p>
        </div>
        <button 
          onClick={() => {
            setEditingSignal(null);
            setFormData(initialSignal);
            setShowForm(!showForm);
          }}
          className="bg-slate-900 text-white p-3 rounded-2xl shadow-lg shadow-slate-200 active:scale-95 transition-transform"
        >
          {showForm ? <XCircle size={24} /> : <Plus size={24} />}
        </button>
      </header>

      {showForm && (
        <div className="mb-10 bg-white border border-slate-200 rounded-3xl p-6 shadow-xl shadow-slate-100">
          <h2 className="text-lg font-black text-slate-900 mb-6 uppercase tracking-tight">
            {editingSignal ? 'Edit Signal' : 'Create New Signal'}
          </h2>
          
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Direction</label>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  {(['BUY', 'SELL'] as SignalDirection[]).map((dir) => (
                    <button
                      key={dir}
                      type="button"
                      onClick={() => setFormData({ ...formData, direction: dir })}
                      className={cn(
                        "flex-1 py-2 rounded-lg text-xs font-bold transition-all",
                        formData.direction === dir 
                          ? (dir === 'BUY' ? "bg-green-500 text-white shadow-md" : "bg-red-500 text-white shadow-md")
                          : "text-slate-400"
                      )}
                    >
                      {dir}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Symbol</label>
                <input
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Open From</label>
                <input
                  type="number" step="0.01"
                  value={formData.openFrom}
                  onChange={(e) => setFormData({ ...formData, openFrom: parseFloat(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Open To</label>
                <input
                  type="number" step="0.01"
                  value={formData.openTo}
                  onChange={(e) => setFormData({ ...formData, openTo: parseFloat(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Stop Loss</label>
              <input
                type="number" step="0.01"
                value={formData.stopLoss}
                onChange={(e) => setFormData({ ...formData, stopLoss: parseFloat(e.target.value) })}
                className="w-full bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 text-sm font-bold text-red-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(num => (
                <div key={num}>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">TP{num}</label>
                  <input
                    type="number" step="0.01"
                    value={(formData as any)[`tp${num}`]}
                    onChange={(e) => setFormData({ ...formData, [`tp${num}`]: parseFloat(e.target.value) })}
                    className="w-full bg-green-50 border border-green-100 rounded-xl px-4 py-2.5 text-sm font-bold text-green-600"
                  />
                </div>
              ))}
            </div>

            <div className="pt-4 space-y-4">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Signal Preview</span>
                <SignalCard signal={formData as Signal} />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-slate-200 active:scale-[0.98] transition-transform"
              >
                <Send size={18} />
                {editingSignal ? 'UPDATE SIGNAL' : 'PUBLISH SIGNAL'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {signals.map((signal) => (
          <div key={signal.id} className="relative group">
            <SignalCard signal={signal} />
            <div className="mt-3 flex items-center justify-between gap-2">
              <div className="flex gap-1.5">
                <button 
                  onClick={() => {
                    setEditingSignal(signal);
                    setFormData(signal);
                    setShowForm(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-white border border-slate-200 p-2 rounded-xl text-slate-600 hover:bg-slate-50"
                >
                  <Edit3 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(signal.id)}
                  className="bg-white border border-slate-200 p-2 rounded-xl text-red-500 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <select 
                  value={signal.status}
                  onChange={(e) => updateStatus(signal, e.target.value as SignalStatus)}
                  className="text-[10px] font-bold border border-slate-200 rounded-lg px-2 py-1 bg-white outline-none"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="TP1 HIT">TP1 HIT</option>
                  <option value="TP2 HIT">TP2 HIT</option>
                  <option value="TP3 HIT">TP3 HIT</option>
                  <option value="TP4 HIT">TP4 HIT</option>
                  <option value="SL HIT">SL HIT</option>
                  <option value="CLOSED">CLOSED</option>
                </select>

                <button 
                  onClick={() => togglePublish(signal)}
                  className={cn(
                    "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight flex items-center gap-1 border",
                    signal.published 
                      ? "bg-green-500 text-white border-green-600" 
                      : "bg-slate-200 text-slate-600 border-slate-300"
                  )}
                >
                  {signal.published ? <CheckCircle2 size={12} /> : null}
                  {signal.published ? 'Published' : 'Draft'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
