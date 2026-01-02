import { useState } from 'react';
import type { AttendanceSession } from '../../types';

interface AttendanceTabProps {
    classId: string;
    isTeacher: boolean;
    session: AttendanceSession | null;
    onStart: () => void;
    onStop: () => void;
    onCheckIn: (code: string) => void;
    userCheckInStatus: boolean;
}

const AttendanceTab = ({ classId, isTeacher, session, onStart, onStop, onCheckIn, userCheckInStatus }: AttendanceTabProps) => {
    const [code, setCode] = useState("");

    const handleDownload = async () => {
        const token = localStorage.getItem('token');
       
        const res = await fetch(`http://localhost:8000/api/v1/attendance/${classId}/export`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = "Attendance_Report.pdf";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } else {
            alert("Error downloading report");
        }
    };
    
    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <div style={styles.card}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
                    <h2 style={{margin:0}}>Digital Attendance</h2>
                    {isTeacher && (
                        <button onClick={handleDownload} style={styles.downloadBtn}>
                            PDF Report
                        </button>
                    )}
                </div>
                
                {isTeacher ? (
                    <div>
                        {!session ? (
                            <div style={{padding: '20px 0'}}>
                                <p>No active session.</p>
                                <button onClick={onStart} style={{...styles.btn, background: '#000'}}>Start Session</button>
                            </div>
                        ) : (
                            <div>
                                <p style={{color: '#666'}}>Code for students:</p>
                                <div style={styles.bigCode}>{session.code}</div>
                                <div style={{fontSize: '1.5rem', marginBottom: 30}}>Present: <strong>{session.present_count}</strong></div>
                                <button onClick={onStop} style={{...styles.btn, background: 'transparent', color: 'red', border: '1px solid red'}}>Stop Session</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        {userCheckInStatus ? (
                            <div style={styles.successBox}>You are PRESENT!</div>
                        ) : (
                            session ? (
                                <div>
                                    <p>Enter 4-digit code:</p>
                                    <input 
                                        value={code} onChange={e=>setCode(e.target.value)} 
                                        maxLength={4} placeholder="0000"
                                        style={styles.codeInput} 
                                    />
                                    <br/>
                                    <button onClick={() => onCheckIn(code)} style={styles.btn}>Check In</button>
                                </div>
                            ) : (
                                <div style={{color: '#888', fontStyle: 'italic', padding: 20}}>Attendance closed.</div>
                            )
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    card: { border: '2px solid #000', borderRadius: '8px', padding: '40px', background: '#fff' },
    btn: { padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' },
    downloadBtn: { padding: '6px 12px', background: '#eee', color: '#333', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 },
    bigCode: { fontSize: '4rem', fontWeight: '900', letterSpacing: 10, margin: '20px 0' },
    successBox: { padding: 20, background: '#dcfce7', color: '#166534', borderRadius: 8, fontSize: '1.2rem', fontWeight: 'bold' },
    codeInput: { padding: '10px', borderRadius: '6px', border: '1px solid #ddd', textAlign: 'center' as 'center', fontSize: '2rem', letterSpacing: 10, width: '200px', marginBottom: 20 }
};

export default AttendanceTab;