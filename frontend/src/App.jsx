import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import FacultyList from './components/FacultyList';
import FacultyProfile from './components/FacultyProfile';

  function App() {
    // const [status, setStatus] = useState('loading...');

    // useEffect(() => {
    //   fetch('http://localhost:5000')
    //     .then(res => res.json())
    //     .then(data => setStatus(data.status));
    // }, []);

    // return <div>Backend says: {status}</div>;
    
    return (
      <Routes>
        <Route path="/faculty" element={<FacultyList />} />
        <Route path="/faculty/:name" element={<FacultyProfile />} />
      </Routes> 
    );

  }

  export default App;