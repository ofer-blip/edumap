import React, { useState, useRef, useEffect } from 'react';
import { School } from '../types';
import { X, Send, Sparkles, User, Loader2, Bot } from 'lucide-react';

// --- כאן מדביקים את המפתח שהוצאת מ-AI STUDIO ---
const GEMINI_API_KEY = "AIzaSyDdj-P9UNFFu5f3PtgpbEVZwHN6tGkbpz0"; 


interface AIAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  schools: School[];
}

const AIAdvisorModal: React.FC<AIAdvisorModalProps> = ({ isOpen, onClose, schools }) => {
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const schoolsContext = schools.map(s => `${s.name} ב${s.city} (סוג: ${s.type})`).join(', ');
      
      // הכתובת המעודכנת למניעת שגיאת 404
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `אתה יועץ חינוכי מומחה לאפליקציית "נתיבים". אלו בתי הספר שקיימים במערכת: ${schoolsContext}. 
                     ענה בעברית בצורה ידידותית. השאלה של המשתמש: ${userMsg}`
            }]
          }]
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }

      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "מצטער, לא הצלחתי לענות כרגע.";
      setMessages(prev => [...prev, { role: 'model', content: aiText }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', content: "שגיאה בחיבור ל-AI. וודא שהזנת מפתח API תקין ושהוא פעיל ב-AI Studio." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col h-[80vh] overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-blue-600" />
            <h2 className="font-bold text-gray-900">יועץ פדגוגי חכם (AI)</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X /></button>
        </div>
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.length === 0 && (
            <div className="text-center p-8 text-gray-400">
              <Bot className="w-12 h-12 mx-auto mb-2 opacity-20" />
              <p>שלום! שאל אותי כל דבר על בתי הספר במפה.</p>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-xl ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border text-gray-800'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && <div className="text-xs text-gray-400 animate-pulse">היועץ חושב...</div>}
        </div>
        <div className="p-4 border-t flex gap-2">
          <input 
            type="text" 
            className="flex-1 border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 text-right"
            dir="rtl"
            placeholder="כתוב הודעה..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend} className="bg-blue-600 text-white p-2 rounded-xl"><Send /></button>
        </div>
      </div>
    </div>
  );
};

export default AIAdvisorModal;
