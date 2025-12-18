export enum Gender {
  MALE = 'Мужской',
  FEMALE = 'Женский',
  OTHER = 'Другой'
}

export interface UserProfile {
  name: string;
  age: number;
  weight: number; // kg
  gender: Gender;
  conditions: string; // Chronic diseases
  preferences: string; // Treatment preferences
  isOnboarded: boolean;
}

export interface DailyLog {
  date: string; // ISO Date string YYYY-MM-DD
  sleepHours: number;
  steps: number;
  waterIntake: number; // in glasses
  systolicBP: number;
  diastolicBP: number;
  hygieneCheck: boolean;
  medicationsTaken: boolean;
  mood: number; // 1-5 scale
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  TRACKER = 'TRACKER',
  CONSULTATION = 'CONSULTATION',
  PROFILE = 'PROFILE'
}