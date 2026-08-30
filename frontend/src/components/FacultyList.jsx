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

const AVATAR_COLORS = [
  'bg-brass/20 text-brass-dark',
  'bg-oxblood/15 text-oxblood',
  'bg-ivy/15 text-ivy',
  'bg-ink/10 text-ink-soft',
];

function initials(name) {
  return name.replace(/^Dr\.\s*/i, '').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function colorFor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function FacultyList() {
  const [faculty, setFaculty] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchDept, setSearchDept] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [detailCache, setDetailCache] = useState({});
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

  function toggleExpand(f) {
    if (expandedId === f.id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(f.id);
    if (!detailCache[f.id]) {
      Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/faculty/${f.id}/rating-breakdown`).then(r => r.json()),
        fetch(`${import.meta.env.VITE_API_URL}/api/faculty/${f.id}/comments`).then(r => r.json()),
      ]).then(([breakdown, comments]) => {
        setDetailCache(prev => ({ ...prev, [f.id]: { breakdown, comments } }));
      });
    }
  }

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
            <button
              onClick={signOut}
              className="font-mono text-xs uppercase tracking-wide text-ink-soft hover:text-oxblood transition-colors duration-150 mt-2"
            >
              Sign out
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft text-sm">🔍</span>
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
              {[1, 2, 3].map(i => <div key={i} className="h-14 bg-paper-raised/60 rounded animate-pulse" />)}
            </div>
          )}
          {!loading && faculty.length === 0 && (
            <p className="p-8 text-center text-sm text-ink-soft">No matching records.</p>
          )}
          {!loading && faculty.map(f => {
            const avg = parseFloat(f.average) || 0;
            const total = parseInt(f.total) || 0;
            const isOpen = expandedId === f.id;
            const detail = detailCache[f.id];
            const maxCount = detail?.breakdown ? Math.max(...Object.values(detail.breakdown), 1) : 1;
            const latestComment = detail?.comments?.[0];

            return (
              <div key={f.id}>
                <button
                  type="button"
                  onClick={() => toggleExpand(f)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center gap-4 px-5 py-4 hover:bg-paper-raised/50 transition-colors duration-150 text-left"
                >
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center font-mono text-sm font-medium shrink-0 ${colorFor(f.name)}`}>
                    {initials(f.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-lg text-ink truncate">{f.name}</p>
                    <p className="text-ink-soft text-sm truncate">
                      {f.department}{total > 0 ? ` · ${avg.toFixed(1)}/5 · ${total} review${total !== 1 ? 's' : ''}` : ' · No reviews yet'}
                    </p>
                  </div>
                  <span className={`text-ink-soft transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-90' : ''}`}>›</span>
                </button>

                {/* Unfold: grid-template-rows 0fr -> 1fr smoothly animates height without a fixed max-height */}
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-in-out bg-paper-raised/30 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 pb-5 pt-1">
                      {!detail && (
                        <p className="font-mono text-xs text-ink-soft py-4">Loading details…</p>
                      )}
                      {detail && (
                        <div className="flex flex-col sm:flex-row gap-6 pt-3">
                          <div className="flex-1 min-w-0">
                            {latestComment ? (
                              <p className="italic text-ink text-sm leading-relaxed">"{latestComment.text}"</p>
                            ) : (
                              <p className="italic text-ink-soft text-sm">No reviews yet — be the first to share.</p>
                            )}
                            <Link
                              to={`/faculty/${f.name}`}
                              className="inline-block mt-3 font-mono text-[11px] uppercase tracking-wider text-ivy border-b border-ivy/40 hover:border-ivy transition-colors"
                            >
                              View full record →
                            </Link>
                          </div>
                          {total > 0 && detail.breakdown && (
                            <div className="sm:w-56 shrink-0 space-y-1.5">
                              {[5, 4, 3, 2, 1].map(star => (
                                <div key={star} className="flex items-center gap-2 text-xs">
                                  <span className="w-5 font-mono text-ink-soft">{star}★</span>
                                  <div className="flex-1 h-1.5 rounded-full bg-paper overflow-hidden">
                                    <div
                                      className="h-full bg-ink/70 rounded-full transition-all duration-500"
                                      style={{ width: `${(detail.breakdown[star] / maxCount) * 100}%` }}
                                    />
                                  </div>
                                  <span className="w-4 text-right font-mono text-ink-soft">{detail.breakdown[star]}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default FacultyList;