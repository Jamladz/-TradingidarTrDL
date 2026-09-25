import { LayoutGrid, History, User, Settings } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isAdmin?: boolean;
}

export function BottomNav({ activeTab, onTabChange, isAdmin }: BottomNavProps) {
  const tabs = [
    { id: 'signals', label: 'Signals', icon: LayoutGrid },
    { id: 'history', label: 'History', icon: History },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  if (isAdmin) {
    tabs.push({ id: 'admin', label: 'Admin', icon: Settings });
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 pb-[env(safe-area-inset-bottom,20px)] pt-3 z-50">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center gap-1 transition-colors relative",
                isActive ? "text-slate-900" : "text-gray-400"
              )}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
              {isActive && (
                <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-yellow-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
