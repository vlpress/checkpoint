import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './user/login';
import UsersTable from './user/userTable';
import RegisterUser from './user/registerUser';
import UserInfo from './user/userInfo';

function App() {
  const [loggedInUser, setLoggedInUser] = React.useState(null);
  const handleLogin = (user) => {
      setLoggedInUser(user);
  };

  const handleLogout = () => {
    setLoggedInUser(null);
  };

  return (
    <Router>
      <Routes>
        {/* if the user is authorized send it to /users */}
        <Route path="/" element={loggedInUser ? <Navigate to="/users" replace /> : <Login onLogin={handleLogin} />} />
        
        {/* if the user is authorized and Admin - show users list */}
        <Route path="/users" element={loggedInUser && loggedInUser.role === 'ADMIN' ? <UsersTable loggedUser={loggedInUser} /> : <Navigate to="/userInfo" />}/>

        <Route path="/userInfo" element={<UserInfo loggedUser={loggedInUser} onLogout={handleLogout}/>} />
        <Route path="/register" element={<RegisterUser />} />

      </Routes>
    </Router>
  );
}

export default App;
