import { useState } from 'react';
import Head from 'next/head';

export default function Hiring() {
  const [jobs] = useState([
    { id: 1, title: 'Senior Developer', department: 'Engineering', applications: 5, status: 'Active' },
    { id: 2, title: 'Marketing Manager', department: 'Marketing', applications: 3, status: 'Active' }
  ]);

  const [candidates] = useState([
    { id: 1, name: 'John Smith', position: 'Senior Developer', stage: 'Interview', applied: '2 days ago' },
    { id: 2, name: 'Sarah Wilson', position: 'Senior Developer', stage: 'Applied', applied: '1 day ago' },
    { id: 3, name: 'Mike Johnson', position: 'Marketing Manager', stage: 'Offer', applied: '1 week ago' }
  ]);

  return (
    <>
      <Head>
        <title>Hiring - HR SaaS Platform</title>
      </Head>
      
      <div style={{ padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <h1 style={{ color: '#1e293b', marginBottom: '30px' }}>Hiring & Recruitment</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          {/* Job Postings */}
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginBottom: '20px' }}>Active Job Postings ({jobs.length})</h2>
            
            {jobs.map(job => (
              <div key={job.id} style={{ 
                padding: '15px', 
                borderBottom: '1px solid #e2e8f0', 
                marginBottom: '10px'
              }}>
                <h3 style={{ margin: '0 0 5px 0', color: '#1e293b' }}>{job.title}</h3>
                <p style={{ margin: '5px 0', color: '#64748b' }}>{job.department} • {job.applications} applications</p>
                <span style={{ 
                  background: '#10b981', 
                  color: 'white', 
                  padding: '2px 8px', 
                  borderRadius: '12px', 
                  fontSize: '12px' 
                }}>
                  {job.status}
                </span>
              </div>
            ))}
          </div>

          {/* Candidate Pipeline */}
          <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginBottom: '20px' }}>Candidate Pipeline ({candidates.length})</h2>
            
            {candidates.map(candidate => (
              <div key={candidate.id} style={{ 
                padding: '15px', 
                borderBottom: '1px solid #e2e8f0', 
                marginBottom: '10px'
              }}>
                <h3 style={{ margin: '0 0 5px 0', color: '#1e293b' }}>{candidate.name}</h3>
                <p style={{ margin: '5px 0', color: '#64748b' }}>{candidate.position} • Applied {candidate.applied}</p>
                <span style={{ 
                  background: candidate.stage === 'Offer' ? '#f59e0b' : candidate.stage === 'Interview' ? '#3b82f6' : '#6b7280', 
                  color: 'white', 
                  padding: '2px 8px', 
                  borderRadius: '12px', 
                  fontSize: '12px' 
                }}>
                  {candidate.stage}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <button 
          onClick={() => window.history.back()}
          style={{ 
            marginTop: '20px',
            padding: '10px 20px', 
            background: '#2563eb', 
            color: 'white', 
            border: 'none', 
            borderRadius: '6px', 
            cursor: 'pointer' 
          }}
        >
          ← Back to Dashboard
        </button>
      </div>
    </>
  );
}