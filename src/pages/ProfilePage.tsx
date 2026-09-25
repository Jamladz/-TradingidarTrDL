import { TelegramUser } from '@/src/hooks/useTelegram';
import { User, ShieldCheck, AlertTriangle, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface ProfilePageProps {
  user?: TelegramUser;
}

export function ProfilePage({ user }: ProfilePageProps) {
  const joinDate = format(new Date(), 'dd MMMM yyyy');

  if (!user) {
    return (
      <div className="p-5 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-3xl">
          📱
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Telegram Not Detected</h2>
        <p className="text-slate-400 text-sm max-w-[240px]">
          Please open this app inside Telegram to view your profile and active signals.
        </p>
      </div>
    );
  }

  return (
    <div className="p-5 max-w-md mx-auto">
      <header className="mb-8 pt-4">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          User <span className="text-slate-400">Profile</span>
        </h1>
      </header>

      <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm mb-6">
        <div className="bg-slate-900 h-24 relative">
          <div className="absolute -bottom-10 left-6">
            {user?.photo_url ? (
              <img 
                src={user.photo_url} 
                alt="Profile" 
                className="w-20 h-20 rounded-2xl border-4 border-white shadow-md object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-md bg-yellow-500 flex items-center justify-center text-white text-3xl font-bold">
                {user?.first_name?.[0] || 'G'}
              </div>
            )}
          </div>
        </div>
        
        <div className="pt-12 pb-6 px-6">
          <h2 className="text-xl font-bold text-slate-900">{user?.first_name} {user?.last_name}</h2>
          <p className="text-slate-400 text-sm font-medium">@{user?.username || 'no_username'}</p>
          
          <div className="grid grid-cols-1 gap-4 mt-8">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-slate-400">
                <User size={20} />
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Telegram ID</div>
                <div className="text-sm font-bold text-slate-700">{user?.id}</div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-slate-400">
                <Calendar size={20} />
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Joined At</div>
                <div className="text-sm font-bold text-slate-700">{joinDate}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 mb-8">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 text-amber-500">
            <AlertTriangle size={18} />
          </div>
          <div>
            <h4 className="text-amber-900 font-bold text-sm mb-1">Trading Disclaimer</h4>
            <p className="text-amber-800/70 text-xs leading-relaxed font-medium">
              Trading involves significant risk. These signals are provided for informational and educational purposes only and do not constitute financial advice. We do not guarantee profits or specific results.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl p-6 text-center shadow-lg shadow-slate-200">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center text-white">
            <ShieldCheck size={28} />
          </div>
        </div>
        <h3 className="text-white font-bold text-lg mb-1">Exness Verified</h3>
        <p className="text-slate-400 text-xs font-medium">
          Professional gold signals optimized for the Exness trading environment.
        </p>
      </div>
    </div>
  );
}
