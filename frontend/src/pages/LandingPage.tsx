import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: '#333' }}>
      
      {}
      <nav style={{ padding: '15px 30px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '22px' }}>EduBoard</h2>
        <div>
          <button 
            onClick={() => navigate('/login')}
            style={{ background: 'transparent', border: 'none', fontSize: '16px', cursor: 'pointer', marginRight: '15px', color: '#555' }}
          >
            Log in
          </button>
          <button 
            onClick={() => navigate('/register')}
            style={{ background: '#333', color: 'white', padding: '8px 16px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: '14px' }}
          >
            Sign up
          </button>
        </div>
      </nav>

      {}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 20px' }}>
        
        <h1 style={{ fontSize: '48px', marginBottom: '20px', marginTop: 0 }}>
          Welcome to EduBoard
        </h1>

        <p style={{ fontSize: '18px', color: '#666', maxWidth: '600px', lineHeight: '1.5', marginBottom: '30px' }}>
          A simple platform for schools. It integrates interactive whiteboards, classroom management, and an AI assistant.
        </p>

        <div style={{ display: 'flex', gap: '15px' }}>
          <button 
            onClick={() => navigate('/register')}
            style={{ padding: '12px 24px', fontSize: '16px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Get Started
          </button>
          <button 
             onClick={() => navigate('/login')}
             style={{ padding: '12px 24px', fontSize: '16px', background: '#f8f9fa', color: '#333', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}
          >
            I have an account
          </button>
        </div>

        {}
        <div style={{ display: 'flex', gap: '20px', marginTop: '60px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <FeatureCard title="Whiteboard" desc="Draw and explain lessons in real-time." />
            <FeatureCard title="AI Assistant" desc="Ask questions and get answers instantly." />
            <FeatureCard title="Classes" desc="See your enrolled classes and materials." />
        </div>

      </div>

      <footer style={{ padding: '20px', textAlign: 'center', color: '#888', fontSize: '12px', borderTop: '1px solid #eee' }}>
        EduBoard Project © 2025
      </footer>
    </div>
  );
};


const FeatureCard = ({ title, desc }: any) => (
    <div style={{ width: '220px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'left', background: '#fff' }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#007bff' }}>{title}</h3>
        <p style={{ margin: 0, color: '#555', fontSize: '14px', lineHeight: '1.4' }}>{desc}</p>
    </div>
);

export default LandingPage;