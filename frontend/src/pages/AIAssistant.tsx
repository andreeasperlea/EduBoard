import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useCurrentUser from '../hooks/useCurrentUser';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

const AIAssistant = () => {
  const navigate = useNavigate();
  const user = useCurrentUser();
  
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: `Hello${user ? ' ' + user.full_name : ''}! I am EduBoard AI. I can help you with definitions, code examples, or study plans. Ask me anything! 🤖` }
  ]);
  
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    // Add user message to UI
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      const res = await fetch('http://localhost:8000/api/v1/ai/chat', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: userMessage })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: "⚠️ I'm having trouble connecting to the server. Please try again." }]);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', text: "⚠️ Network error. Check your connection." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'Inter, sans-serif', background: '#f4f4f9' }}>
      
      {}
      <div style={{ background: 'white', padding: '15px 30px', borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {}
            <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: 'linear-gradient(135deg, #6f42c1, #007bff)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '18px' }}>✨</div>
            <div>
                <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>EduBoard AI</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ width: '8px', height: '8px', background: '#28a745', borderRadius: '50%', display: 'inline-block' }}></span>
                    <span style={{ fontSize: '0.8rem', color: '#28a745', fontWeight: 500 }}>Online</span>
                </div>
            </div>
        </div>
        <button 
            onClick={() => navigate(-1)}
            style={{ background: 'transparent', border: '1px solid #ccc', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem' }}
        >
          Close Chat
        </button>
      </div>

      {}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ 
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', 
              maxWidth: '80%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start'
          }}>
            <div style={{ 
              background: msg.role === 'user' ? '#007bff' : 'white', 
              color: msg.role === 'user' ? 'white' : '#1a1a1a',
              padding: '14px 20px', 
              borderRadius: '18px',
              borderBottomRightRadius: msg.role === 'user' ? '4px' : '18px',
              borderBottomLeftRadius: msg.role === 'ai' ? '4px' : '18px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
              lineHeight: '1.6',
              fontSize: '15px',
              whiteSpace: 'pre-wrap'
            }}>
              {msg.text}
            </div>
            
            <span style={{ fontSize: '11px', color: '#999', marginTop: '6px', marginLeft: '5px', marginRight: '5px' }}>
                {msg.role === 'user' ? 'You' : 'EduBoard AI'}
            </span>
          </div>
        ))}
        
        {}
        {loading && (
            <div style={{ alignSelf: 'flex-start', background: 'white', padding: '15px 20px', borderRadius: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', display: 'flex', gap: '5px', alignItems: 'center', width: 'fit-content' }}>
                <div className="typing-dot" style={{width: 6, height: 6, background: '#888', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both'}}></div>
                <div className="typing-dot" style={{width: 6, height: 6, background: '#888', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.16s'}}></div>
                <div className="typing-dot" style={{width: 6, height: 6, background: '#888', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.32s'}}></div>
                
                <style>{`
                    @keyframes bounce {
                        0%, 80%, 100% { transform: scale(0); }
                        40% { transform: scale(1); }
                    }
                `}</style>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {}
      <div style={{ padding: '20px', background: 'white', borderTop: '1px solid #eee' }}>
        <div style={{ display: 'flex', gap: '10px', maxWidth: '1000px', margin: '0 auto' }}>
            <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a question..." 
            disabled={loading}
            autoFocus
            style={{ 
                flex: 1, padding: '15px', borderRadius: '12px', 
                border: '1px solid #e0e0e0', fontSize: '1rem', outline: 'none',
                background: '#f9f9f9', transition: 'border 0.2s'
            }}
            />
            <button 
            onClick={handleSend}
            disabled={loading}
            style={{ 
                padding: '0 30px', 
                background: loading ? '#ccc' : '#007bff', 
                color: 'white', border: 'none', borderRadius: '12px', 
                cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '1rem',
                transition: 'background 0.2s'
            }}
            >
            Send
            </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;