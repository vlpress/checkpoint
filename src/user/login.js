import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/users.css'; 

function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); 

    useEffect(() => {
        if (error) {
          console.log('Error:', error);
        }
      }, [error]);

const handleLogin = async () => {
    try {
        const response = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password}), 
        });

        if (response.ok) {
            const data = await response.json();
            onLogin({ id: data.name, role: data.role, email:email, password:password });
            navigate('/');
        } else {
            setError('Invalid email or password');
        }
    } catch (error) {
        setError('Error connecting to the server. Please try again.');
    }
};

const handleSignIn = () => {
    navigate('/register');
};


  return (
    <div className="App">
      <h1>Welcome</h1>
      <div className="login-form-container">
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
        <div>
          <button onClick={handleLogin}>Login</button>
          <button onClick={handleSignIn}>Sign Up</button>
        </div>
      </div>
    </div>
  );
}

export default Login;
