import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function UserInfo({ loggedUser, onLogout }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); 
  const [loggedInUser, setLoggedInUser] = React.useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const getUserDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/user/details/${encodeURIComponent(loggedUser.email)}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Basic ' + btoa('admin@admin.com:admin')
          }
      });
      
      if (response.ok) {
          const data = await response.json();
          setUser({ firstName: data.firstName, lastName: data.lastName, email: data.email, role: 'User' });
      } else {
          console.error('Error:', response.statusText);
      }
    } catch (error) {
        setError('Error connecting to the server. Please try again.');
    } finally {
        setLoading(false);
    }
};

useEffect(() => {
  if (loggedUser) {
    getUserDetails();
  }
}, [loggedUser]);

  const handleLogout = () => {
    console.log('User logged out');
    onLogout();
    navigate('/');
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!user) {
    return <div>No user data available.</div>;
  }

  return (
    <div className="user-info">
      <h2>User Information</h2>
      <div>
        <label>First Name: {user.firstName}</label>
      </div>
      <div>
        <label>Last Name: {user.lastName}</label>
      </div>
      <div>
        <label>Email: {user.email}</label>
      </div>

      <div className="buttons">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default UserInfo;
