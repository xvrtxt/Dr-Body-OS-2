import React, { useState, useEffect, useRef } from 'react';
import { DailyLog } from '../types';
import { Save, Plus, Minus, Pill, ShowerHead, Play, Pause, Footprints } from 'lucide-react';

interface HealthTrackerProps {
  onSave: (log: DailyLog) => void;
  existingLog?: DailyLog;
}

const HealthTracker: React.FC<HealthTrackerProps> = ({ onSave, existingLog }) => {
  const todayStr = new Date().toISOString().split('T')[0];
  
  const [log, setLog] = useState<DailyLog>(existingLog || {
    date: todayStr,
    sleepHours: 7,
    steps: 0,
    waterIntake: 0,
    systolicBP: 120,
    diastolicBP: 80,
    hygieneCheck: false,
    medicationsTaken: false,
    mood: 3
  });

  const [isPedometerActive, setIsPedometerActive] = useState(false);
  const lastStepTime = useRef<number>(0);
  
  // Automatic Pedometer Logic (Акселерометр)
  useEffect(() => {
    let motionHandler: ((event: DeviceMotionEvent) => void) | null = null;

    if (isPedometerActive) {
      motionHandler = (event: DeviceMotionEvent) => {
        const acc = event.accelerationIncludingGravity;
        if (!acc || acc.x === null || acc.y === null || acc.z === null) return;

        // Вычисляем вектор магнитуды (силу движения)
        const magnitude = Math.sqrt(acc.x**2 + acc.y**2 + acc.z**2);
        
        // Порог чувствительности (для ходьбы обычно > 11-12, гравитация ~9.8)
        const THRESHOLD = 11.5; 
        const STEP_DELAY_MS = 350; // Минимальная задержка между шагами

        if (magnitude > THRESHOLD) {
          const now = Date.now();
          if (now - lastStepTime.current > STEP_DELAY_MS) {
            setLog(prev => ({ ...prev, steps: prev.steps + 1 }));
            lastStepTime.current = now;
          }
        }
      };

      window.addEventListener('devicemotion', motionHandler);
    }

    return () => {
      if (motionHandler) {
        window.removeEventListener('devicemotion', motionHandler);
      }
    };
  }, [isPedometerActive]);

  const togglePedometer = async () => {
    if (!isPedometerActive) {
      // Запрос разрешения для iOS 13+
      if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
        try {
          const permissionState = await (DeviceMotionEvent as any).requestPermission();
          if (permissionState === 'granted') {
            setIsPedometerActive(true);
          } else {
            alert('Разрешение на использование датчиков отклонено.');
          }
        } catch (e) {
          console.error(e);
          // Fallback если не iOS или ошибка (часто бывает на http без https)
          setIsPedometerActive(true);
        }
      } else {
        // Android / Desktop
        setIsPedometerActive(true);
      }
    } else {
      setIsPedometerActive(false);
    }
  };

  const updateNumber = (field: keyof DailyLog, delta: number) => {
    setLog(prev => ({
      ...prev,
      [field]: Math.max(0, (prev[field] as number) + delta)
    }));
  };

  const handleSave = () => {
    onSave(log);
    alert('Данные успешно сохранены!');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Ежедневный трекинг</h2>
      
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Water */}
          <div className="flex flex-col items-center p-4 bg-cyan-50 rounded-2xl">
            <span className="text-slate-500 text-sm font-medium mb-2">Вода (стаканы)</span>
            <div className="flex items-center space-x-4">
              <button onClick={() => updateNumber('waterIntake', -1)} className="p-2 bg-white rounded-full shadow-sm text-cyan-600 hover:bg-cyan-100 transition"><Minus size={20}/></button>
              <span className="text-3xl font-bold text-cyan-800 w-8 text-center">{log.waterIntake}</span>
              <button onClick={() => updateNumber('waterIntake', 1)} className="p-2 bg-white rounded-full shadow-sm text-cyan-600 hover:bg-cyan-100 transition"><Plus size={20}/></button>
            </div>
          </div>

          {/* Sleep */}
          <div className="flex flex-col items-center p-4 bg-indigo-50 rounded-2xl">
            <span className="text-slate-500 text-sm font-medium mb-2">Сон (часы)</span>
            <div className="flex items-center space-x-4">
               <button onClick={() => updateNumber('sleepHours', -0.5)} className="p-2 bg-white rounded-full shadow-sm text-indigo-600 hover:bg-indigo-100 transition"><Minus size={20}/></button>
              <span className="text-3xl font-bold text-indigo-800 w-16 text-center">{log.sleepHours}</span>
               <button onClick={() => updateNumber('sleepHours', 0.5)} className="p-2 bg-white rounded-full shadow-sm text-indigo-600 hover:bg-indigo-100 transition"><Plus size={20}/></button>
            </div>
          </div>

          {/* Steps with Auto-Counter */}
          <div className="md:col-span-2 bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-emerald-800">Количество шагов</label>
              <button 
                onClick={togglePedometer}
                className={`flex items-center text-xs font-bold px-3 py-1.5 rounded-full transition ${
                  isPedometerActive 
                    ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                    : 'bg-emerald-200 text-emerald-700 hover:bg-emerald-300'
                }`}
              >
                {isPedometerActive ? <Pause size={14} className="mr-1"/> : <Play size={14} className="mr-1"/>}
                {isPedometerActive ? 'Стоп' : 'Авто-счет'}
              </button>
            </div>
            
            <div className="relative">
               <input 
                type="number" 
                className="w-full p-4 pl-12 bg-white border border-emerald-200 rounded-xl text-2xl font-bold text-emerald-900 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                value={log.steps}
                onChange={(e) => setLog({...log, steps: Number(e.target.value)})}
              />
              <Footprints className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-300 w-6 h-6" />
            </div>
            {isPedometerActive && (
              <p className="text-xs text-emerald-600 mt-2 animate-pulse flex items-center">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                Датчик движения активен (ходите с телефоном)...
              </p>
            )}
          </div>

          {/* BP */}
          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Верхнее (SYS)</label>
              <input 
                type="number" 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xl font-semibold text-slate-800 focus:ring-2 focus:ring-red-300 focus:outline-none"
                value={log.systolicBP}
                onChange={(e) => setLog({...log, systolicBP: Number(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Нижнее (DIA)</label>
              <input 
                type="number" 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xl font-semibold text-slate-800 focus:ring-2 focus:ring-red-300 focus:outline-none"
                value={log.diastolicBP}
                onChange={(e) => setLog({...log, diastolicBP: Number(e.target.value)})}
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="md:col-span-2 grid grid-cols-2 gap-4">
             <button 
                onClick={() => setLog(prev => ({...prev, hygieneCheck: !prev.hygieneCheck}))}
                className={`p-4 rounded-xl flex flex-col items-center justify-center space-y-2 border-2 transition ${
                  log.hygieneCheck 
                  ? 'bg-turquoise-50 border-turquoise-500 text-turquoise-700' 
                  : 'bg-white border-slate-200 text-slate-400 hover:border-turquoise-200'
                }`}
             >
               <ShowerHead size={32} />
               <span className="font-semibold">Гигиена</span>
             </button>

             <button 
                onClick={() => setLog(prev => ({...prev, medicationsTaken: !prev.medicationsTaken}))}
                className={`p-4 rounded-xl flex flex-col items-center justify-center space-y-2 border-2 transition ${
                  log.medicationsTaken
                  ? 'bg-green-50 border-green-500 text-green-700' 
                  : 'bg-white border-slate-200 text-slate-400 hover:border-green-200'
                }`}
             >
               <Pill size={32} />
               <span className="font-semibold">Лекарства</span>
             </button>
          </div>

        </div>

        <button 
          onClick={handleSave}
          className="w-full mt-8 bg-turquoise-600 hover:bg-turquoise-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center space-x-2 transition shadow-lg shadow-turquoise-200"
        >
          <Save size={20} />
          <span>Сохранить показатели</span>
        </button>
      </div>
    </div>
  );
};

export default HealthTracker;