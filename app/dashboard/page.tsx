'use client';

import { useState } from 'react';

export default function Dashboard() {
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function generateCourse() {
    setLoading(true);
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Sample Certificate in Leadership',
        courseType: 'CERTIFICATE',
        audience: 'Community Leaders',
        durationWeeks: 8,
        depth: 'STANDARD',
        language: 'en',
        country: 'Australia',
        ministryMode: false,
      }),
    });
    const data = await res.json();
    setCourse(data.course);
    setLoading(false);
  }

  async function download(format: 'pdf' | 'docx') {
    const res = await fetch('/api/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ course, format }),
    });
    const blob = await res.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `course.${format}`;
    a.click();
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Dashboard</h1>

      <button onClick={generateCourse} disabled={loading}>
        {loading ? 'Generating…' : 'Generate Course'}
      </button>

      {course && (
        <>
          <h2>{course.title}</h2>
          <button onClick={() => download('pdf')}>Download PDF</button>
          <button onClick={() => download('docx')}>Download DOCX</button>
        </>
      )}
    </div>
  );
}
