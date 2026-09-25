import { useState, useEffect } from 'react';
import { useTelegram } from '@/src/hooks/useTelegram';
import { BottomNav } from '@/src/components/BottomNav';
import { SignalsPage } from '@/src/pages/SignalsPage';
import { HistoryPage } from '@/src/pages/HistoryPage';
import { ProfilePage } from '@/src/pages/ProfilePage';
import { AdminPage } from '@/src/pages/AdminPage';
import { db, auth } from '@/src/firebase';
import { signInAnonymously } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function App() {
  const { user, isReady } = useTelegram();
  const [activeTab, setActiveTab] = useState('signals');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initApp() {
      if (!isReady || !user) return;

      try {
        // Simple anonymous sign-in for now, as we use Telegram ID for auth logic
        // In a real prod app, you'd verify the hash on the backend
        const userCredential = await signInAnonymously(auth);
        const userId = user.id.toString();
        
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          await setDoc(userDocRef, {
            telegramId: user.id,
            username: user.username || '',
            firstName: user.first_name,
            lastName: user.last_name || '',
            photoUrl: user.photo_url || '',
            createdAt: serverTimestamp(),
            isAdmin: false // Default to false
          });
        } else {
          setIsAdmin(userDoc.data()?.isAdmin || false);
        }
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setLoading(false);
      }
    }

    initApp();
  }, [isReady, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-yellow-500 rounded-full animate-spin"></div>
          <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Loading Gold Signals</span>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (activeTab) {
      case 'signals':
        return <SignalsPage />;
      case 'history':
        return <HistoryPage />;
      case 'profile':
        return <ProfilePage user={user} />;
      case 'admin':
        return isAdmin ? <AdminPage /> : <SignalsPage />;
      default:
        return <SignalsPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {renderPage()}
      <BottomNav 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        isAdmin={isAdmin}
      />
    </div>
  );
}
