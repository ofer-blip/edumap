import React, { useState, useRef, useEffect } from 'react';
import { School } from '../types';
import { X, Send, Sparkles, User, Loader2, Bot } from 'lucide-react';

// --- כאן מדביקים את המפתח שהוצאת מ-AI STUDIO ---
const GEMINI_API_KEY = "AIzaSyCXEaimivhM0GaTuUs6-OT1FuYWKwn8aUw"; 

interface AIAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  schools: School[];
}

const AIAdvisorModal: React.FC<AIAdvisorModalProps> = ({ isOpen, onClose, schools }) => {
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const schoolsContext = schools.map(s => `${s.name} (${s.city})`).join(', ');
      
      // כתובת מעודכנת ומבנה הודעה תקין
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `אתה יועץ חינוכי מומחה. המוסדות הקיימים: ${schoolsContext}. ענה בעברית לשאלה: ${userMsg}`
            }]
          }]
        })
      });

      const data = await response.json();
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "לא הצלחתי לעבד את התשובה.";
      setMessages(prev => [...prev, { role: 'model', content: aiText }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', content: "שגיאה בחיבור לשרת ה-AI." }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-2xl flex flex-col h-[70vh] overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-bold">יועץ AI</h2>
          <button onClick={onClose}><X /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border'}`}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t flex gap-2">
          <input 
            className="flex-1 border rounded-lg px-3 py-2 text-right" 
            dir="rtl"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button onClick={handleSend} className="bg-blue-600 text-white p-2 rounded-lg"><Send size={20}/></button>
        </div>
      </div>
    </div>
  );
};

export default AIAdvisorModal;
