import React, { useState, useEffect } from 'react';
import { UserProfile, Gender } from '../types';
import { ArrowRight, CheckCircle } from 'lucide-react';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    gender: Gender.MALE,
    conditions: '',
    preferences: '',
    name: '',
    age: undefined,
    weight: undefined
  });

  // Reset form when component mounts (useful after logout)
  useEffect(() => {
    setStep(1);
    setFormData({
        gender: Gender.MALE,
        conditions: '',
        preferences: '',
        name: '',
        age: undefined,
        weight: undefined
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => setStep(prev => prev + 1);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.age && formData.weight) {
      onComplete({
        name: formData.name,
        age: Number(formData.age),
        weight: Number(formData.weight),
        gender: formData.gender as Gender,
        conditions: formData.conditions || '',
        preferences: formData.preferences || '',
        isOnboarded: true
      });
    }
  };

  // Common input class to ensure visibility - FORCED COLORS
  const inputClass = "w-full p-3 bg-white text-slate-900 placeholder-slate-400 border border-slate-300 rounded-xl focus:ring-2 focus:ring-turquoise-300 focus:border-turquoise-500 focus:outline-none transition shadow-sm";

  return (
    <div className="min-h-screen flex items-center justify-center bg-turquoise-50 p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-lg border border-turquoise-100">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-turquoise-700 mb-2">Dr Body OS</h1>
          <p className="text-slate-500">Настройка вашей персональной системы здоровья</p>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-xl font-semibold text-slate-700">Основная информация</h2>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Ваше имя (ФИО)</label>
                <input
                  required
                  name="name"
                  type="text"
                  className={inputClass}
                  placeholder="Иван Иванович"
                  onChange={handleChange}
                  value={formData.name || ''}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Возраст</label>
                  <input
                    required
                    name="age"
                    type="number"
                    className={inputClass}
                    placeholder="30"
                    onChange={handleChange}
                    value={formData.age || ''}
                  />
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-600 mb-1">Пол</label>
                   <select
                    name="gender"
                    className={inputClass}
                    onChange={handleChange}
                    value={formData.gender}
                   >
                     <option value={Gender.MALE}>{Gender.MALE}</option>
                     <option value={Gender.FEMALE}>{Gender.FEMALE}</option>
                     <option value={Gender.OTHER}>{Gender.OTHER}</option>
                   </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Вес (кг)</label>
                <input
                  required
                  name="weight"
                  type="number"
                  className={inputClass}
                  placeholder="75"
                  onChange={handleChange}
                  value={formData.weight || ''}
                />
              </div>
              <button
                type="button"
                onClick={handleNext}
                disabled={!formData.name || !formData.age || !formData.weight}
                className="w-full mt-6 bg-turquoise-500 hover:bg-turquoise-600 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center transition disabled:opacity-50"
              >
                Далее <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-xl font-semibold text-slate-700">Медицинский профиль</h2>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Хронические заболевания / Проблемы</label>
                <textarea
                  name="conditions"
                  rows={3}
                  className={inputClass}
                  placeholder="Например: гастрит, аллергия на пыльцу..."
                  onChange={handleChange}
                  value={formData.conditions || ''}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Предпочтения в лечении</label>
                <textarea
                  name="preferences"
                  rows={3}
                  className={inputClass}
                  placeholder="Например: предпочитаю натуральные средства..."
                  onChange={handleChange}
                  value={formData.preferences || ''}
                />
              </div>
              <button
                type="submit"
                className="w-full mt-6 bg-turquoise-600 hover:bg-turquoise-700 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center transition shadow-lg shadow-turquoise-200"
              >
                Завершить настройку <CheckCircle className="ml-2 w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full mt-2 text-slate-500 hover:text-slate-700 font-medium py-2 transition"
              >
                Назад
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Onboarding;