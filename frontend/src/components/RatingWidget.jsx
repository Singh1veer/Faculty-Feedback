import { useState } from 'react';

function RatingWidget({ facultyId, onRated }) {
  const [selected, setSelected] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleRate = async (score) => {
    setSelected(score);
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ratings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ facultyId, score }),
    });
    if (res.ok) setSubmitted(true);
    if (onRated) onRated();
  };

  if (submitted) {
    return (
      <p className="font-mono text-sm text-ivy">
        Thanks for rating {selected} ⭐
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
        Rate this faculty member
      </p>
      <div className="flex gap-1" onMouseLeave={() => setHovered(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => handleRate(n)}
            onMouseEnter={() => setHovered(n)}
            aria-label={`Rate ${n} star${n > 1 ? 's' : ''}`}
            className={`text-3xl leading-none transition-transform duration-150 hover:scale-110 focus-visible:outline focus-visible:outline- focus-visible:outline-brass focus-visible:outline-offset-2 ${
              (hovered || selected) >= n ? 'text-brass' : 'text-rule'
            }`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
}

export default RatingWidget;
