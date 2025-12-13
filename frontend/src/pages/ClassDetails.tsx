import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useCurrentUser from '../hooks/useCurrentUser';
import TeacherNavbar from '../components/TeacherNavbar'; 
import StudentNavbar from '../components/StudentNavbar'; 

interface Student {
  id: string;
  full_name: string;
  email: string;
  role: string;
}

const ClassDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useCurrentUser();

  const [classroom, setClassroom] = useState<any>(null);
  const [students, setStudents] = useState<Student[]>([]); 
  const [inviteEmail, setInviteEmail] = useState("");   
  const [loadingInvite, setLoadingInvite] = useState(false);

  const getToken = () => localStorage.getItem('token');

  const fetchStudents = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/classes/${id}/students`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStudents(data); 
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      const res = await fetch(`http://localhost:8000/api/v1/classes/${id}`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (res.ok) {
        const data = await res.json();
        setClassroom(data);
      }
    };
    fetchDetails();
    fetchStudents(); 
  }, [id]);

  const handleInvite = async () => {
    if (!inviteEmail) return;
    setLoadingInvite(true);
    try {
      const res = await fetch(`http://localhost:8000/api/v1/classes/${id}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
        body: JSON.stringify({ email: inviteEmail })
      });
      if (res.ok) {
        alert("Student invited successfully!");
        setInviteEmail("");
        fetchStudents();
      } else {
        const err = await res.json();
        alert("Error: " + (err.detail || "User not found"));
      }
    } catch (error) { alert("Connection error"); } finally { setLoadingInvite(false); }
  };

  if (!classroom) return <div style={{padding: 40}}>Loading class details...</div>;
  
  const isTeacher = user?.role === 'teacher';

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#f8f9fa', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {}
      {user?.role === 'teacher' ? <TeacherNavbar /> : <StudentNavbar />}

      {}
      <div style={{ 
          background: 'linear-gradient(135deg, #007bff 0%, #6610f2 100%)', 
          padding: '40px 10%', 
          color: 'white',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
      }}>
        <button 
          onClick={() => navigate('/classes')}
          style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', padding: '5px 15px', borderRadius: '20px', cursor: 'pointer', marginBottom: '20px', backdropFilter: 'blur(5px)' }}
        >
          ← Back to Classes
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
            <div>
                <h1 style={{ fontSize: '3rem', margin: 0, fontWeight: 800 }}>{classroom.name}</h1>
                <p style={{ fontSize: '1.2rem', opacity: 0.9, marginTop: '10px' }}>{classroom.description}</p>
            </div>
            
            {classroom.whiteboard_id && (
                <button
                    onClick={() => navigate(`/teacher/whiteboard/${classroom.whiteboard_id}`)}
                    style={{
                        padding: '12px 25px',
                        background: 'white',
                        color: '#6610f2',
                        border: 'none',
                        borderRadius: '30px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '10px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                        transition: 'transform 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <span style={{fontSize: '20px'}}>🎨</span> Open Class Board
                </button>
            )}
        </div>
      </div>

      {}
      <div style={{ padding: '0 20px', paddingBottom: '40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', maxWidth: '1200px', margin: '30px auto' }}>
            
            {}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e0e0e0', overflow: 'hidden' }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#6610f2', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>T</div>
                        <div>
                            <div style={{ fontWeight: '600' }}>Class Announcement</div>
                            <div style={{ fontSize: '12px', color: '#888' }}>Posted 2 hours ago</div>
                        </div>
                    </div>
                    <div style={{ padding: '20px' }}>
                        <p style={{ margin: 0, color: '#444', lineHeight: '1.6' }}>
                             <strong>Midterm Exams Update:</strong><br/>
                            The exam schedule has been finalized. Please check the "Materials" section below for the study guide PDF. Good luck preparing!
                        </p>
                    </div>
                </div>

                <div>
                    <h3 style={{ color: '#444', marginBottom: '15px' }}> Recent Materials</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #eee', textAlign: 'center', cursor: 'pointer', transition: 'box-shadow 0.2s' }}>
                            <div style={{ fontSize: '40px', marginBottom: '10px' }}>📄</div>
                            <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '5px' }}>Algebra Basics.pdf</div>
                            <div style={{ fontSize: '12px', color: '#888' }}>Uploaded Yesterday</div>
                        </div>

                        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #eee', textAlign: 'center', cursor: 'pointer' }}>
                            <div style={{ fontSize: '40px', marginBottom: '10px' }}>🎥</div>
                            <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '5px' }}>Week 3 Recording</div>
                            <div style={{ fontSize: '12px', color: '#888' }}>YouTube Link</div>
                        </div>

                        {isTeacher && (
                            <div style={{ border: '2px dashed #ddd', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', cursor: 'pointer', minHeight: '140px' }}>
                                + Add Material
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e0e0e0', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h4 style={{ margin: 0 }}>Upcoming</h4>
                        <span style={{ fontSize: '12px', color: '#007bff', cursor: 'pointer' }}>View all</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ background: '#ffeeba', color: '#856404', padding: '5px 10px', borderRadius: '6px', fontSize: '12px', height: 'fit-content', fontWeight: 'bold' }}>Tomorrow</div>
                            <div>
                                <div style={{ fontSize: '14px', fontWeight: '500' }}>Algebra Quiz 1</div>
                                <div style={{ fontSize: '12px', color: '#888' }}>Due 11:59 PM</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                             <div style={{ background: '#f8f9fa', color: '#666', border: '1px solid #ddd', padding: '5px 10px', borderRadius: '6px', fontSize: '12px', height: 'fit-content' }}>Dec 24</div>
                             <div>
                                <div style={{ fontSize: '14px', fontWeight: '500' }}>Essay Draft</div>
                                <div style={{ fontSize: '12px', color: '#888' }}>History</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e0e0e0' }}>
                    <h4 style={{ margin: '0 0 15px 0' }}>Classmates ({students.length})</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
                        {students.map(student => (
                            <div key={student.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#e9ecef', color: '#495057', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                                    {student.full_name.charAt(0)}
                                </div>
                                <div style={{ fontSize: '14px' }}>{student.full_name}</div>
                            </div>
                        ))}
                        {students.length === 0 && <div style={{ color: '#888', fontStyle: 'italic', fontSize: '13px' }}>No students yet</div>}
                    </div>
                </div>

                {isTeacher && (
                    <div style={{ background: 'black', color: 'white', padding: '20px', borderRadius: '12px' }}>
                        <h4 style={{ margin: '0 0 10px 0', color: 'white' }}>Add Student</h4>
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <input 
                                type="email" 
                                placeholder="Email..." 
                                value={inviteEmail} 
                                onChange={(e) => setInviteEmail(e.target.value)}
                                style={{ flex: 1, padding: '8px', borderRadius: '6px', border: 'none', fontSize: '13px' }}
                            />
                            <button 
                                onClick={handleInvite} 
                                disabled={loadingInvite}
                                style={{ background: '#007bff', color: 'white', border: 'none', borderRadius: '6px', padding: '0 10px', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                +
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ClassDetails;