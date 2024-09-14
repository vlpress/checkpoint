import React, { useState, useEffect, useCallback } from 'react';
import { validateEmail, validatePassword, validateStringLength } from './utils/validation.js';
import { useNavigate } from 'react-router-dom';

function RegisterUser() {

  const [newUser, setNewUser] = useState({ firstName: '', lastName: '', email: '', passwordHash: '', role: 'User' });
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [message, setMessage] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const navigate = useNavigate();

  const validateForm = useCallback(() => {
    const newErrors = {};
    newErrors.email = validateEmail(newUser.email);
    newErrors.password = validatePassword(newUser.passwordHash);
    newErrors.firstName = validateStringLength(newUser.firstName, 100);
    newErrors.lastName = validateStringLength(newUser.lastName, 100);

    setErrors(newErrors);
    setIsFormValid(!Object.values(newErrors).some(error => error));
    setMessage(Object.values(newErrors).filter(error => error).join(', '));
    }, [newUser]);

  useEffect(() => {
    if (hasSubmitted) {
      validateForm();
    }
  }, [newUser, hasSubmitted, validateForm]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleRegister = async () => {
    setHasSubmitted(true);
    if (isFormValid) {
        try {
            const response = await fetch('http://localhost:8080/api/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });

            if (!response.ok) {
                throw new Error('Failed to register new user');
            }

            const registeredUser = await response.json();

            setMessage('Registration successful!');
            navigate('/userInfo', { state: { user: registeredUser } });
        } catch (error) {
            console.error(error.message);
        }
    }
  };

  return (
    <div className="form-container">
      <div className="form-grid">
        <h2 className="form-title">Register New User</h2>

        <label htmlFor="firstName">First Name:</label>
        <input
          type="text"
          name="firstName"
          id="firstName"
          maxLength="100"
          value={newUser.firstName}
          onChange={handleInputChange}
        />

        <label htmlFor="lastName">Last Name:</label>
        <input
          type="text"
          name="lastName"
          id="lastName"
          maxLength="100"
          value={newUser.lastName}
          onChange={handleInputChange}
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          name="email"
          id="email"
          maxLength="100"
          value={newUser.email}
          onChange={handleInputChange}
        />
        {hasSubmitted && errors.email && <div className="error">{errors.email}</div>} {/* Показывать ошибки только после сабмита */}

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          name="passwordHash"
          id="password"
          maxLength="100"
          value={newUser.passwordHash}
          onChange={handleInputChange}
        />
        {hasSubmitted && errors.password && <div className="error">{errors.password}</div>} {/* Показывать ошибки только после сабмита */}

        <button onClick={handleRegister} disabled={!isFormValid && hasSubmitted}>
          Register
        </button>
        {message && <div className="message">{message}</div>}
      </div>
    </div>
  );
}

export default RegisterUser;
