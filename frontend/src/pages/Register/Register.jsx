import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import Button from '../../components/Button/Button';
import CompleteProfile from '../CompleteProfile/CompleteProfile';
import { authService } from '../../api/apiService';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();

  // Step State: 1 = Register, 2 = Complete Profile
  const [step, setStep] = useState(1);

  // Combined Form Data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleNext = (e) => {
    e.preventDefault();
    const validationErrors = validateStep1();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setStep(2);
  };

  const submitRegistration = async (completeData) => {
    setIsSubmitting(true);
    setApiError('');

    try {
      // Prepare the final payload
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'user', // Default role
        // Spread the profile data (university, dormitory, yearOfStudy, description -> bio, avatar)
        university: completeData?.university || '',
        dormitory: completeData?.dormitory || '',
        yearOfStudy: completeData?.yearOfStudy || '',
        description: completeData?.description || '', // Mapped from description
        campus: completeData?.campus || '',
        avatar: completeData?.avatar || `https://i.pravatar.cc/150?u=${formData.email}`,
        profileCompleted: completeData?.profileCompleted || false
      };

      console.log('Registering with payload:', payload);

      const response = await authService.register(payload);

      // Assuming response contains user/token or success message
      // If we are here, it succeeded
      console.log('Registration success:', response);

      // Store user details if response includes them (adapt based on your API)
      if (response && (response.user || response.token)) {
        // Typically login handles this, but if register auto-logs in:
        // localStorage.setItem('user', JSON.stringify(response.user));
        // localStorage.setItem('token', response.token);
      } else {
        // Fallback for mock/local logic if needed
        // localStorage.setItem('user', JSON.stringify({ ...payload, id: Date.now() }));
      }

      navigate('/login'); // Or navigate to home if auto-logged-in

    } catch (err) {
      console.error('Registration failed:', err);
      // Try to extract error message from response
      const message = err.message || 'Registration failed. Please try again.';
      setApiError(message);

      // If error is related to step 1 fields (e.g. email exists), go back?
      // For now stay on step 2 but show error. 
      // User might need to go back manually if they typed wrong email.
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProfileSubmit = (profileData) => {
    submitRegistration({
      ...profileData,
      profileCompleted: true
    });
  };

  const handleProfileSkip = () => {
    submitRegistration({
      profileCompleted: false
    });
  };

  // Step 1 Form Component
  const renderStep1 = () => (
    <div className="form-card">
      <div className="form-header">
        <h2 className="form-title">Create Your Account</h2>
        <p className="form-subtitle">Fill in your details to get started</p>
        {apiError && (
          <div className="error-message" style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>
            {apiError}
          </div>
        )}
      </div>

      <form className="register-form" onSubmit={handleNext}>
        {/* Name Field */}
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <div className="input-wrapper">
            <input
              className={`form-input ${errors.name ? 'error' : ''}`}
              placeholder="Enter your full name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        {/* Email Field */}
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <div className="input-wrapper">
            <input
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="student@aau.edu.et"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          {errors.email && <span className="error-text">{errors.email}</span>}
          <div className="form-hint">
            Use your AAU email for student verification
          </div>
        </div>

        {/* Password Field */}
        <div className="form-group">
          <label className="form-label">Password</label>
          <div className="input-wrapper password-input">
            <input
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="Create a strong password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              <span className="password-icon">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </button>
          </div>
          {errors.password && <span className="error-text">{errors.password}</span>}
          <div className="password-hint">
            Must be at least 6 characters with letters and numbers
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="form-group">
          <label className="form-label">Confirm Password</label>
          <div className="input-wrapper password-input">
            <input
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              placeholder="Re-enter your password"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <span className="password-icon">
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </button>
          </div>
          {errors.confirmPassword && (
            <span className="error-text">{errors.confirmPassword}</span>
          )}
        </div>

        {/* Terms and Conditions */}
        <div className="checkbox-group">
          <input
            className="form-checkbox"
            id="terms"
            type="checkbox"
            required
          />
          <label className="checkbox-label" htmlFor="terms">
            I agree to the <Link to="/terms" className="terms-link">Terms of Service</Link> and <Link to="/privacy" className="terms-link">Privacy Policy</Link>
          </label>
        </div>

        {/* Next Button */}
        <Button
          variant="primary"
          type="submit"
          size="large"
          style={{ marginTop: '1rem' }}
        >
          Next
        </Button>
      </form>

      {/* Footer Links */}
      <p className="login-link">
        Already have an account?
        <Link
          to="/login"
          className="login-button-link"
        >
          Sign In
        </Link>
      </p>

      <div className="footer-links">
        <Link to="/privacy" className="footer-link">
          Privacy Policy
        </Link>
        <Link to="/terms" className="footer-link">
          Terms of Service
        </Link>
      </div>
    </div>
  );

  return (
    <div className="register-page">
      <div className="register-container">
        {/* Left Side: Hero Image */}
        <div className="register-hero">
          <div
            className="hero-image"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")'
            }}
          >
            <div className="hero-overlay"></div>
            <div className="hero-content">
              <span className="hero-tag">Join Our Community</span>
              <h2 className="hero-title">
                Start Your <span className="hero-highlight">Food Journey</span> Today
              </h2>
              <p className="hero-description">
                Join thousands of AAU students who are discovering amazing food spots
                and sharing their culinary experiences on campus.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="register-form-side">
          <div className="register-form-container">
            {/* Header */}
            <div className="register-logo">
              <Link to="/" className="logo-link">
                <h1 className="logo-text">Gebeta</h1>
              </Link>
              <p className="logo-subtitle">The Campus Food Guide</p>
            </div>

            {/* Progress Bar */}
            <div className="progress-bar">
              <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
                <div className="step-number">1</div>
                <div className="step-label">Register</div>
              </div>
              <div className={`progress-line ${step >= 2 ? 'active' : ''}`}></div>
              <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
                <div className="step-number">2</div>
                <div className="step-label">Complete Profile</div>
              </div>
            </div>

            {/* Error Message Global */}
            {apiError && (
              <div style={{ color: 'red', margin: '1em 0', textAlign: 'center', background: '#ffebee', padding: '10px', borderRadius: '4px' }}>
                {apiError}
              </div>
            )}

            {/* Step Content */}
            {step === 1 ? renderStep1() : (
              <CompleteProfile
                onBack={() => setStep(1)}
                onSubmit={handleProfileSubmit}
                onSkip={handleProfileSkip}
                isLoading={isSubmitting}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;