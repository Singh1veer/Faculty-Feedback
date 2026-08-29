// import { useState, useEffect } from 'react';

// function AdminFacultyManage() {
//   const [faculty, setFaculty] = useState([]);
//   const [name, setName] = useState('');
//   const [department, setDepartment] = useState('');

//   useEffect(() => { fetchFaculty(); }, []);

//   function fetchFaculty() {
//     fetch(`${import.meta.env.VITE_API_URL}/api/faculty`).then(res => res.json()).then(setFaculty);
//   }

//   function addFaculty() {
//     const token = localStorage.getItem('access_token');
//     fetch(`${import.meta.env.VITE_API_URL}/api/admin/faculty`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
//       body: JSON.stringify({ name, department }),
//     }).then(() => { setName(''); setDepartment(''); fetchFaculty(); });
//   }

//   function deleteFaculty(id) {
//     const token = localStorage.getItem('access_token');
//     fetch(`${import.meta.env.VITE_API_URL}/api/admin/faculty/${id}`, {
//       method: 'DELETE',
//       headers: { 'Authorization': `Bearer ${token}` },
//     }).then(fetchFaculty);
//   }

//   return (
//     <div>
//       <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
//       <input value={department} onChange={e => setDepartment(e.target.value)} placeholder="Department" />
//       <button onClick={addFaculty}>Add Faculty</button>

//       {faculty.map(f => (
//         <div key={f.id}>
//           {f.name} — {f.department}
//           <button onClick={() => deleteFaculty(f.id)}>Delete</button>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default AdminFacultyManage;



import { useState, useEffect } from 'react';

function AdminFacultyManage() {
  const [faculty, setFaculty] = useState([]);
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchFaculty(); }, []);

  function fetchFaculty() {
    fetch(`${import.meta.env.VITE_API_URL}/api/faculty`).then(res => res.json()).then(setFaculty);
  }

  function addFaculty() {
    if (!name || !department) return;
    setSubmitting(true);
    const token = localStorage.getItem('access_token');
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/faculty`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ name, department }),
    }).then(() => { setName(''); setDepartment(''); setSubmitting(false); fetchFaculty(); });
  }

  function deleteFaculty(id) {
    const token = localStorage.getItem('access_token');
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/faculty/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    }).then(fetchFaculty);
  }

  return (
    <div className="rounded-sm border border-rule bg-paper-raised p-5">
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          value={name} onChange={e => setName(e.target.value)} placeholder="Name"
          className="flex-1 border border-rule px-3 py-2 font-mono text-sm bg-paper outline-none focus:border-brass transition-colors duration-150"
        />
        <input
          value={department} onChange={e => setDepartment(e.target.value)} placeholder="Department"
          className="flex-1 border border-rule px-3 py-2 font-mono text-sm bg-paper outline-none focus:border-brass transition-colors duration-150"
        />
        <button
          onClick={addFaculty}
          disabled={submitting}
          className="bg-ivy text-paper font-mono text-xs uppercase py-2 px-5 hover:bg-ivy/90 transition-colors duration-150 disabled:opacity-50 whitespace-nowrap"
        >
          {submitting ? 'Adding…' : 'Add Faculty'}
        </button>
      </div>

      <div className="divide-y divide-rule">
        {faculty.map(f => (
          <div key={f.id} className="flex items-center justify-between py-3">
            <span className="font-mono text-sm text-ink">{f.name} — {f.department}</span>
            <button
              onClick={() => deleteFaculty(f.id)}
              className="font-mono text-[10px] uppercase text-oxblood/80 hover:text-oxblood transition-colors duration-150"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminFacultyManage;