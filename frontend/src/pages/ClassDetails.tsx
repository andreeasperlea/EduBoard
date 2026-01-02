import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useCurrentUser from '../hooks/useCurrentUser';
import TeacherNavbar from '../components/TeacherNavbar'; 
import StudentNavbar from '../components/StudentNavbar';
import type { ClassroomData, AttendanceSession, Student } from '../types';
import StreamTab from '../components/tabs/StreamTab';
import ClassworkTab from '../components/tabs/ClassworkTab';
import PeopleTab from '../components/tabs/PeopleTab';
import AttendanceTab from '../components/tabs/AttendanceTab';
import GradebookTab from '../components/tabs/GradebookTab';

const ClassDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useCurrentUser();
  const token = localStorage.getItem('token');

  const [activeTab, setActiveTab] = useState<'stream' | 'classwork' | 'people' | 'attendance' | 'gradebook'>('stream');
  
  const [classroom, setClassroom] = useState<ClassroomData | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceSession, setAttendanceSession] = useState<AttendanceSession | null>(null);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const fetchData = async () => {
    try {
        const res = await fetch(`http://localhost:8000/api/v1/classes/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
        if(res.ok) {
            const data = await res.json();
            if (!data.announcements) data.announcements = [];
            if (!data.resources) data.resources = [];
            data.announcements.reverse(); 
            setClassroom(data);
        }
        const resStudents = await fetch(`http://localhost:8000/api/v1/classes/${id}/students`, { headers: { 'Authorization': `Bearer ${token}` } });
        if(resStudents.ok) setStudents(await resStudents.json() || []);
        fetchAttendanceStatus();
    } catch(err) { console.error(err); }
  };

  const fetchAttendanceStatus = async () => {
      try {
          const res = await fetch(`http://localhost:8000/api/v1/attendance/${id}/active`, { headers: { 'Authorization': `Bearer ${token}` } });
          if (res.ok) {
              const session = await res.json();
              setAttendanceSession(session);
              if (user && session.present_student_ids.includes(user.id)) setHasCheckedIn(true);
          } else { setAttendanceSession(null); }
      } catch (e) { setAttendanceSession(null); }
  };

  useEffect(() => { fetchData(); const i = setInterval(fetchAttendanceStatus, 5000); return () => clearInterval(i); }, [id, user]);

  const handlePost = async (content: string) => {
      if(!content) return;
      await fetch(`http://localhost:8000/api/v1/classes/${id}/announcements`, {
          method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ content })
      });
      fetchData();
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
  };

  const handleAddResource = async (title: string, type: 'link'|'pdf', url: string, file: File|null) => {
    if(!title) return alert("Title required");
    let payloadData = null;
    if (type === 'pdf' && file) {
        payloadData = await convertToBase64(file);
    }
    await fetch(`http://localhost:8000/api/v1/classes/${id}/resources`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title, type, url: type === 'link' ? url : "", fileData: payloadData })
    });
    fetchData();
  };

  const handleInvite = async (email: string) => {
      if(!email) return;
      await fetch(`http://localhost:8000/api/v1/classes/${id}/invite`, {
          method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ email })
      });
      fetchData();
  };

  const startAtt = async () => { await fetch(`http://localhost:8000/api/v1/attendance/${id}/start`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } }); fetchAttendanceStatus(); };
  const stopAtt = async () => { await fetch(`http://localhost:8000/api/v1/attendance/${id}/stop`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` } }); setAttendanceSession(null); };
  const checkIn = async (code: string) => {
      const res = await fetch(`http://localhost:8000/api/v1/attendance/${id}/checkin`, {
          method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ code: String(code) })
      });
      if (res.ok) { setHasCheckedIn(true); alert("Checked in!"); fetchAttendanceStatus(); } 
      else { alert("Invalid Code"); }
  };

  if (!classroom) return <div style={{padding: 40}}>Loading...</div>;
  const isTeacher = user?.role === 'teacher';

  return (
    <div style={styles.pageContainer}>
      {user?.role === 'teacher' ? <TeacherNavbar /> : <StudentNavbar />}
      <div style={styles.hero}>
        <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>{classroom.name}</h1>
            <p style={styles.heroDesc}>{classroom.description}</p>
            {classroom.whiteboard_id && (
                <button onClick={() => navigate(`/teacher/whiteboard/${classroom.whiteboard_id}`)} style={styles.whiteboardBtn}>
                    🎨 Open Whiteboard
                </button>
            )}
        </div>
      </div>
      <div style={styles.tabBar}>
          <div style={styles.tabContainer}>
            <button onClick={() => setActiveTab('stream')} style={activeTab === 'stream' ? styles.activeTab : styles.tab}>Stream</button>
            <button onClick={() => setActiveTab('classwork')} style={activeTab === 'classwork' ? styles.activeTab : styles.tab}>Classwork</button>
            <button onClick={() => setActiveTab('people')} style={activeTab === 'people' ? styles.activeTab : styles.tab}>People</button>
            <button onClick={() => setActiveTab('attendance')} style={activeTab === 'attendance' ? styles.activeTab : styles.tab}>Attendance</button>
{isTeacher && (
    <button onClick={() => setActiveTab('gradebook')} style={activeTab === 'gradebook' ? styles.activeTab : styles.tab}>
        Grades
    </button>
)}
          </div>
      </div>
      <div style={styles.mainContent}>
          {activeTab === 'stream' && <StreamTab classroom={classroom} isTeacher={isTeacher} onPost={handlePost} />}
          {activeTab === 'classwork' && <ClassworkTab classroom={classroom} isTeacher={isTeacher} onAddResource={handleAddResource} />}
          {activeTab === 'people' && <PeopleTab students={students} isTeacher={isTeacher} onInvite={handleInvite} />}
          {activeTab === 'attendance' && <AttendanceTab classId={classroom.id} isTeacher={isTeacher} session={attendanceSession} onStart={startAtt} onStop={stopAtt} onCheckIn={checkIn} userCheckInStatus={hasCheckedIn} />}
          {activeTab === 'gradebook' && isTeacher && <GradebookTab classId={classroom.id} />}
      </div>
    </div>
  );
};

const styles = {
    pageContainer: { fontFamily: 'Inter, sans-serif', backgroundColor: '#fff', minHeight: '100vh', color: '#333' },
    hero: { background: '#2563eb', color: 'white', padding: '40px 20px' },
    heroContent: { maxWidth: '1000px', margin: '0 auto' },
    heroTitle: { margin: 0, fontSize: '2.5rem', fontWeight: 700 },
    heroDesc: { margin: '10px 0 20px 0', fontSize: '1.1rem', opacity: 0.9 },
    whiteboardBtn: { background: 'white', color: '#2563eb', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' },
    tabBar: { borderBottom: '1px solid #e0e0e0', background: '#fff', position: 'sticky' as 'sticky', top: 0 },
    tabContainer: { maxWidth: '1000px', margin: '0 auto', display: 'flex', gap: '30px', padding: '0 20px' },
    tab: { background: 'none', border: 'none', borderBottom: '3px solid transparent', padding: '15px 5px', fontSize: '1rem', color: '#666', cursor: 'pointer', fontWeight: 500 },
    activeTab: { background: 'none', border: 'none', borderBottom: '3px solid #2563eb', padding: '15px 5px', fontSize: '1rem', color: '#2563eb', cursor: 'pointer', fontWeight: 700 },
    mainContent: { maxWidth: '1000px', margin: '0 auto', padding: '30px 20px' },
};

export default ClassDetails;