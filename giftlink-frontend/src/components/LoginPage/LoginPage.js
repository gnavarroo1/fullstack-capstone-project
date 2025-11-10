import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';
import './LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [incorrect, setIncorrect] = useState('');

  const navigate = useNavigate();
  const bearerToken = sessionStorage.getItem('bearer-token');
  const { setIsLoggedIn } = useAppContext();

  const handleLogin = async () => {
    try {
      // Step 1: Implement API call
      const res = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'Authorization': bearerToken ? `Bearer ${bearerToken}` : '', // Include Bearer token if available
        },
        body: JSON.stringify({
          email: email,
          password: password,
        })
      });

      // Step 2: Access data and set user details
      const json = await res.json();

      if (json.authtoken) {
        // Save tokens and user details in session storage
        sessionStorage.setItem('auth-token', json.authtoken);
        sessionStorage.setItem('bearer-token', json.authtoken);
        if (json.userName) sessionStorage.setItem('name', json.userName);
        if (json.userEmail) sessionStorage.setItem('email', json.userEmail);

        // Update app auth state and navigate
        setIsLoggedIn(true);
        navigate('/app');
      } else {
        // Wrong password or user not found
        document.getElementById('email').value = '';
        document.getElementById('password').value = '';
        setIncorrect(json?.error || 'Wrong password. Try again.');
        setTimeout(() => {
          setIncorrect('');
        }, 2000);
      }
    } catch (error) {
      console.error('Error in handleLogin:', error);
      setIncorrect(error?.message || 'Login failed');
      setTimeout(() => setIncorrect(''), 2000);
    }
  };

  useEffect(() => {
    // If already logged in, navigate to MainPage
    if (sessionStorage.getItem('auth-token')) {
      navigate('/app');
    }
  }, [navigate]);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="login-card p-4 border rounded">
            <h2 className="text-center mb-4 font-weight-bold">Login</h2>

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

            <button className="btn btn-primary w-100 mb-3" onClick={handleLogin}>Login</button>
            <span style={{color: 'red', height: '.5cm', display: 'block', fontStyle: 'italic', fontSize: '12px'}}>{incorrect}</span>

            <p className="mt-4 text-center">
              New user? <Link to="/app/register" className="text-primary">Register</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;