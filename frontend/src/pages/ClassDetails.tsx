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

  if (!classroom) return <div style={{padding: 20}}>Loading...</div>;
  
  const isTeacher = user?.role === 'teacher';

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#fff', minHeight: '100vh' }}>
      
      {}
      {user?.role === 'teacher' ? <TeacherNavbar /> : <StudentNavbar />}

      {}
      <div style={{ padding: '20px 40px', borderBottom: '1px solid #ddd', backgroundColor: '#f8f9fa' }}>
        <button 
          onClick={() => navigate('/classes')}
          style={{ background: 'transparent', border: 'none', color: 'blue', cursor: 'pointer', marginBottom: '10px', fontSize: '14px', textDecoration: 'underline' }}
        >
          Back to Classes
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
                <h1 style={{ margin: 0, fontSize: '28px', color: '#333' }}>{classroom.name}</h1>
                <p style={{ margin: '5px 0 0 0', color: '#666' }}>{classroom.description}</p>
            </div>
            
            {classroom.whiteboard_id && (
                <button
                    onClick={() => navigate(`/teacher/whiteboard/${classroom.whiteboard_id}`)}
                    style={{
                        padding: '10px 20px',
                        background: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                    }}
                >
                    Open Whiteboard
                </button>
            )}
        </div>
      </div>

      {}
      <div style={{ padding: '20px 40px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
            
            {}
            <div>
                {}
                <div style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '15px', marginBottom: '20px', background: '#fff' }}>
                    <h3 style={{ marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Latest Announcement</h3>
                    <p style={{ color: '#444', lineHeight: '1.5' }}>
                        <strong>Anuturi importante:</strong><br/>
                        Aici o sa punem textul pentru anunturi mai tarziu.
                        Schimbam textul mai tarziu cand avem toata implementarea facuta.
                    </p>
                </div>

                <div>
                    <h3 style={{ color: '#333' }}>Course Materials</h3>
                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                        {/* Material Card 1 */}
                        <div style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '15px', width: '200px', background: '#fff' }}>
                            <div style={{ fontWeight: 'bold' }}>Curs_1.pdf</div>
                            <div style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>Uploaded Yesterday</div>
                        </div>

                        {}
                        <div style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '15px', width: '200px', background: '#fff' }}>
                            <div style={{ fontWeight: 'bold' }}>Tema_Lab.docx</div>
                            <div style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>Link extern</div>
                        </div>
                    </div>
                </div>
            </div>

            {}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {}
                <div style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '15px', background: '#f9f9f9' }}>
                    <h4 style={{ margin: '0 0 10px 0' }}>Upcoming Deadlines</h4>
                    <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '14px' }}>
                        <li style={{ marginBottom: '5px' }}>Quiz Tehnologii Web - MAINE</li>
                        <li>PROIECT ALED (Dec 24)</li>
                    </ul>
                </div>

                {}
                <div style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '15px', background: '#fff' }}>
                    <h4 style={{ margin: '0 0 10px 0' }}>Students ({students.length})</h4>
                    <ul style={{ paddingLeft: '20px', margin: 0, maxHeight: '200px', overflowY: 'auto' }}>
                        {students.map(student => (
                            <li key={student.id} style={{ fontSize: '14px', marginBottom: '5px' }}>
                                {student.full_name}
                            </li>
                        ))}
                        {students.length === 0 && <li style={{color: '#999'}}>No students joined yet.</li>}
                    </ul>
                </div>

                {}
                {isTeacher && (
                    <div style={{ border: '1px solid #333', borderRadius: '4px', padding: '15px', background: '#333', color: 'white' }}>
                        <h4 style={{ margin: '0 0 10px 0' }}>Invite Student</h4>
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <input 
                                type="email" 
                                placeholder="Student email..." 
                                value={inviteEmail} 
                                onChange={(e) => setInviteEmail(e.target.value)}
                                style={{ flex: 1, padding: '5px' }}
                            />
                            <button onClick={handleInvite} disabled={loadingInvite}>
                                Add
                            </button>
                        </div>
                    </div>
                )}
            </div>
      </div>
    </div>
  );
};

export default ClassDetails;