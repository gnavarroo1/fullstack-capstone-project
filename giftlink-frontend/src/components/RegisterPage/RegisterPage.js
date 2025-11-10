import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import './RegisterPage.css';

function RegisterPage() {
  // useState hook variables for form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // handleRegister function
  const handleRegister = async () => {
    setErrorMessage('');
    setLoading(true);
    try {
      // Basic front-end validation
      if (!firstName || !lastName || !email || !password) {
        setErrorMessage('All fields are required.');
        return;
      }

      const url = `${urlConfig.backendUrl}/api/auth/register`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ firstName, lastName, email, password })
      });

      if (!response.ok) {
        // Try to parse validation errors from backend
        let backendError = '';
        try {
          const errData = await response.json();
          backendError = errData?.error || (Array.isArray(errData?.errors) ? errData.errors.map(e => e.msg).join(', ') : '');
        } catch (_) {}
        throw new Error(backendError || `Registration failed (${response.status})`);
      }

      const data = await response.json();
      const authtoken = data?.authtoken;
      const returnedEmail = data?.email;

      if (!authtoken || !returnedEmail) {
        throw new Error('Invalid response from server.');
      }

      // Persist session info
      sessionStorage.setItem('auth-token', authtoken);
      sessionStorage.setItem('email', returnedEmail);
      sessionStorage.setItem('name', `${firstName} ${lastName}`.trim());

      // Navigate to main page after successful registration
      navigate('/app');
    } catch (error) {
      console.error('Error in handleRegister:', error);
      setErrorMessage(error?.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
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

            {/* Error message */}
            {errorMessage && (
              <div className="alert alert-danger" role="alert">{errorMessage}</div>
            )}

            {/* Register button */}
            <button className="btn btn-primary w-100 mb-3" onClick={handleRegister} disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>

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