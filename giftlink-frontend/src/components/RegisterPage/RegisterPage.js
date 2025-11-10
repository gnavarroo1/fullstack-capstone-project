import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './RegisterPage.css';

function RegisterPage() {
  // useState hook variables for form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // handleRegister function
  const handleRegister = async () => {
    try {
      console.log('Register invoked', { firstName, lastName, email });
      // TODO: integrar con backend (POST /api/users/register)
    } catch (error) {
      console.error('Error in handleRegister:', error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="register-card p-4 border rounded">
            <h2 className="text-center mb-4 font-weight-bold">Register</h2>

            {/* Form inputs */}
            <div className="mb-3">
              <label htmlFor="firstName" className="form-label">FirstName</label><br/>
              <input
                id="firstName"
                type="text"
                className="form-control"
                placeholder="Enter your firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">LastName</label><br/>
              <input
                id="lastName"
                type="text"
                className="form-control"
                placeholder="Enter your lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label><br/>
              <input
                id="email"
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label><br/>
              <input
                id="password"
                type="password"
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Register button */}
            <button className="btn btn-primary w-100 mb-3" onClick={handleRegister}>Register</button>

            <p className="mt-4 text-center">
              Already a member? <Link to="/app/login" className="text-primary">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;