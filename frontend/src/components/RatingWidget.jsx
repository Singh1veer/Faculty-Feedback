// import { useState } from 'react';
// import { getOrCreateDeviceToken } from '../lib/deviceToken';

// function RatingWidget({ facultyId, onRated }) {
//   const [selected, setSelected] = useState(0);
//   const [hovered, setHovered] = useState(0);
//   const [submitted, setSubmitted] = useState(false);
//   const [alreadyRated, setAlreadyRated] = useState(false);

//   const handleRate = async (score) => {
//     setSelected(score);
//     const deviceToken = getOrCreateDeviceToken();

//     const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ratings`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ facultyId, score, deviceToken }),
//     });

//     if (res.status === 409) {
//       setAlreadyRated(true);
//       return;
//     }

//     if (res.ok) {
//       setSubmitted(true);
//       if (onRated) onRated();
//     }
//   };

//   const handleReRate = async () => {
//     const deviceToken = getOrCreateDeviceToken();
//     const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ratings/${facultyId}`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ score: selected, deviceToken }),
//     });
//     if (res.ok) {
//       setSubmitted(true);
//       setAlreadyRated(false);
//       if (onRated) onRated();
//     }
//   };

//   if (submitted) {
//     return (
//       <p className="font-mono text-sm text-ivy">
//         Thanks for rating {selected} ⭐
//       </p>
//     );
//   }

//   if (alreadyRated) {
//     return (
//       <div className="flex flex-col gap-2">
//         <p className="font-mono text-sm text-ink-soft">
//           You've already rated this faculty member.
//         </p>
//         <div className="flex gap-2">
//           <button
//             onClick={handleReRate}
//             className="font-mono text-xs uppercase text-ivy border-b border-ivy/40 hover:border-ivy"
//           >
//             Re-rate as {selected} ⭐
//           </button>
//           <button
//             onClick={() => setAlreadyRated(false)}
//             className="font-mono text-xs uppercase text-ink-soft"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col gap-2">
//       <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
//         Rate this faculty member
//       </p>
//       <div className="flex gap-1" onMouseLeave={() => setHovered(0)}>
//         {[1, 2, 3, 4, 5].map((n) => (
//           <button
//             key={n}
//             onClick={() => handleRate(n)}
//             onMouseEnter={() => setHovered(n)}
//             aria-label={`Rate ${n} star${n > 1 ? 's' : ''}`}
//             className={`text-3xl leading-none transition-transform duration-150 hover:scale-110 focus-visible:outline-brass focus-visible:outline-offset-2 ${
//               (hovered || selected) >= n ? 'text-brass' : 'text-rule'
//             }`}
//           >
//             ★
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default RatingWidget;



import { useState } from 'react';
import { getOrCreateDeviceToken } from '../lib/deviceToken';

function RatingWidget({ facultyId, onRated }) {
  const [selected, setSelected] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [alreadyRated, setAlreadyRated] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleRate = async (score) => {
    setSelected(score);
    setSubmitting(true);
    const deviceToken = getOrCreateDeviceToken();
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ratings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ facultyId, score, deviceToken }),
    });
    setSubmitting(false);
    if (res.status === 409) { setAlreadyRated(true); return; }
    if (res.ok) { setSubmitted(true); if (onRated) onRated(); }
  };

  const handleReRate = async () => {
    setSubmitting(true);
    const deviceToken = getOrCreateDeviceToken();
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ratings/${facultyId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score: selected, deviceToken }),
    });
    setSubmitting(false);
    if (res.ok) { setSubmitted(true); setAlreadyRated(false); if (onRated) onRated(); }
  };

  if (submitted) {
    return <p className="font-mono text-sm text-ivy animate-[fadeIn_0.3s_ease]">Thanks for rating {selected} ⭐</p>;
  }

  if (alreadyRated) {
    return (
      <div className="flex flex-col gap-3 animate-[fadeIn_0.2s_ease]">
        <p className="text-sm text-ink-soft">You've already rated this faculty member.</p>
        <div className="flex gap-4">
          <button onClick={handleReRate} disabled={submitting} className="font-mono text-xs uppercase text-ivy border-b border-ivy/40 hover:border-ivy transition-colors disabled:opacity-50">
            {submitting ? 'Saving…' : `Re-rate as ${selected} ⭐`}
          </button>
          <button onClick={() => setAlreadyRated(false)} className="font-mono text-xs uppercase text-ink-soft hover:text-ink transition-colors">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">Your rating</p>
      <div className="flex gap-1" onMouseLeave={() => setHovered(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => handleRate(n)}
            onMouseEnter={() => setHovered(n)}
            disabled={submitting}
            aria-label={`Rate ${n} star${n > 1 ? 's' : ''}`}
            className={`text-3xl leading-none transition-transform duration-150 hover:scale-125 disabled:opacity-40 ${(hovered || selected) >= n ? 'text-brass' : 'text-rule'}`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
}

export default RatingWidget;