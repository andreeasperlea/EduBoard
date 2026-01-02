import { useEffect, useState } from 'react';

interface GradebookTabProps {
    classId: string;
}

const GradebookTab = ({ classId }: GradebookTabProps) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await fetch(`http://localhost:8000/api/v1/classes/${classId}/gradebook`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    setData(await res.json());
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [classId]);

    if (loading) return <div style={{padding: 20}}>Loading grades...</div>;
    if (!data || data.rows.length === 0) return <div style={{padding: 20, color: '#666', fontStyle: 'italic'}}>No students or data found.</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', overflowX: 'auto' }}>
            <div style={styles.card}>
                <h3 style={{ marginTop: 0 }}>📊 Gradebook</h3>
                
                <table style={styles.table}>
                    <thead>
                        <tr style={{ background: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                            <th style={{ ...styles.th, minWidth: '150px', position: 'sticky', left: 0, background: '#f9fafb', zIndex: 2 }}>Student</th>
                            {data.assignments.map((a: any) => (
                                <th key={a.id} style={styles.th}>
                                    <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 150}} title={a.title}>
                                        {a.title}
                                    </div>
                                </th>
                            ))}
                            <th style={{ ...styles.th, background: '#f0fdf4', color: '#166534' }}>Average</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.rows.map((row: any) => {
                            // Calculate Average on the fly
                            const grades = Object.values(row.grades).filter((g: any) => g !== null && g !== undefined) as number[];
                            const avg = grades.length > 0 
                                ? (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(1) 
                                : "-";

                            return (
                                <tr key={row.student_id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ ...styles.td, position: 'sticky', left: 0, background: '#fff', fontWeight: 'bold', zIndex: 1 }}>
                                        {row.student_name}
                                    </td>
                                    {data.assignments.map((a: any) => {
                                        const grade = row.grades[a.id];
                                        let color = '#333';
                                        if (grade >= 9) color = '#166534'; // Green
                                        else if (grade < 5) color = '#dc2626'; // Red

                                        return (
                                            <td key={a.id} style={{ ...styles.td, textAlign: 'center', color: grade !== undefined ? color : '#ccc' }}>
                                                {grade !== undefined && grade !== null ? grade : '-'}
                                            </td>
                                        );
                                    })}
                                    <td style={{ ...styles.td, textAlign: 'center', fontWeight: 'bold', background: '#f0fdf4' }}>
                                        {avg}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const styles = {
    card: { border: '1px solid #e0e0e0', borderRadius: '8px', padding: '20px', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
    table: { width: '100%', borderCollapse: 'collapse' as 'collapse', fontSize: '0.95rem' },
    th: { padding: '12px 15px', textAlign: 'left' as 'left', fontWeight: '600', color: '#4b5563', borderBottom: '2px solid #e5e7eb' },
    td: { padding: '12px 15px', borderBottom: '1px solid #f3f4f6' }
};

export default GradebookTab;