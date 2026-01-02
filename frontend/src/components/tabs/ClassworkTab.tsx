import { useState } from 'react';
import type { ClassroomData } from '../../types';
import AssignmentsModule from './AssignmentsModule';

interface ClassworkTabProps {
    classroom: ClassroomData;
    isTeacher: boolean;
    onAddResource: (title: string, type: 'link'|'pdf', url: string, file: File|null) => void;
}

const ClassworkTab = ({ classroom, isTeacher, onAddResource }: ClassworkTabProps) => {
   
    const [title, setTitle] = useState("");
    const [link, setLink] = useState("");
    const [type, setType] = useState<'link' | 'pdf'>('link');
    const [file, setFile] = useState<File | null>(null);

    const handleAdd = () => {
        onAddResource(title, type, link, file);
        setTitle(""); 
        setLink(""); 
        setFile(null);
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            
            {}
            {isTeacher && (
                <div style={styles.card}>
                    <h4 style={{marginTop: 0, marginBottom: 15}}> Add Material</h4>
                    <div style={styles.resourceForm}>
                        <div style={{display: 'flex', gap: 5}}>
                            <button 
                                onClick={() => setType('link')} 
                                style={{...styles.toggleBtn, background: type === 'link' ? '#333' : '#eee', color: type === 'link' ? '#fff' : '#333'}}
                            >
                                Link
                            </button>
                            <button 
                                onClick={() => setType('pdf')} 
                                style={{...styles.toggleBtn, background: type === 'pdf' ? '#333' : '#eee', color: type === 'pdf' ? '#fff' : '#333'}}
                            >
                                PDF
                            </button>
                        </div>
                        
                        <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 10}}>
                            <input 
                                value={title} 
                                onChange={e=>setTitle(e.target.value)} 
                                placeholder="Material Title..." 
                                style={styles.input} 
                            />
                            {type === 'link' ? (
                                <input 
                                    value={link} 
                                    onChange={e=>setLink(e.target.value)} 
                                    placeholder="https://example.com" 
                                    style={styles.input} 
                                />
                            ) : (
                                <input 
                                    placeholder='pdf...'
                                    type="file" 
                                    accept="application/pdf" 
                                    onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} 
                                    style={styles.input} 
                                />
                            )}
                        </div>
                        <button onClick={handleAdd} style={styles.addBtn}>Add</button>
                    </div>
                </div>
            )}
            
            <h3 style={styles.sectionHeader}>Learning Materials</h3>
            
            <div style={styles.grid}>
                {classroom.resources.map((res) => (
                    <a key={res.id} href={res.url || '#'} target="_blank" rel="noreferrer" style={styles.resourceCard}>
                        <div style={{fontSize: '24px', marginBottom: '10px'}}>
                            {res.type === 'pdf' ? '📕' : '🔗'}
                        </div>
                        <div style={{fontWeight: 'bold', color: '#333', fontSize: '0.95rem'}}>
                            {res.title}
                        </div>
                    </a>
                ))}
                {classroom.resources.length === 0 && (
                    <p style={{color: '#999', fontStyle: 'italic', gridColumn: '1 / -1'}}>
                        No materials uploaded yet.
                    </p>
                )}
            </div>
            
            <div style={styles.assignmentSection}>
                <AssignmentsModule classId={classroom.id} isTeacher={isTeacher} />
            </div>

        </div>
    );
};

const styles = {
    card: { 
        border: '1px solid #e0e0e0', 
        borderRadius: '8px', 
        padding: '20px', 
        background: '#fff',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
    },
    sectionHeader: { 
        marginTop: 40, 
        borderBottom: '1px solid #ddd', 
        paddingBottom: 10,
        color: '#444'
    },
    resourceForm: { 
        display: 'flex', 
        gap: '15px', 
        alignItems: 'flex-start', 
        background: '#f9fafb', 
        padding: 15, 
        borderRadius: 8 
    },
    toggleBtn: { 
        padding: '6px 12px', 
        border: '1px solid #ddd', 
        borderRadius: '6px', 
        cursor: 'pointer', 
        fontSize: '12px', 
        fontWeight: '600' 
    },
    input: { 
        padding: '10px', 
        borderRadius: '6px', 
        border: '1px solid #ddd', 
        width: '100%', 
        boxSizing: 'border-box' as 'border-box' 
    },
    addBtn: { 
        padding: '8px 16px', 
        background: '#fff', 
        color: '#333', 
        border: '1px solid #ddd', 
        borderRadius: '6px', 
        cursor: 'pointer', 
        fontWeight: '600', 
        alignSelf: 'center' 
    },
    grid: { 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
        gap: '15px', 
        marginTop: 20 
    },
    resourceCard: { 
        border: '1px solid #e5e7eb', 
        padding: '20px', 
        borderRadius: '8px', 
        textDecoration: 'none', 
        display: 'flex', 
        flexDirection: 'column' as 'column', 
        alignItems: 'center', 
        textAlign: 'center' as 'center', 
        cursor: 'pointer', 
        background: '#fff',
        transition: 'transform 0.1s',
    },
    assignmentSection: {
        marginTop: 20,

    }
};

export default ClassworkTab;