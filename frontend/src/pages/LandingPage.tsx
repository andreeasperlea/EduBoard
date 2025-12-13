import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {}
      <nav style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800' }}>EduBoard</h2>
        <div>
          <button 
            onClick={() => navigate('/login')}
            style={{ background: 'transparent', border: 'none', fontSize: '16px', cursor: 'pointer', marginRight: '20px' }}
          >
            Log in
          </button>
          <button 
            onClick={() => navigate('/register')}
            style={{ background: 'black', color: 'white', padding: '10px 20px', borderRadius: '30px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Sign up
          </button>
        </div>
      </nav>

      {}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 20px' }}>
        
        <div style={{ background: '#f0f0f0', color: '#555', padding: '5px 15px', borderRadius: '20px', fontSize: '14px', marginBottom: '20px', fontWeight: '600' }}>
           Your adventure starts here
        </div>

        <h1 style={{ fontSize: '60px', fontWeight: '900', maxWidth: '800px', lineHeight: '1.1', marginBottom: '20px' }}>
          Learn smarter with <span style={{ color: '#007bff' }}>AI</span> and <span style={{ color: '#6f42c1' }}>Collaboration</span>
        </h1>

        <p style={{ fontSize: '20px', color: '#666', maxWidth: '600px', lineHeight: '1.6', marginBottom: '40px' }}>
          EduBoard integrates interactive whiteboards, classroom management, and a personal AI assistant to transform the teaching experience.
        </p>

        <div style={{ display: 'flex', gap: '15px' }}>
          <button 
            onClick={() => navigate('/register')}
            style={{ padding: '15px 35px', fontSize: '18px', background: '#007bff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Get Started Free
          </button>
          <button 
             onClick={() => navigate('/login')}
             style={{ padding: '15px 35px', fontSize: '18px', background: 'white', color: 'black', border: '1px solid #ccc', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            I have an account
          </button>
        </div>

        {}
        <div style={{ display: 'flex', gap: '30px', marginTop: '80px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <FeatureCard  title="Whiteboard" desc="Draw, explain, and save lessons in real-time." />
            <FeatureCard title="AI Assistant" desc="Get instant answers to any academic question." />
            <FeatureCard  title="Classes" desc="Manage students and materials in one place." />
        </div>

      </div>

      {}
      <footer style={{ padding: '20px', textAlign: 'center', color: '#999', fontSize: '14px' }}>
        © 2025 EduBoard. Built for performance.
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: any) => (
    <div style={{ width: '250px', padding: '20px', border: '1px solid #eee', borderRadius: '12px', textAlign: 'left', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <div style={{ fontSize: '30px', marginBottom: '10px' }}>{icon}</div>
        <h3 style={{ margin: '0 0 10px 0' }}>{title}</h3>
        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>{desc}</p>
    </div>
);

export default LandingPage;