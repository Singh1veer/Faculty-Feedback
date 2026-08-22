import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import RatingWidget from "./RatingWidget";
import VerifyModal from "./VerifyModal";
import CommentForm from "./CommentForm";
import CommentList from './CommentList';
function FacultyProfile() {
  const { name } = useParams();
  const [faculty, setFaculty] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [ratingSummary, setRatingSummary] = useState(null);
  const [commentRefreshKey, setCommentRefreshKey] = useState(0);


//<<--------------------------check if we have verified or not------------>>>
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      // confirm it's still actually valid, not just present
      fetch(`${import.meta.env.VITE_API_URL}/api/protected-test`, {
        headers: { 'Authorization': `Bearer ${token}` },
      }).then(res => setIsVerified(res.ok));
    }
  }, []);
//<<--------------------------------------------------------------------------->>>>>>>>


  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/faculty/${name}`)
      .then((res) => {
        if (res.status === 404) {
          setNotFound(true);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setFaculty(data);
      });
  }, [name]);

  useEffect(() => {
    if (!faculty) return;
    fetchRatingSummary();
  }, [faculty]);

  function fetchRatingSummary() {
    fetch(`${import.meta.env.VITE_API_URL}/api/faculty/${faculty.id}/rating-summary`)
      .then((res) => res.json())
      .then(setRatingSummary);
  }

  const shellClass = "min-h-screen bg-paper flex items-center justify-center px-6 py-16";

  if (notFound) {
    return (
      <div className={shellClass}>
        <div className="text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-oxblood">
            Record not found
          </p>
          <p className="font-display italic text-2xl text-ink mt-2">
            No entry for “{name}”
          </p>
          <Link
            to="/faculty"
            className="inline-block mt-6 font-mono text-xs uppercase tracking-wider text-ivy border-b border-ivy/40 hover:border-ivy pb-0.5"
          >
            ← Back to directory
          </Link>
        </div>
      </div>
    );
  }
  
  if (!faculty) {
    return (
      <div className={shellClass}>
        <p className="font-mono text-sm text-ink-soft animate-pulse">
          Retrieving record…
        </p>
      </div>
    );
  }
  
  return (
    <div className={shellClass}>
      <div className="w-full max-w-md">
        <Link
          to="/faculty"
          className="inline-block mb-6 font-mono text-xs uppercase tracking-wider text-ivy border-b border-ivy/40 hover:border-ivy pb-0.5"
        >
          ← Directory
        </Link>
        {/* Index card */}
        <div className="relative rounded-sm border border-rule bg-paper-raised px-8 pt-9 pb-8 shadow-[0_1px_0_var(--color-rule)]">
          {/* brass corner tab */}
          <div className="absolute -top-3 left-8 bg-brass text-paper-raised font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-sm">
            Faculty Record
          </div>

          <h1 className="font-display text-4xl text-ink mt-2">{faculty.name}</h1>
          <p className="font-mono text-xs uppercase tracking-widest text-ivy mt-2">
            {faculty.department}
          </p>

          <div className="my-6 border-t border-rule" />

          <RatingWidget facultyId={faculty.id} onRated={fetchRatingSummary} />

          <div className="mt-6 pt-5 border-t border-rule">
            {ratingSummary ? (
              ratingSummary.total === "0" || ratingSummary.total === 0 ? (
                <p className="font-mono text-sm text-ink-soft">No ratings yet</p>
              ) : (
                <p className="font-mono text-sm text-ink">
                  <span className="text-brass">{ratingSummary.average} ★</span>
                  <span className="text-ink-soft"> · {ratingSummary.total} ratings</span>
                </p>
              )
            ) : (
              <p className="font-mono text-sm text-ink-soft">Loading ratings…</p>
            )}
            
          </div>
        </div>
      </div>

      {isVerified ? (
              <CommentForm facultyId={faculty.id} onCommentSubmitted={() => {() => setCommentRefreshKey(prev => prev + 1)}} />
            ) : (
              <VerifyModal onVerified={() => setIsVerified(true)} />
            )}
            <h3>Comments</h3>
            <CommentList facultyId={faculty.id} refreshKey={commentRefreshKey} />
    </div>
  );
}

export default FacultyProfile;
