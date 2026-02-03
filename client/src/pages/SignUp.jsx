import { useNavigate } from "react-router";
import { useState } from "react";
import axios from 'axios';
import { BASEURL } from "../constants/constants";
import "../components/styling/Auth.css";

const SignUp = (props) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: "",
    password: '',
    passwordTwo: '',
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordTwo, setShowPasswordTwo] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError("");
    
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    if (password.length === 0) {
      setPasswordStrength("");
    } else if (password.length < 6) {
      setPasswordStrength("weak");
    } else if (password.length < 10) {
      setPasswordStrength("medium");
    } else {
      setPasswordStrength("strong");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${BASEURL}/users/signup`, formData);
      props.logIn(res.data.token);
      console.log('Submit succeeded');
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "Failed to sign up. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isFormInvalid = () => {
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.passwordTwo
    ) {
      return true;
    } else if (formData.password !== formData.passwordTwo) {
      return true;
    }
    return false;
  };

  const passwordsMatch = formData.password === formData.passwordTwo || !formData.passwordTwo;

  return (
    <div className="auth-page">
      {/* Left Panel - Info/Branding */}
      <div className="auth-left-panel">
        <div className="auth-brand">
          <div className="auth-brand-icon">F</div>
          <span className="auth-brand-name">FOXSTOCKS</span>
        </div>

        <div className="auth-info-content">
          {/* Balance Card */}
          <div className="auth-balance-card">
            <div className="balance-header">
              <div className="balance-icon">💰</div>
              <span>Current Balance</span>
            </div>
            <div className="balance-amount">$24,359</div>
            <div className="balance-chart">
              <div className="chart-placeholder">
                <div className="chart-center">
                  <div className="chart-days">34</div>
                  <div className="chart-label">Days</div>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Button */}
          <div>
            <button className="transaction-btn">+</button>
            <div className="transaction-info">
              <div className="transaction-label">New transaction</div>
              <div className="transaction-date">24 october - 10 File</div>
            </div>
          </div>

          {/* Welcome Text */}
          <div className="auth-welcome">
            <h2>Welcome!</h2>
            <p>Start managing your finance faster and better</p>
            <p>Join thousands of users already managing their investments</p>
          </div>

          {/* Carousel Dots */}
          <div className="carousel-dots">
            <button className="carousel-dot"></button>
            <button className="carousel-dot active"></button>
            <button className="carousel-dot"></button>
          </div>
        </div>
      </div>

      {/* Right Panel - Signup Form */}
      <div className="auth-right-panel">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <h1>Create Account</h1>
            <p>Start your investment journey with Foxstocks</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="username">Username</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  id="username"
                  type="text"
                  name="username"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-wrapper">
                <span className="input-icon">✉</span>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="At least 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁" : "👁‍🗨"}
                </button>
              </div>
              {passwordStrength && (
                <div className="password-strength">
                  <div className="password-strength-bar">
                    <div className={`password-strength-fill ${passwordStrength}`}></div>
                  </div>
                  <span className="password-strength-text">
                    Password strength: {passwordStrength}
                  </span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="passwordTwo">Confirm Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  id="passwordTwo"
                  type={showPasswordTwo ? "text" : "password"}
                  name="passwordTwo"
                  placeholder="Confirm your password"
                  value={formData.passwordTwo}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPasswordTwo(!showPasswordTwo)}
                >
                  {showPasswordTwo ? "👁" : "👁‍🗨"}
                </button>
              </div>
              {!passwordsMatch && formData.passwordTwo && (
                <span className="error-message" style={{marginTop: '0.5rem', display: 'block'}}>
                  Passwords do not match
                </span>
              )}
            </div>

            <button 
              type="submit" 
              className={`auth-submit-btn ${loading ? 'loading' : ''}`}
              disabled={isFormInvalid() || loading}
            >
              {loading ? '' : 'Create Account'}
            </button>
          </form>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <div className="social-auth-buttons">
            <button className="social-btn">
              <span>🔍</span>
              <span>Google</span>
            </button>
            <button className="social-btn">
              <span>📘</span>
              <span>Facebook</span>
            </button>
          </div>

          <div className="auth-form-footer">
            <span>Already have an account?</span>
            <a href="/">Sign In</a>
          </div>

          <div className="auth-copyright">
            © 2025 ALL RIGHTS RESERVED
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;