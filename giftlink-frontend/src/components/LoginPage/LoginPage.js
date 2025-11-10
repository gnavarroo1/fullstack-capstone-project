import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      console.log('Login invoked', { email });
      // TODO: integrar con backend (POST /api/users/login)
    } catch (error) {
      console.error('Error in handleLogin:', error);
    }
  };

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