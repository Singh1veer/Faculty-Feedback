import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function FacultyList() {
  const [faculty, setFaculty] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchDept, setSearchDept] = useState('');
  

  // useEffect(() => {
  //   fetch('http://localhost:5000/api/faculty')
  //     .then(res => res.json())
  //     .then(setFaculty);
  // }, []);

  useEffect(() => {
  const params = new URLSearchParams();
  if (searchName) params.append('name' , searchName);
  if (searchDept) params.append('department' , searchDept);

  fetch(`http://localhost:5000/api/faculty?${params.toString()}`)
    .then(res => res.json())
    .then(setFaculty);
}, [searchName, searchDept]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-yellow-50 p-8">
        <input
  type="text"
  placeholder="Search by name..."
  value={searchName}
  onChange={(e) => setSearchName(e.target.value)}
  className="px-4 py-2 m-2 rounded-full border-2 border-purple-200 bg-purple-50 text-purple-900 placeholder-purple-400 outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-200 transition-all duration-200"
/>
<br />
<input
  type="text"
  placeholder="Search by dept..."
  value={searchDept}
  onChange={(e) => setSearchDept(e.target.value)}
  className="px-4 py-2 m-2 rounded-full border-2 border-pink-200 bg-pink-50 text-pink-900 placeholder-pink-400 outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-200 transition-all duration-200"
/>

        {faculty.map(f => (
          <div key={f.name}>
            <Link to={`/faculty/${f.name}`}>{f.name} — {f.department}</Link>
          </div>
        ))}
    </div>
  );
}

export default FacultyList;