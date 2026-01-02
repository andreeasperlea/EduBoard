import { useState } from 'react';
import type { Student } from '../../types';

interface PeopleTabProps {
    students: Student[];
    isTeacher: boolean;
    onInvite: (email: string) => void;
}

const PeopleTab = ({ students, isTeacher, onInvite }: PeopleTabProps) => {
    const [email, setEmail] = useState("");
    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={styles.card}>
                <h3 style={{marginTop:0}}>Students ({students.length})</h3>
                <ul style={{listStyle: 'none', padding: 0}}>
                    {students.map(s => (
                        <li key={s.id} style={{padding: '10px 0', borderBottom: '1px solid #eee'}}>{s.full_name}</li>
                    ))}
                    {students.length === 0 && <li style={{color: '#999'}}>No students enrolled.</li>}
                </ul>
                {isTeacher && (
                    <div style={{marginTop: 20, paddingTop: 20, borderTop: '1px solid #eee'}}>
                        <h4 style={{marginTop:0}}>Invite Student</h4>
                        <div style={{display:'flex', gap:10}}>
                            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Student Email..." style={styles.input} />
                            <button onClick={() => { onInvite(email); setEmail(""); }} style={styles.btn}>Invite</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    card: { border: '1px solid #e0e0e0', borderRadius: '8px', padding: '24px', background: '#fff' },
    input: { padding: '10px', borderRadius: '6px', border: '1px solid #ddd', flex: 1 },
    btn: { padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
};

export default PeopleTab;