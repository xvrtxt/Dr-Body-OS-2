import React, { useState, useEffect } from 'react';
import { UserProfile, DailyLog, AppView } from './types';
import Layout from './components/Layout';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import HealthTracker from './components/HealthTracker';
import ChatDoctor from './components/ChatDoctor';
import { User, Settings } from 'lucide-react';

const App: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load data on startup
  useEffect(() => {
    const savedProfile = localStorage.getItem('drbody_profile');
    const savedLogs = localStorage.getItem('drbody_logs');
    
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    }
    setIsInitialized(true);
  }, []);

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('drbody_profile', JSON.stringify(profile));
    setCurrentView(AppView.DASHBOARD);
  };

  const handleSaveLog = (newLog: DailyLog) => {
    setLogs(prevLogs => {
      // Remove existing log for same date if exists
      const filtered = prevLogs.filter(l => l.date !== newLog.date);
      const updated = [...filtered, newLog].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      localStorage.setItem('drbody_logs', JSON.stringify(updated));
      return updated;
    });
  };

  const handleLogout = () => {
    // Clear storage
    localStorage.removeItem('drbody_profile');
    localStorage.removeItem('drbody_logs');
    
    // Reset state to force Onboarding component to render
    setUserProfile(null);
    setLogs([]);
    setCurrentView(AppView.DASHBOARD);
  };

  if (!isInitialized) return null;

  if (!userProfile) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard logs={logs} user={userProfile} />;
      case AppView.TRACKER:
        const todayStr = new Date().toISOString().split('T')[0];
        const todayLog = logs.find(l => l.date === todayStr);
        return <HealthTracker onSave={handleSaveLog} existingLog={todayLog} />;
      case AppView.CONSULTATION:
        return <ChatDoctor user={userProfile} />;
      case AppView.PROFILE:
        return (
          <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
             <div className="flex items-center space-x-4 mb-8">
                <div className="w-20 h-20 bg-turquoise-100 rounded-full flex items-center justify-center text-turquoise-600">
                    <User size={40} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">{userProfile.name}</h2>
                    <p className="text-slate-500">Пациент • {userProfile.age} лет</p>
                </div>
             </div>

             <div className="space-y-4">
                 <div className="p-4 bg-slate-50 rounded-xl">
                     <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Вес</span>
                     <p className="text-lg font-medium text-slate-700">{userProfile.weight} кг</p>
                 </div>
                 <div className="p-4 bg-slate-50 rounded-xl">
                     <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Хронические заболевания</span>
                     <p className="text-lg font-medium text-slate-700">{userProfile.conditions || 'Не указано'}</p>
                 </div>
                 <div className="p-4 bg-slate-50 rounded-xl">
                     <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Предпочтения</span>
                     <p className="text-lg font-medium text-slate-700">{userProfile.preferences || 'Не указано'}</p>
                 </div>
             </div>

             <button 
                onClick={handleLogout}
                className="mt-8 w-full py-3 border border-red-200 text-red-500 rounded-xl hover:bg-red-50 transition font-medium"
             >
                Сбросить данные и выйти
             </button>
          </div>
        );
      default:
        return <Dashboard logs={logs} user={userProfile} />;
    }
  };

  return (
    <Layout currentView={currentView} onChangeView={setCurrentView}>
      {renderContent()}
    </Layout>
  );
};

export default App;