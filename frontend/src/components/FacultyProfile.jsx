// import { useState, useEffect } from "react";
// import { useParams, Link } from "react-router-dom";
// import RatingWidget from "./RatingWidget";
// import VerifyModal from "./GoogleSignIn";
// import CommentForm from "./CommentForm";
// import CommentList from "./CommentList";
// import CommentsPage from "./CommentsPage";
// import { signOut } from '../lib/auth';
// function FacultyProfile() {
//   const { name } = useParams();
//   const [faculty, setFaculty] = useState(null);
//   const [notFound, setNotFound] = useState(false);
//   const [ratingSummary, setRatingSummary] = useState(null);
//   //<<--------------------------------------------------------------------------->>>>>>>>
//   useEffect(() => {
//     fetch(`${import.meta.env.VITE_API_URL}/api/faculty/${name}`)
//       .then((res) => {
//         if (res.status === 404) {
//           setNotFound(true);
//           return null;
//         }
//         return res.json();
//       })
//       .then((data) => {
//         if (data) setFaculty(data);
//       });
//   }, [name]);

//   useEffect(() => {
//     if (!faculty) return;
//     fetchRatingSummary();
//   }, [faculty]);

//   function fetchRatingSummary() {
//     fetch(
//       `${import.meta.env.VITE_API_URL}/api/faculty/${faculty.id}/rating-summary`,
//     )
//       .then((res) => res.json())
//       .then(setRatingSummary);
//   }

//   const shellClass =
//     "min-h-screen bg-paper flex items-center justify-center px-6 py-16";

//   if (notFound) {
//     return (
//       <div className={shellClass}>
//         <div className="text-center">
//           <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-oxblood">
//             Record not found
//           </p>
//           <p className="font-display italic text-2xl text-ink mt-2">
//             No entry for “{name}”
//           </p>
//           <Link
//             to="/faculty"
//             className="inline-block mt-6 font-mono text-xs uppercase tracking-wider text-ivy border-b border-ivy/40 hover:border-ivy pb-0.5"
//           >
//             ← Back to directory
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   if (!faculty) {
//     return (
//       <div className={shellClass}>
//         <p className="font-mono text-sm text-ink-soft animate-pulse">
//           Retrieving record…
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className={shellClass}>
//       <div className="w-full max-w-md">
//         <Link
//           to="/faculty"
//           className="inline-block mb-6 font-mono text-xs uppercase tracking-wider text-ivy border-b border-ivy/40 hover:border-ivy pb-0.5"
//         >
//           ← Directory
//         </Link>
//         <button onClick={signOut} className="font-mono text-xs uppercase text-oxblood">
//           Sign out
//          </button>
//         {/* Index card */}
//         <div className="relative rounded-sm border border-rule bg-paper-raised px-8 pt-9 pb-8 shadow-[0_1px_0_var(--color-rule)]">
//           {/* brass corner tab */}
//           <div className="absolute -top-3 left-8 bg-brass text-paper-raised font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-sm">
//             Faculty Record
//           </div>

//           <h1 className="font-display text-4xl text-ink mt-2">
//             {faculty.name}
//           </h1>
//           <p className="font-mono text-xs uppercase tracking-widest text-ivy mt-2">
//             {faculty.department}
//           </p>

//           <div className="my-6 border-t border-rule" />

//           <RatingWidget facultyId={faculty.id} onRated={fetchRatingSummary} />

//           <div className="mt-6 pt-5 border-t border-rule">
//             {ratingSummary ? (
//               ratingSummary.total === "0" || ratingSummary.total === 0 ? (
//                 <p className="font-mono text-sm text-ink-soft">
//                   No ratings yet
//                 </p>
//               ) : (
//                 <p className="font-mono text-sm text-ink">
//                   <span className="text-brass">{ratingSummary.average} ★</span>
//                   <span className="text-ink-soft">
//                     {" "}
//                     · {ratingSummary.total} ratings
//                   </span>
//                 </p>
//               )
//             ) : (
//               <p className="font-mono text-sm text-ink-soft">
//                 Loading ratings…
//               </p>
//             )}
//           </div>
//         </div>
//       </div>

//       <Link
//         to={`/faculty/${name}/comments`}
//         className="inline-block mt-6 font-mono text-xs uppercase tracking-wider text-ivy border-b border-ivy/40 hover:border-ivy pb-0.5"
//       >
//         View & write comments →
//       </Link>
//     </div>
//   );
// }

// export default FacultyProfile;


import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { signOut } from '../lib/auth';
import RatingWidget from './RatingWidget';

function initials(name) {
  return name.replace(/^Dr\.\s*/i, '').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function gradeFor(avg) {
  if (avg >= 4.5) return 'A+';
  if (avg >= 4.0) return 'A';
  if (avg >= 3.5) return 'B+';
  if (avg >= 3.0) return 'B';
  if (avg >= 2.0) return 'C';
  return 'D';
}

function FacultyProfile() {
  const { name } = useParams();
  const [faculty, setFaculty] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [ratingSummary, setRatingSummary] = useState(null);
  const [breakdown, setBreakdown] = useState(null);
  const [comments, setComments] = useState([]);
  const isSignedIn = !!localStorage.getItem('access_token');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/faculty/${name}`)
      .then(res => res.status === 404 ? (setNotFound(true), null) : res.json())
      .then(data => { if (data) setFaculty(data); });
  }, [name]);

  useEffect(() => {
    if (!faculty) return;
    fetchRatings();
    fetch(`${import.meta.env.VITE_API_URL}/api/faculty/${faculty.id}/comments`)
      .then(res => res.json()).then(setComments);
  }, [faculty]);

  function fetchRatings() {
    fetch(`${import.meta.env.VITE_API_URL}/api/faculty/${faculty.id}/rating-summary`)
      .then(res => res.json()).then(setRatingSummary);
    fetch(`${import.meta.env.VITE_API_URL}/api/faculty/${faculty.id}/rating-breakdown`)
      .then(res => res.json()).then(setBreakdown);
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper px-6">
        <div className="text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-oxblood">Record not found</p>
          <p className="font-display italic text-2xl text-ink mt-2">No entry for "{name}"</p>
          <Link to="/faculty" className="inline-block mt-6 font-mono text-xs uppercase text-ivy border-b border-ivy/40">
            ← Back to directory
          </Link>
        </div>
      </div>
    );
  }

  if (!faculty) {
    return <div className="min-h-screen flex items-center justify-center bg-paper">
      <p className="font-mono text-sm text-ink-soft animate-pulse">Retrieving record…</p>
    </div>;
  }

  const avg = ratingSummary ? parseFloat(ratingSummary.average) || 0 : 0;
  const total = ratingSummary ? parseInt(ratingSummary.total) || 0 : 0;
  const maxCount = breakdown ? Math.max(...Object.values(breakdown), 1) : 1;

  return (
    <div className="min-h-screen bg-paper px-6 py-14">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link to="/faculty" className="font-mono text-xs uppercase text-ivy border-b border-ivy/40 hover:border-ivy transition-colors">
            ← Directory
          </Link>
          {isSignedIn && (
            <button onClick={signOut} className="font-mono text-[11px] uppercase text-ink-soft hover:text-oxblood transition-colors">
              Sign out
            </button>
          )}
        </div>

        {/* Header card */}
        <div className="rounded-2xl bg-white shadow-sm p-6 mb-4 animate-[fadeIn_0.3s_ease]">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 rounded-full bg-brass/20 flex items-center justify-center font-mono text-lg text-brass-dark font-medium shrink-0">
              {initials(faculty.name)}
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">{faculty.department}</p>
              <h1 className="font-display text-3xl text-ink">{faculty.name}</h1>
            </div>
          </div>
          {total > 0 ? (
            <p className="text-ink-soft text-sm mt-2">
              {avg.toFixed(1)}/5 · Grade <span className="font-medium text-ink">{gradeFor(avg)}</span> · {total} student review{total !== 1 ? 's' : ''}
            </p>
          ) : (
            <p className="text-ink-soft text-sm mt-2">No ratings yet</p>
          )}

          <div className="mt-5 pt-5 border-t border-rule">
            <RatingWidget facultyId={faculty.id} onRated={fetchRatings} />
          </div>
        </div>

        {/* Rating breakdown */}
        {breakdown && total > 0 && (
          <div className="rounded-2xl bg-white shadow-sm p-6 mb-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft mb-4">Rating breakdown</p>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map(star => (
                <div key={star} className="flex items-center gap-3 text-sm">
                  <span className="w-6 font-mono text-ink-soft">{star}★</span>
                  <div className="flex-1 h-2 rounded-full bg-paper-raised overflow-hidden">
                    <div
                      className="h-full bg-ink/70 rounded-full transition-all duration-500"
                      style={{ width: `${(breakdown[star] / maxCount) * 100}%` }}
                    />
                  </div>
                  <span className="w-6 text-right font-mono text-ink-soft text-xs">{breakdown[star]}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lab & contact */}
        {(faculty.designation || faculty.location || faculty.researchLab || faculty.office || faculty.email) && (
          <div className="rounded-2xl bg-white shadow-sm p-6 mb-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft mb-4">Lab &amp; contact</p>
            <div className="space-y-3 text-sm">
              {faculty.designation && (
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-ink-soft shrink-0">Designation</span>
                  <span className="text-ink text-right">{faculty.designation}</span>
                </div>
              )}
              {faculty.researchLab && (
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-ink-soft shrink-0">Research Lab</span>
                  <span className="text-ink text-right">{faculty.researchLab}</span>
                </div>
              )}
              {(faculty.location || faculty.office) && (
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-ink-soft shrink-0">Office</span>
                  <span className="text-ink text-right">{faculty.location || faculty.office}</span>
                </div>
              )}
              {faculty.email && (
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-ink-soft shrink-0">Email</span>
                  <a href={`mailto:${faculty.email}`} className="text-ink text-right hover:text-brass-dark transition-colors">
                    {faculty.email}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recent reviews */}
        <div className="rounded-2xl bg-white shadow-sm p-6 mb-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft mb-4">Recent reviews</p>
          {comments.length === 0 ? (
            <p className="text-ink-soft text-sm italic">No reviews yet — be the first to share.</p>
          ) : (
            <div className="space-y-4">
              {comments.slice(0, 3).map(c => (
                <div key={c.id} className="border-l-2 border-brass/40 pl-3">
                  <p className="italic text-ink text-sm leading-relaxed">"{c.text}"</p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-ink-soft mt-1">{c.semester}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <Link
            to={`/faculty/${name}/comments`}
            className="inline-block bg-ink text-paper font-mono text-xs uppercase tracking-wide py-3 px-8 rounded-full hover:bg-ink/90 active:scale-[0.98] transition-all duration-150"
          >
            Write a review
          </Link>
        </div>
      </div>
    </div>
  );
}

export default FacultyProfile;