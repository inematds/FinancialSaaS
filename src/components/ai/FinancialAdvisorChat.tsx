import { useState, useEffect, useRef } from 'react';
import { getFinancialAdvisorResponse } from '../../services/ai';
import { useAuth } from '../../contexts/AuthContext';
import { getHoldingsWithPrices } from '../../services/portfolio';
import { getGoals } from '../../services/goals';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export default function FinancialAdvisorChat() {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "Hello! I'm FinPilot, your AI Financial Advisor. How can I help you optimize your wealth today?", timestamp: new Date() }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [context, setContext] = useState<any>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    // Load context when opening chat
    useEffect(() => {
        if (isOpen && user && !context) {
            const loadContext = async () => {
                const [holdings, goals] = await Promise.all([
                    getHoldingsWithPrices(user.id),
                    getGoals(user.id)
                ]);

                const totalValue = holdings.reduce((sum, h) => sum + (h.market_value || 0), 0);

                setContext({
                    userName: user.email, // or profile name
                    portfolioValue: totalValue,
                    holdings: holdings.map(h => ({ symbol: h.symbol, value: h.market_value })),
                    goals: goals.map(g => ({ name: g.name, target: g.target_amount, current: g.current_amount }))
                });
            };
            loadContext();
        }
    }, [isOpen, user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg, timestamp: new Date() }]);
        setIsTyping(true);

        const responseText = await getFinancialAdvisorResponse(context, userMsg);

        setMessages(prev => [...prev, { role: 'assistant', content: responseText, timestamp: new Date() }]);
        setIsTyping(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
            {/* Chat Window */}
            {isOpen && (
                <div className="pointer-events-auto bg-bg-secondary w-[380px] h-[500px] mb-4 card-base shadow-2xl flex flex-col overflow-hidden animate-fade-in-up border-2 border-accent-blue">
                    {/* Header */}
                    <div className="bg-bg-tertiary p-4 border-b border-border-color flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-accent-blue flex items-center justify-center text-bg-primary font-bold">
                                AI
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">FinPilot Advisor</h3>
                                <div className="flex items-center gap-1">
                                    <span className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></span>
                                    <span className="text-[10px] text-text-secondary uppercase">Online (Gemini 2.5)</span>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-text-secondary hover:text-white transition-colors">
                            ✕
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`max-w-[85%] p-3 text-sm ${msg.role === 'user'
                                            ? 'bg-accent-blue text-bg-primary clip-corner-left'
                                            : 'bg-bg-tertiary text-white clip-corner-right'
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-bg-tertiary p-3 clip-corner-right">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-text-secondary rounded-full animate-bounce"></span>
                                        <span className="w-2 h-2 bg-text-secondary rounded-full animate-bounce delay-100"></span>
                                        <span className="w-2 h-2 bg-text-secondary rounded-full animate-bounce delay-200"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="p-3 bg-bg-tertiary border-t border-border-color">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder="Ask for advice..."
                                className="flex-1 bg-bg-primary border border-border-color p-2 text-sm text-white focus:border-accent-green outline-none"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isTyping}
                                className="bg-accent-blue p-2 text-bg-primary hover:bg-white transition-colors disabled:opacity-50"
                            >
                                ➤
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Floating Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="pointer-events-auto w-16 h-16 bg-accent-blue rounded-full shadow-lg shadow-accent-blue/20 flex items-center justify-center text-3xl hover:scale-110 transition-transform hover:bg-white hover:text-accent-blue group"
            >
                {isOpen ? '✕' : '🤖'}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent-red rounded-full border-2 border-bg-primary"></span>
                )}
            </button>
        </div>
    );
}
