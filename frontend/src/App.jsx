import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import FacultyList from './components/FacultyList';
import FacultyProfile from './components/FacultyProfile';
import { useNavigate } from 'react-router-dom';
import AdminPage from './components/AdminPage';
import CommentsPage from './components/CommentsPage';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');

    if (accessToken) {
      localStorage.setItem('access_token', accessToken);
      window.history.replaceState(null, '', window.location.pathname);
      navigate('/faculty');
    }
  }, [navigate]);
  
    return (
      <Routes>
        <Route path="/faculty" element={<FacultyList />} />
        <Route path="/faculty/:name" element={<FacultyProfile />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/faculty/:name/comments" element={<CommentsPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes> 
    );

  }

  export default App;