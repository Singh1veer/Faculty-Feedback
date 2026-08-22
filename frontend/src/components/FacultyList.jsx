import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function FacultyList() {
  const [faculty, setFaculty] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchDept, setSearchDept] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchName) params.append('name', searchName);
    if (searchDept) params.append('department', searchDept);

    fetch(`${import.meta.env.VITE_API_URL}/api/faculty?${params.toString()}`)
      .then((res) => res.json())
      .then(setFaculty);
  }, [searchName, searchDept]);

  return (
    <div className="min-h-screen bg-paper">
      <div className="mx-auto max-w-3xl px-6 py-16">
        {/* Masthead */}
        <div className="mb-10 border-b-2 border-ink pb-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-brass-dark">
            Campus Directory
          </p>
          <h1 className="font-display italic text-5xl text-ink mt-1">
            Faculty Index
          </h1>
        </div>

        {/* Catalog search slip */}
        <div className="mb-10 rounded-sm border border-rule bg-paper-raised p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft mb-3">
            Search records
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Name…"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="flex-1 bg-transparent border-b border-rule px-1 py-2 text-ink placeholder-ink-soft/60 outline-none focus:border-brass transition-colors duration-200"
            />
            <input
              type="text"
              placeholder="Department…"
              value={searchDept}
              onChange={(e) => setSearchDept(e.target.value)}
              className="flex-1 bg-transparent border-b border-rule px-1 py-2 text-ink placeholder-ink-soft/60 outline-none focus:border-brass transition-colors duration-200"
            />
          </div>
        </div>

        {/* Ledger rows */}
        <div className="border-t border-rule">
          {faculty.length === 0 && (
            <p className="font-mono text-sm text-ink-soft py-8 text-center">
              No matching records.
            </p>
          )}
          {faculty.map((f) => (
            <Link
              key={f.id}
              to={`/faculty/${f.name}`}
              className="group flex items-center justify-between gap-4 border-b border-rule py-4 px-1 hover:bg-paper-raised transition-colors duration-150"
            >
              <span className="font-display text-xl text-ink group-hover:text-brass-dark transition-colors duration-150">
                {f.name}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-ivy border border-ivy/30 rounded-full px-3 py-1 whitespace-nowrap">
                {f.department}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FacultyList;
