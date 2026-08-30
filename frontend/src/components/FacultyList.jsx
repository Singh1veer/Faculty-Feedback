// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { signOut } from '../lib/auth';
// function FacultyList() {
//   const [faculty, setFaculty] = useState([]);
//   const [searchName, setSearchName] = useState('');
//   const [searchDept, setSearchDept] = useState('');

//   // useEffect(() => {
//   //    console.log('API URL is:', import.meta.env.VITE_API_URL); 
//   //   const params = new URLSearchParams();
//   //   if (searchName) params.append('name', searchName);
//   //   if (searchDept) params.append('department', searchDept);

//   //   fetch(`${import.meta.env.VITE_API_URL}/api/faculty?${params.toString()}`)
//   //     .then((res) => res.json())
//   //     .then(setFaculty);
//   // }, [searchName, searchDept]);

// useEffect(() => {
//   console.log("========== FACULTY LIST LOADED ==========");
//   console.log("API URL is:", import.meta.env.VITE_API_URL);

//   const params = new URLSearchParams();

//   if (searchName) params.append("name", searchName);
//   if (searchDept) params.append("department", searchDept);

//   fetch(`${import.meta.env.VITE_API_URL}/api/faculty?${params.toString()}`)
//     .then((res) => res.json())
//     .then(setFaculty);
// }, [searchName, searchDept]);



//   return (
//     <div className="min-h-screen bg-paper">
//       <div className="mx-auto max-w-3xl px-6 py-16">
//         {/* Masthead */}
//         <div className="mb-10 border-b-2 border-ink pb-6">
//           <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brass-dark">
//             Campus Directory
//           </p>
//           <h1 className="font-display italic text-5xl text-ink mt-1">
//             Faculty Index
//           </h1>
//           <button onClick={signOut} className="font-mono text-xs uppercase text-oxblood">
//           Sign out
//          </button>
//         </div>

//         {/* Catalog search slip */}
//         <div className="mb-10 rounded-sm border border-rule bg-paper-raised p-5">
//           <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft mb-3">
//             Search records
//           </p>
//           <div className="flex flex-col sm:flex-row gap-3">
//             <input
//               type="text"
//               placeholder="Name…"
//               value={searchName}
//               onChange={(e) => setSearchName(e.target.value)}
//               className="flex-1 bg-transparent border-b border-rule px-1 py-2 text-ink placeholder-ink-soft/60 outline-none focus:border-brass transition-colors duration-200"
//             />
//             <input
//               type="text"
//               placeholder="Department…"
//               value={searchDept}
//               onChange={(e) => setSearchDept(e.target.value)}
//               className="flex-1 bg-transparent border-b border-rule px-1 py-2 text-ink placeholder-ink-soft/60 outline-none focus:border-brass transition-colors duration-200"
//             />
//           </div>
//         </div>

//         {/* Ledger rows */}
//         <div className="border-t border-rule">
//           {faculty.length === 0 && (
//             <p className="font-mono text-sm text-ink-soft py-8 text-center">
//               No matching records.
//             </p>
//           )}
//           {faculty.map((f) => (
//             <Link
//               key={f.id}
//               to={`/faculty/${f.name}`}
//               className="group flex items-center justify-between gap-4 border-b border-rule py-4 px-1 hover:bg-paper-raised transition-colors duration-150"
//             >
//               <span className="font-display text-xl text-ink group-hover:text-brass-dark transition-colors duration-150">
//                 {f.name}
//               </span>
//               <span className="font-mono text-[11px] uppercase tracking-wider text-ivy border border-ivy/30 rounded-full px-3 py-1 whitespace-nowrap">
//                 {f.department}
//               </span>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default FacultyList;


import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { signOut } from '../lib/auth';

function initials(name) {
  return name.replace(/^Dr\.\s*/i, '').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function FacultyList() {
  const [faculty, setFaculty] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchDept, setSearchDept] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);
  const isSignedIn = !!localStorage.getItem('access_token');

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchName) params.append('name', searchName);
    if (searchDept) params.append('department', searchDept);
    fetch(`${import.meta.env.VITE_API_URL}/api/faculty?${params.toString()}`)
      .then(res => res.json())
      .then(data => { setFaculty(data); setLoading(false); });
  }, [searchName, searchDept]);

  return (
    <div className="min-h-screen bg-paper">
      <div className="mx-auto max-w-2xl px-6 py-14">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-oxblood">
              Student-submitted · Fall 2026
            </p>
            <h1 className="font-display text-4xl text-ink mt-1">Professor Report Card</h1>
            <p className="text-ink-soft text-sm mt-1">{faculty.length} professors on file</p>
          </div>
          {isSignedIn && (
            <button onClick={signOut} className="font-mono text-xs uppercase text-ink-soft hover:text-oxblood transition-colors">
              Sign out
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft">🔍</span>
            <input
              value={searchName}
              onChange={e => setSearchName(e.target.value)}
              placeholder="Search by name…"
              className="w-full rounded-full bg-white border border-rule pl-10 pr-4 py-3 text-sm outline-none focus:border-brass transition-colors"
            />
          </div>
          <select
            value={searchDept}
            onChange={e => setSearchDept(e.target.value)}
            className="rounded-full bg-white border border-rule px-4 py-3 text-sm outline-none focus:border-brass transition-colors"
          >
            <option value="">All departments</option>
          </select>
        </div>

        <div className="rounded-2xl bg-white shadow-sm overflow-hidden divide-y divide-rule">
          {loading && (
            <div className="p-6 space-y-4">
              {[1,2,3].map(i => <div key={i} className="h-12 bg-paper-raised/60 rounded animate-pulse" />)}
            </div>
          )}
          {!loading && faculty.length === 0 && (
            <p className="p-8 text-center text-sm text-ink-soft">No matching records.</p>
          )}
          {!loading && faculty.map(f => (
            <div key={f.id}>
              <button
                onClick={() => setExpanded(expanded === f.id ? null : f.id)}
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-paper-raised/50 transition-colors text-left"
              >
                <div className="w-11 h-11 rounded-full bg-brass/20 flex items-center justify-center font-mono text-sm text-brass-dark font-medium shrink-0">
                  {initials(f.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-lg text-ink truncate">{f.name}</p>
                  <p className="text-ink-soft text-sm truncate">{f.department}</p>
                </div>
                <span className={`text-ink-soft transition-transform duration-200 ${expanded === f.id ? 'rotate-90' : ''}`}>›</span>
              </button>

              {expanded === f.id && (
                <FacultyPreview facultyId={f.id} name={f.name} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FacultyPreview({ facultyId, name }) {
  const [summary, setSummary] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/faculty/${facultyId}/rating-summary`)
      .then(res => res.json()).then(setSummary);
    fetch(`${import.meta.env.VITE_API_URL}/api/faculty/${facultyId}/comments`)
      .then(res => res.json()).then(data => setComments(data.slice(0, 1)));
  }, [facultyId]);

  return (
    <div className="px-5 pb-5 bg-paper-raised/30 animate-[fadeIn_0.2s_ease]">
      {comments[0] && (
        <p className="text-ink italic text-sm border-l-2 border-brass pl-3 py-1 mb-3">
          "{comments[0].text}"
        </p>
      )}
      <Link
        to={`/faculty/${name}`}
        className="font-mono text-xs uppercase text-oxblood hover:underline"
      >
        View full record →
      </Link>
    </div>
  );
}

export default FacultyList;