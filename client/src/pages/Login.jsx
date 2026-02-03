import { useNavigate } from "react-router";
import { useState } from "react";
import axios from 'axios';
import { BASEURL } from "../constants/constants";
import "../components/styling/Auth.css";

const LogIn = (props) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await axios.post(`${BASEURL}/users/signin`, formData);
      props.logIn(res.data.token);
      console.log("Submit succeeded");
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isFormInValid = () => {
    if (!formData.username || !formData.password) {
      return true;
    }
    return false;
  };

  return (
    <div className="auth-page">
      {/* Left Panel - Info/Branding */}
      <div className="auth-left-panel">
        <div className="auth-brand">
          <div className="auth-brand-icon">P</div>
          <span className="auth-brand-name">PORTFOLIO</span>
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

          {/* Welcome Text */}
          <div className="auth-welcome">
            <h2>Welcome back!</h2>
            <p>Start managing your finance faster and better</p>
            <p>Start managing your finance faster and better</p>
          </div>

          {/* Carousel Dots */}
          <div className="carousel-dots">
            <button className="carousel-dot"></button>
            <button className="carousel-dot active"></button>
            <button className="carousel-dot"></button>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="auth-right-panel">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <h1>Welcome back!</h1>
            <p>Start managing your finance faster and better</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="username">Email or Username</label>
              <div className="input-wrapper">
                <span className="input-icon">✉</span>
                <input
                  id="username"
                  type="text"
                  name="username"
                  placeholder="you@example.com"
                  value={formData.username}
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
            </div>

            <div className="forgot-password-link">
              <a href="#">Forgot password?</a>
            </div>

            <button 
              type="submit" 
              className={`auth-submit-btn ${loading ? 'loading' : ''}`}
              disabled={isFormInValid() || loading}
            >
              {loading ? '' : 'Login'}
            </button>
          </form>

          <div className="auth-divider">
            <span>or</span>
          </div>



          <div className="auth-form-footer">
            <span>Don't you have an account?</span>
            <a href="/signup">Sign Up</a>
          </div>

          <div className="auth-copyright">
            © 2025 ALL RIGHTS RESERVED
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogIn;