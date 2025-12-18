import React from 'react';
import { DailyLog, UserProfile } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line 
} from 'recharts';
import { Moon, Footprints, Droplets, Activity } from 'lucide-react';

interface DashboardProps {
  logs: DailyLog[];
  user: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ logs, user }) => {
  // Get last 7 days for charts. If logs are empty, use dummy data for display
  const chartData = logs.length > 0 ? logs.slice(-7) : [
    { date: 'Пн', steps: 4000, sleepHours: 6, systolicBP: 120 },
    { date: 'Вт', steps: 6500, sleepHours: 7.5, systolicBP: 118 },
    { date: 'Ср', steps: 8000, sleepHours: 7, systolicBP: 122 },
    { date: 'Чт', steps: 5500, sleepHours: 8, systolicBP: 119 },
    { date: 'Пт', steps: 9000, sleepHours: 6.5, systolicBP: 125 },
    { date: 'Сб', steps: 10500, sleepHours: 9, systolicBP: 115 },
    { date: 'Вс', steps: 3000, sleepHours: 10, systolicBP: 117 },
  ];

  const today = logs.find(l => l.date === new Date().toISOString().split('T')[0]) || {
    steps: 0,
    sleepHours: 0,
    waterIntake: 0,
    systolicBP: 0,
    diastolicBP: 0
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Доброе утро, {user.name.split(' ')[1] || user.name}!</h2>
          <p className="text-slate-500">Вот обзор вашего состояния сегодня.</p>
        </div>
        <div className="mt-2 md:mt-0 bg-white px-4 py-2 rounded-full border border-slate-200 text-sm font-medium text-slate-600 shadow-sm">
          {new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Footprints className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-slate-500">Шаги</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">{today.steps}</div>
          <p className="text-xs text-slate-400 mt-1">Цель: 10 000</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <Moon className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-slate-500">Сон</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">{today.sleepHours} <span className="text-sm font-normal text-slate-400">ч</span></div>
           <p className="text-xs text-slate-400 mt-1">Норма: 8 ч</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-cyan-100 text-cyan-600 rounded-lg">
              <Droplets className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-slate-500">Вода</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">{today.waterIntake} <span className="text-sm font-normal text-slate-400">стак.</span></div>
           <p className="text-xs text-slate-400 mt-1">Норма: 8 стак.</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-red-100 text-red-600 rounded-lg">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-slate-500">Давление</span>
          </div>
          <div className="text-2xl font-bold text-slate-800">
            {today.systolicBP > 0 ? `${today.systolicBP}/${today.diastolicBP}` : '--/--'}
          </div>
           <p className="text-xs text-slate-400 mt-1">Норма: 120/80</p>
        </div>
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-700 mb-6">Активность за неделю</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f0fdfa'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                />
                <Bar dataKey="steps" fill="#2dd4bf" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-700 mb-6">Динамика давления (верхнее)</h3>
           <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                 <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis domain={[90, 160]} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                   contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                />
                <Line type="monotone" dataKey="systolicBP" stroke="#f87171" strokeWidth={3} dot={{r: 4, fill: '#f87171', strokeWidth: 2, stroke: '#fff'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;