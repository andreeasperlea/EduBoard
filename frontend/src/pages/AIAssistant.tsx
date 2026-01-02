import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useCurrentUser from '../hooks/useCurrentUser';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AIAssistant = () => {
  const navigate = useNavigate();
  const user = useCurrentUser();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
      const fetchHistory = async () => {
          const token = localStorage.getItem('token');
          try {
              const res = await fetch('http://localhost:8000/api/v1/ai/history', {
                  headers: { 'Authorization': `Bearer ${token}` }
              });
              if (res.ok) {
                  const history = await res.json();
                  if (history.length > 0) {
                      setMessages(history);
                  } else {
                    
                      setMessages([{ role: 'assistant', content: `Hello ${user?.full_name || ''}! I am EduBoard AI. How can I help?` }]);
                  }
              }
          } catch (e) { console.error(e); }
      };
      if(user) fetchHistory();
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userText = input;
    setInput('');
    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: userText }]);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/v1/ai/chat', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ message: userText }) 
      });

      if (!response.ok || !response.body) throw new Error("Connection error");

      setMessages(prev => [...prev, { role: 'assistant', content: "" }]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value, { stream: true });

        setMessages(prev => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          updated[lastIndex] = {
            ...updated[lastIndex],
            content: updated[lastIndex].content + chunkValue
          };
          return updated;
        });
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "⚠️ Network Error." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'Inter, sans-serif', background: '#f4f4f9' }}>
      <div style={{ background: 'white', padding: '15px 30px', borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: 'linear-gradient(135deg, #6f42c1, #007bff)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '18px' }}>✨</div>
            <div>
                <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>EduBoard AI</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#28a745', fontWeight: 500 }}>Online & Saved</span>
                </div>
            </div>
        </div>
        <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: '1px solid #ccc', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Close</button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ 
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', 
              maxWidth: '85%',
              minWidth: '30%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start'
          }}>
            
            <div style={{ 
              background: msg.role === 'user' ? '#007bff' : 'white', 
              color: msg.role === 'user' ? 'white' : '#1a1a1a',
              padding: '10px 20px', 
              borderRadius: '18px',
              borderBottomRightRadius: msg.role === 'user' ? '4px' : '18px',
              borderBottomLeftRadius: msg.role === 'assistant' ? '4px' : '18px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
              lineHeight: '1.6',
              fontSize: '15px',
              overflowX: 'hidden'
            }}>
                {msg.role === 'user' ? (
                   msg.content 
                ) : (
                   <ReactMarkdown
                        components={{
                            code(props) {
                                const {children, className, node, ref, ...rest} = props as any;
                                const match = /language-(\w+)/.exec(className || '');
                                return match ? (
                                    <SyntaxHighlighter
                                        {...rest}
                                        PreTag="div"
                                        children={String(children).replace(/\n$/, '')}
                                        language={match[1]}
                                        style={vscDarkPlus}
                                        customStyle={{borderRadius: '8px', fontSize: '0.9rem'}}
                                    />
                                ) : (
                                    <code {...rest} className={className} style={{background: '#eee', padding: '2px 4px', borderRadius: '4px', color: '#d63384'}}>
                                        {children}
                                    </code>
                                )
                            }
                        }}
                   >
                       {msg.content}
                   </ReactMarkdown>
                )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ padding: '20px', background: 'white', borderTop: '1px solid #eee' }}>
        <div style={{ display: 'flex', gap: '10px', maxWidth: '1000px', margin: '0 auto' }}>
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything..." 
              disabled={isLoading}
              style={{ flex: 1, padding: '15px', borderRadius: '12px', border: '1px solid #e0e0e0', fontSize: '1rem', outline: 'none', background: '#f9f9f9' }}
            />
            <button 
              onClick={handleSend}
              disabled={isLoading}
              style={{ padding: '0 30px', background: isLoading ? '#ccc' : '#007bff', color: 'white', border: 'none', borderRadius: '12px', cursor: isLoading ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
            >
              Send
            </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;