import { useState, useRef, RefObject, KeyboardEvent, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { handleChat } from '../../routes/api/chat/route';
import ButterChatButton from './butterChatButton';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface ChatResponse {
    message: string;
}

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef: RefObject<HTMLDivElement> = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            role: 'user',
            content: input.trim()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response: ChatResponse = await handleChat([...messages, userMessage]);

            const assistantMessage: Message = {
                role: 'assistant',
                content: response.message
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            const errorMessage: Message = {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.'
            };
            setMessages(prev => [...prev, errorMessage]);
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
            scrollToBottom();
        }
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const MiniButterAvatar = () => {
        const [isWinking, setIsWinking] = useState(false);

        useEffect(() => {
            const winkInterval = setInterval(() => {
                setIsWinking(true);
                setTimeout(() => setIsWinking(false), 300);
            }, Math.random() * 3000 + 2000);

            return () => clearInterval(winkInterval);
        }, []);

        return (
            <div className="relative w-8 h-8">
                <div className="w-full h-full bg-yellow-300 ">
                    <div className="absolute top-2 left-1.5 w-1 h-1 bg-black rounded-full" />
                    <div className={`absolute top-2 right-1.5 w-1 h-1 bg-black rounded-full transition-all duration-200 ${isWinking ? 'h-[0.5px] top-2.5' : ''}`} />
                    <div className="absolute top-3 left-1 w-1.5 h-1 bg-pink-200 rounded-full opacity-70" />
                    <div className="absolute top-3 right-1 w-1.5 h-1 bg-pink-200 rounded-full opacity-70" />
                    <div
                        className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-1.5 
                       border-b-2 border-black rounded-full"
                        style={{
                            borderRadius: '40%',
                            borderBottomLeftRadius: '100%',
                            borderBottomRightRadius: '100%'
                        }}
                    />
                </div>
            </div>
        );
    };

    const chatWindow = (
        <div className="bg-white rounded-lg shadow-xl w-80 h-96 flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
                <div className="flex items-center gap-2">
                    <MiniButterAvatar />
                    <span className="font-semibold">Butter Bot</span>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] p-3 rounded-lg ${message.role === 'user' ? 'bg-yellow-300 text-black' : 'bg-yellow-100'}`}
                        >
                            {message.content}
                        </div>
                    </div>
                ))}
                {isLoading && (


                    <div className="flex justify-start">
                        <div className="bg-yellow-100 rounded-lg px-4 py-2">
                            <div className="flex space-x-2">
                                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            <div className="p-4 border-t">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        disabled={isLoading}
                        className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading}
                        className="bg-yellow-300 hover:bg-yellow-400 text-black rounded-lg p-2 disabled:opacity-50"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
            {isOpen ? chatWindow : <ButterChatButton onClick={() => setIsOpen(true)} />}
        </div>
    );
};

export default ChatBot;