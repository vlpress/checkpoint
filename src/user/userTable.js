import React, { useState, useEffect } from 'react';
import { validateEmail, validatePassword } from './utils/validation.js'; 

function UserTable({ loggedUser }) {
  const [users, setUsers] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(true);


  const getUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/user`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Basic ' + btoa('admin@admin.com:admin') // login:pass by Base64
          }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
          console.error('Error:', response.statusText);
      }
    } catch (error) {
        setErrors('Error connecting to the server. Please try again.');
    } finally {
        setLoading(false);
    }
};

useEffect(() => {
    if (loggedUser) {
        getUsers();
    }
  }, [loggedUser]); 
  

  // Checkbox checking
  const handleSelectUser = (email) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(email) ? prevSelected.filter(userId => userId !== email) : [...prevSelected, email]
    );
    setMessage('');
  };


  // modal popup for new user
  const handleAddNewUser = () => {
    setEditingUser({ firstName: '', lastName: '', email: '', role: 'User' });
    setIsEditMode(false);
  };

  // popup for edit
  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsEditMode(true);
  };

  // close popup
  const handleCloseEdit = () => {
    setEditingUser(null);
    setErrors({});
  };


const validateForm = (user = editingUser) => {
    const newErrors = {};
    if (!user.email) {
      newErrors.email = 'Email is required.';
    } else {
      newErrors.email = validateEmail(user.email);
    }
  
    if (!isEditMode && !user.passwordHash) {
      newErrors.password = 'Password is required.';
    } else if (!isEditMode) {
      newErrors.password = validatePassword(user.passwordHash);
    }
  
    setErrors(newErrors);
    setIsFormValid(!Object.values(newErrors).some(error => error));
    setMessage(Object.values(newErrors).filter(error => error).join(', '));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingUser((prevState) => {
        const updatedUser = { ...prevState, [name]: value };
        validateForm(updatedUser);
        return updatedUser;
      });
  };

const handleSaveUser = async () => {
    if (isFormValid) {
      if (isEditMode) {
        // update existing user
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === editingUser.id ? editingUser : user
          )
        );
      } else {
        // add new user
        try {
          const response = await fetch('http://localhost:8080/api/user/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(editingUser),
          });
  
          if (!response.ok) {
            throw new Error('Failed to register new user');
          }
  
          const newUser = await response.json();
          setUsers([...users, newUser]);
        } catch (error) {
          console.error(error.message);
        }
      }
      handleCloseEdit();
    }
  };  

  const handleDeleteSelected = () => {
    if (selectedUsers.length > 0) {
        setShowDeleteConfirmation(true);
    }  else {
        setMessage("Please select users.");
      }
  };


const confirmDelete = async () => {
    // selected users loop
    for (let email of selectedUsers) {
      try {
        const response = await fetch(`http://localhost:8080/api/user/${email}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa('admin@admin.com:admin')
            },
        });
  
        if (!response.ok) {
            setErrors(`Failed to delete user with ID: ${email}`);
          throw new Error(`Failed to delete user with ID: ${email}`);
        }
  
        console.log(`User with ID: ${email} was deleted successfully`);
      } catch (error) {
        console.error(error.message);
      }
    }
  
    setUsers((prevUsers) => prevUsers.filter((user) => !selectedUsers.includes(user.email)));
  
    setSelectedUsers([]);

    setShowDeleteConfirmation(false);
  };
  

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setSelectedUsers([]);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!users) {
    return <div>No user data available.</div>;
  }

  return (
    <div class="centered-container">
      <div class="centered-content">
        <div>
        <h2>User List Table</h2>

        <div>
        <table className="table">
            <thead>
            <tr>
                <th>Select</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Role</th>
                {loggedUser.role === 'ADMIN' && <th>Actions</th>}
            </tr>
            </thead>
            <tbody>
            {users.map((user) => (
                <tr key={user.id}>
                <td>
                    <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.email)}
                    onChange={() => handleSelectUser(user.email)}
                    />
                </td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.roles.length > 0 ? user.roles[0].roleName : 'No Role'}</td>
                {loggedUser.role === "ADMIN" && (
                    <td>
                    <button onClick={() => handleEditUser(user)}>Edit</button>
                    </td>
                )}
                </tr>
            ))}
            </tbody>
        </table>
        </div>

        {loggedUser.role === "ADMIN" && (
            <div>
            <button onClick={() => handleDeleteSelected()}>Delete Selected</button>
            <button onClick={() => handleAddNewUser()}>Add New User</button>
            </div>
        )}

        {message && (
            <div className="message" style={{ marginTop: '20px', color: 'red' }}>
            {message}
            </div>
        )}

        {showDeleteConfirmation && (
            <div className="modal">
            <div className="modal-content">
                <h3>Are you sure you want to delete these users?</h3>
                <button onClick={confirmDelete}>Yes, delete</button>
                <button onClick={cancelDelete}>Cancel</button>
            </div>
            </div>
        )}

        {/* edit user popup */}
        {editingUser && (
            <div className="modal">
            <div className="modal-content">
                <h2>{isEditMode ? `Edit: ${editingUser.firstName} ${editingUser.lastName}` : 'Add New User'}</h2>
                <label>
                First Name:
                <input
                    type="text"
                    name="firstName"
                    maxLength="100"
                    value={editingUser.firstName}
                    onChange={handleInputChange}
                />
                </label>
                <label>
                Last Name:
                <input
                    type="text"
                    name="lastName"
                    maxLength="100"
                    value={editingUser.lastName}
                    onChange={handleInputChange}
                />
                </label>
                <label>
                Email:
                <input
                    type="email"
                    name="email"
                    maxLength="100"
                    value={editingUser.email}
                    onChange={handleInputChange}
                />
                {errors.email && <div className="error">{errors.email}</div>}
                </label>
                {!isEditMode && (
                <label>
                    Password:
                    <input 
                    type="password" 
                    name="passwordHash"
                    maxLength="100"
                    value={editingUser.passwordHash} 
                    onChange={handleInputChange} />
                    {errors.password && <div className="error">{errors.password}</div>}
                </label>
                )}
                <label>
                Role: 
                <select
                    name="role"
                    value={editingUser.role}
                    onChange={handleInputChange}
                >
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                </select>
                </label>
                <button onClick={handleSaveUser} disabled={!isFormValid}>
                        {isEditMode ? 'Save Changes' : 'Add User'}
                </button>
                <button onClick={handleCloseEdit}>Cancel</button>
            </div>
            </div>
        )}
        </div>
      </div>
    </div>
  );
}

export default UserTable;
