import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true
});

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatResponse {
  message: string;
}

export async function handleChat(messages: Message[]): Promise<ChatResponse> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages
    });

    return {
      message: completion.choices[0].message.content ?? ''
    };
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
}