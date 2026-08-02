import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function FacultyProfile() {
  const { name } = useParams();
  const [faculty, setFaculty] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/api/faculty/${name}`)
      .then(res => {
        if (res.status === 404) {
          setNotFound(true);
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data) setFaculty(data);
      });
  }, [name]);

  if (notFound) return <div>Faculty member not found.</div>;
  if (!faculty) return <div>Loading...</div>;

  return (
    <div>
      <h1>{faculty.name}</h1>
      <p>Department: {faculty.department}</p>
    </div>
  );
}

export default FacultyProfile;