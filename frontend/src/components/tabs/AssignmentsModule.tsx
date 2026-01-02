import { useState, useEffect } from 'react';
import type { Assignment, Submission } from '../../types';

interface AssignmentsModuleProps {
    classId: string;
    isTeacher: boolean;
}

const AssignmentsModule = ({ classId, isTeacher }: AssignmentsModuleProps) => {
    const token = localStorage.getItem('token');
    const [assignments, setAssignments] = useState<Assignment[]>([]);

    const [isCreating, setIsCreating] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const [newDate, setNewDate] = useState("");

    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    
    const [mySubmission, setMySubmission] = useState<Submission | null>(null);
    const [workText, setWorkText] = useState("");

    const [gradeInput, setGradeInput] = useState<string>(""); 
    const [feedbackInput, setFeedbackInput] = useState("");
    const [gradingSubId, setGradingSubId] = useState<string | null>(null);


    const fetchAssignments = async () => {
        const res = await fetch(`http://localhost:8000/api/v1/assignments/${classId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) setAssignments(await res.json());
    };

    useEffect(() => { fetchAssignments(); }, [classId]);

    const handleExpand = async (assignId: string) => {
        if (expandedId === assignId) {
            setExpandedId(null);
            return;
        }
        setExpandedId(assignId);

        if (isTeacher) {
     
            const res = await fetch(`http://localhost:8000/api/v1/assignments/${assignId}/submissions`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) setSubmissions(await res.json());
        } else {
           
            setMySubmission(null);
            const res = await fetch(`http://localhost:8000/api/v1/assignments/${assignId}/my-submission`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setMySubmission(data); 
                if (data) setWorkText(data.content_text || "");
            }
        }
    };
    const createAssignment = async () => {
        if (!newTitle || !newDate) return alert("Title and Date required");
        await fetch(`http://localhost:8000/api/v1/assignments/${classId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ title: newTitle, description: newDesc, due_date: new Date(newDate).toISOString() })
        });
        setIsCreating(false);
        setNewTitle(""); setNewDesc(""); setNewDate("");
        fetchAssignments();
    };

    const submitWork = async (assignId: string) => {
        const res = await fetch(`http://localhost:8000/api/v1/assignments/${assignId}/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ content_text: workText })
        });
        if (res.ok) {
            alert("Work submitted!");
    
            handleExpand(assignId);
        } else {
            alert("Error submitting.");
        }
    };

    const submitGrade = async (subId: string) => {
        const gradeVal = Number(gradeInput);
        
        if (gradeVal < 0 || gradeVal > 10) {
            return alert("Grade must be between 0 and 10.");
        }

        await fetch(`http://localhost:8000/api/v1/assignments/submissions/${subId}/grade`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ grade: gradeVal, feedback: feedbackInput })
        });
        alert("Graded successfully!");
        setGradingSubId(null);
        
        if (expandedId) {
             const res = await fetch(`http://localhost:8000/api/v1/assignments/${expandedId}/submissions`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) setSubmissions(await res.json());
        }
    };

    return (
        <div style={{ marginTop: 40 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ margin: 0 }}>📝 Assignments</h3>
                {isTeacher && (
                    <button onClick={() => setIsCreating(!isCreating)} style={styles.primaryBtn}>
                        {isCreating ? "Cancel" : "+ New Assignment"}
                    </button>
                )}
            </div>

            {isTeacher && isCreating && (
                <div style={styles.createForm}>
                    <input style={styles.input} placeholder="Title" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
                    <textarea style={{...styles.input, minHeight: 60}} placeholder="Description..." value={newDesc} onChange={e => setNewDesc(e.target.value)} />
                    <input placeholder="date" style={styles.input} type="date" value={newDate} onChange={e => setNewDate(e.target.value)} />
                    <button onClick={createAssignment} style={styles.actionBtn}>Create</button>
                </div>
            )}

            <div style={styles.list}>
                {assignments.length === 0 && <p style={{ color: '#999', fontStyle: 'italic' }}>No assignments yet.</p>}
                
                {assignments.map(assign => (
                    <div key={assign.id} style={styles.card}>
                        <div style={styles.cardHeader} onClick={() => handleExpand(assign.id)}>
                            <div>
                                <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{assign.title}</div>
                                <div style={{ fontSize: '0.9rem', color: '#666' }}>Due: {new Date(assign.due_date).toLocaleDateString()}</div>
                            </div>
                            <button style={styles.expandBtn}>{expandedId === assign.id ? "▲" : "▼"}</button>
                        </div>

                        {expandedId === assign.id && (
                            <div style={styles.details}>
                                <p style={{ whiteSpace: 'pre-wrap', marginBottom: 20 }}>{assign.description}</p>

                                {!isTeacher && (
                                    <div style={styles.studentZone}>
                                        <h4>My Work</h4>
                                        {mySubmission ? (
                                            <div style={{background: '#f0fdf4', border: '1px solid #bbf7d0', padding: 15, borderRadius: 6}}>
                                                <div style={{fontWeight: 'bold', color: '#166534', marginBottom: 5}}>✅ Submitted on {new Date(mySubmission.submitted_at).toLocaleString()}</div>
                                                <div style={{background: 'white', padding: 10, borderRadius: 4, border: '1px solid #ddd', marginBottom: 15}}>
                                                    {mySubmission.content_text}
                                                </div>
                                                
                                                <div style={{borderTop: '1px solid #bbf7d0', paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                                    <span style={{fontWeight: 'bold'}}>Grade:</span>
                                                    {mySubmission.grade !== null && mySubmission.grade !== undefined ? (
                                                        <span style={{fontSize: '1.2rem', fontWeight: 900, color: '#166534'}}>{mySubmission.grade} / 10</span>
                                                    ) : (
                                                        <span style={{color: '#888', fontStyle: 'italic'}}>Pending...</span>
                                                    )}
                                                </div>
                                                {mySubmission.feedback && (
                                                    <div style={{marginTop: 5, fontSize: '0.9rem', color: '#166534'}}>
                                                        <strong>Feedback:</strong> {mySubmission.feedback}
                                                    </div>
                                                )}
                                                
                                              
                                                <button onClick={() => setMySubmission(null)} style={{marginTop: 15, fontSize: '0.8rem', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', color: '#666'}}>Edit Submission</button>
                                            </div>
                                        ) : (
                                          
                                            <>
                                                <textarea 
                                                    value={workText} 
                                                    onChange={e => setWorkText(e.target.value)} 
                                                    placeholder="Type your answer here..." 
                                                    style={styles.textArea}
                                                />
                                                <button onClick={() => submitWork(assign.id)} style={styles.submitBtn}>Submit Assignment</button>
                                            </>
                                        )}
                                    </div>
                                )}
                                {isTeacher && (
                                    <div style={styles.teacherZone}>
                                        <h4>Submissions ({submissions.length})</h4>
                                        {submissions.length === 0 && <p style={{ fontSize: '0.9rem', color: '#888' }}>No submissions yet.</p>}
                                        
                                        {submissions.map(sub => (
                                            <div key={sub.id} style={styles.submissionCard}>
                                                <div style={{ marginBottom: 5 }}>
                                                    <strong>{sub.student_name}</strong>
                                                    <span style={{ fontSize: '0.8rem', marginLeft: 10, color: '#666' }}>
                                                        {new Date(sub.submitted_at).toLocaleString()}
                                                    </span>
                                                </div>
                                                <div style={styles.workBox}>{sub.content_text}</div>

                                                <div style={styles.gradeBox}>
                                                    {sub.grade !== null && sub.grade !== undefined ? (
                                                        <span style={{ color: 'green', fontWeight: 'bold' }}>Grade: {sub.grade}/10</span>
                                                    ) : (
                                                        <span style={{ color: 'orange', fontWeight: 'bold' }}>Not Graded</span>
                                                    )}
                                                    
                                                    <button onClick={() => setGradingSubId(gradingSubId === sub.id ? null : sub.id)} style={styles.textBtn}>
                                                        {gradingSubId === sub.id ? "Close" : "Grade"}
                                                    </button>
                                                </div>

                                                {gradingSubId === sub.id && (
                                                    <div style={{ marginTop: 10, display: 'flex', gap: 5, alignItems: 'center' }}>
                                                        <input 
                                                            type="number" 
                                                            min="0" max="10" 
                                                            placeholder="0-10" 
                                                            value={gradeInput}
                                                            onChange={e => setGradeInput(e.target.value)} 
                                                            style={{ width: 60, padding: 5, borderRadius: 4, border: '1px solid #ddd' }} 
                                                        />
                                                        <input 
                                                            type="text" 
                                                            placeholder="Feedback..." 
                                                            onChange={e => setFeedbackInput(e.target.value)} 
                                                            style={{ flex: 1, padding: 5, borderRadius: 4, border: '1px solid #ddd' }} 
                                                        />
                                                        <button onClick={() => submitGrade(sub.id)} style={styles.actionBtn}>Save</button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    primaryBtn: { background: '#2563eb', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
    createForm: { background: '#f9fafb', padding: 20, borderRadius: 8, marginBottom: 20, display: 'flex', flexDirection: 'column' as 'column', gap: 10 },
    input: { padding: '10px', borderRadius: '6px', border: '1px solid #ddd' },
    actionBtn: { background: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', alignSelf: 'flex-start' },
    list: { display: 'flex', flexDirection: 'column' as 'column', gap: 15 },
    card: { border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
    cardHeader: { background: '#fff', padding: '15px 20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    expandBtn: { background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#888' },
    details: { padding: '20px', background: '#fafafa', borderTop: '1px solid #eee' },
    studentZone: { background: '#fff', padding: 20, borderRadius: 8, border: '1px solid #e5e7eb' },
    textArea: { width: '100%', minHeight: 80, padding: 10, borderRadius: 6, border: '1px solid #ddd', marginBottom: 10, boxSizing: 'border-box' as 'border-box' },
    submitBtn: { background: '#000', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold' },
    teacherZone: { marginTop: 10 },
    submissionCard: { background: '#fff', padding: 15, borderRadius: 8, border: '1px solid #ddd', marginBottom: 10 },
    workBox: { background: '#f0f9ff', padding: 10, borderRadius: 4, margin: '10px 0', fontSize: '0.95rem' },
    gradeBox: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' },
    textBtn: { background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', textDecoration: 'underline' }
};

export default AssignmentsModule;