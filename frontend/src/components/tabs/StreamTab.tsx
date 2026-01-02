
import { useState } from 'react';
import type { ClassroomData } from '../../types';

interface StreamTabProps {
    classroom: ClassroomData;
    isTeacher: boolean;
    onPost: (content: string) => void;
}

const StreamTab = ({ classroom, isTeacher, onPost }: StreamTabProps) => {
    const [text, setText] = useState("");
    
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {isTeacher && (
                <div style={styles.card}>
                    <h4 style={styles.cardTitle}> Announce something</h4>
                    <textarea 
                        value={text} onChange={(e) => setText(e.target.value)}
                        placeholder="Write something..." style={styles.textarea}
                    />
                    <div style={{textAlign: 'right'}}>
                        <button onClick={() => { onPost(text); setText(""); }} style={styles.actionButton}>Post</button>
                    </div>
                </div>
            )}
            <div style={{...styles.card, marginTop: 20}}>
                <h3 style={styles.sectionHeader}>Class Board</h3>
                {classroom.announcements.length === 0 && <p style={{color: '#999', fontStyle: 'italic'}}>No announcements yet.</p>}
                {classroom.announcements.map((ann) => (
                    <div key={ann.id} style={styles.announcementItem}>
                        <div style={{fontSize: '0.85rem', color: '#888', marginBottom: '8px'}}>
                            <strong>{ann.author_name}</strong> • {new Date(ann.posted_at).toLocaleString()}
                        </div>
                        <div style={{whiteSpace: 'pre-wrap', lineHeight: 1.5}}>{ann.content}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    card: { border: '1px solid #e0e0e0', borderRadius: '8px', padding: '24px', marginBottom: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
    cardTitle: { marginTop: 0, marginBottom: '15px', fontSize: '1.2rem' },
    textarea: { width: '100%', minHeight: '100px', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', fontFamily: 'inherit', marginBottom: '10px', boxSizing: 'border-box' as 'border-box' },
    actionButton: { padding: '10px 24px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
    sectionHeader: { borderBottom: '2px solid #f1f3f5', paddingBottom: '10px', marginBottom: '20px' },
    announcementItem: { borderBottom: '1px solid #f1f3f5', padding: '20px 0' },
};

export default StreamTab;