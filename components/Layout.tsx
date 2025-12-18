import React from 'react';
import { AppView } from '../types';
import { Activity, LayoutDashboard, User, Stethoscope, HeartPulse } from 'lucide-react';

interface LayoutProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ currentView, onChangeView, children }) => {
  const navItems = [
    { view: AppView.DASHBOARD, label: 'Обзор', icon: LayoutDashboard },
    { view: AppView.TRACKER, label: 'Трекер', icon: Activity },
    { view: AppView.CONSULTATION, label: 'Доктор AI', icon: Stethoscope },
    { view: AppView.PROFILE, label: 'Профиль', icon: User },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-800">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-turquoise-100 shadow-sm">
        <div className="p-6 flex items-center space-x-2 border-b border-turquoise-50">
          <HeartPulse className="w-8 h-8 text-turquoise-500" />
          <span className="text-xl font-bold text-turquoise-600 tracking-tight">Dr Body OS</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => onChangeView(item.view)}
              className={`flex items-center w-full px-4 py-3 rounded-xl transition-colors duration-200 font-medium ${
                currentView === item.view
                  ? 'bg-turquoise-50 text-turquoise-700'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-turquoise-600'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 text-xs text-center text-slate-400">
          v1.0.0 Stable
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-turquoise-100 shadow-sm z-10">
           <div className="flex items-center space-x-2">
            <HeartPulse className="w-6 h-6 text-turquoise-500" />
            <span className="text-lg font-bold text-turquoise-600">Dr Body OS</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-5xl mx-auto w-full">
            {children}
          </div>
        </div>

        {/* Bottom Nav (Mobile) */}
        <nav className="md:hidden bg-white border-t border-slate-200 flex justify-around p-2 pb-safe z-20">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => onChangeView(item.view)}
              className={`flex flex-col items-center p-2 rounded-lg ${
                currentView === item.view ? 'text-turquoise-600' : 'text-slate-400'
              }`}
            >
              <item.icon className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </main>
    </div>
  );
};

export default Layout;