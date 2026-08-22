import { useState, useEffect } from 'react';

function AdminFacultyManage() {
  const [faculty, setFaculty] = useState([]);
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');

  useEffect(() => { fetchFaculty(); }, []);

  function fetchFaculty() {
    fetch(`${import.meta.env.VITE_API_URL}/api/faculty`).then(res => res.json()).then(setFaculty);
  }

  function addFaculty() {
    const token = localStorage.getItem('access_token');
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/faculty`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ name, department }),
    }).then(() => { setName(''); setDepartment(''); fetchFaculty(); });
  }

  function deleteFaculty(id) {
    const token = localStorage.getItem('access_token');
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/faculty/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    }).then(fetchFaculty);
  }

  return (
    <div>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
      <input value={department} onChange={e => setDepartment(e.target.value)} placeholder="Department" />
      <button onClick={addFaculty}>Add Faculty</button>

      {faculty.map(f => (
        <div key={f.id}>
          {f.name} — {f.department}
          <button onClick={() => deleteFaculty(f.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default AdminFacultyManage;