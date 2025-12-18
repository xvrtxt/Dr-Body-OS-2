import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { UserProfile, ChatMessage } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION_TEMPLATE = `
Вы - Dr Body OS, интеллектуальная операционная система здоровья. 
Ваша цель: помогать пользователю поддерживать здоровье, давать советы по лечению и образу жизни.

Профиль пользователя:
Имя: {{NAME}}
Возраст: {{AGE}} лет
Вес: {{WEIGHT}} кг
Пол: {{GENDER}}
Хронические заболевания: {{CONDITIONS}}
Предпочтения в лечении: {{PREFERENCES}}

Ваши задачи:
1. Давать советы, что делать, если что-то болит.
2. Помогать разбираться в типах лекарств (но всегда напоминать о консультации с врачом).
3. Предлагать способы выздоровления (народные средства, отдых, питание).
4. Рекомендовать, к какому врачу обратиться (терапевт, хирург и т.д.).

Стиль общения: Профессиональный, заботливый, спокойный, медицински грамотный, но понятный.
ВАЖНО: Всегда добавляйте дисклеймер, если совет касается приема серьезных медикаментов.
`;

let chatSession: Chat | null = null;

export const initializeChat = (profile: UserProfile) => {
  const filledInstruction = SYSTEM_INSTRUCTION_TEMPLATE
    .replace('{{NAME}}', profile.name)
    .replace('{{AGE}}', profile.age.toString())
    .replace('{{WEIGHT}}', profile.weight.toString())
    .replace('{{GENDER}}', profile.gender)
    .replace('{{CONDITIONS}}', profile.conditions || 'Нет')
    .replace('{{PREFERENCES}}', profile.preferences || 'Стандартные');

  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: filledInstruction,
    },
  });
};

export const sendMessageToDrBody = async (message: string): Promise<string> => {
  if (!chatSession) {
    throw new Error("Chat session not initialized");
  }

  try {
    const response: GenerateContentResponse = await chatSession.sendMessage({ message });
    return response.text || "Извините, я не смог сгенерировать ответ.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Произошла ошибка связи с сервером Dr Body OS.";
  }
};
