import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../services/api';
import { useSelector } from 'react-redux';

function Dashboard() {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      fetchUserProfile();
    }
  }, [isAuthenticated, navigate]);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await getProfile(token);
      setUserInfo(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>
      {userInfo ? (
        <div>
          <p>Welcome, {userInfo.username}!</p>
          <p>Email: {userInfo.email}</p>
          <button onClick={() => navigate('/study-group')}>View Study Groups</button>
        </div>
      ) : (
        <p>Loading user information...</p>
      )}
    </div>
  );
}

export default Dashboard;
