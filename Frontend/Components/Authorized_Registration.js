import React, { useState, useEffect, useRef } from 'react';

const AuthForm = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    username: '',
    birthday: null,
    password: '',
    confirmPassword: '',
    avatar: null
  });

  const canvasRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'registration' && formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    console.log('Form submitted:', formData);
    // Здесь будет логика отправки данных
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    canvas.width = width;
    canvas.height = height;
    
    ctx.clearRect(0, 0, width, height);
    
    const drawBlurredCircle = (x, y, radius) => {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, 'rgba(40, 167, 69, 0.8)');
      gradient.addColorStop(1, 'rgba(40, 167, 69, 0)');
      
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.filter = 'blur(50px)';
      ctx.fill();
      ctx.filter = 'none';
    };
    
    for (let i = 0; i < 5; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const radius = 100 + Math.random() * 200;
      drawBlurredCircle(x, y, radius);
    }
    

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      for (let i = 0; i < 3; i++) {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const radius = 100 + Math.random() * 200;
        drawBlurredCircle(x, y, radius);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="auth-container">
    <canvas 
        ref={canvasRef} 
        className="background-canvas"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1
        }}
      />
      <div className="header">
        <h1>{activeTab === 'login' ? 'SIGN IN' : 'REGISTRATION'}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {activeTab === 'registration' && (
          <>
            <div className="form-group">
              <label><span className="neccesary-span">* </span>Your name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name..."
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label><span className="neccesary-span">* </span>Your lastname</label>
              <input
                type="text"
                name="lastname"
                placeholder="Enter your lastname..."
                value={formData.lastname}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label><span className="neccesary-span">* </span>Your birthday</label>
              <input
                type="date"
                name="birthday"
                placeholder="Enter your birthday..."
                value={formData.birthday}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Avatar image</label>
              <div className="image-upload">
                <div className="image-preview">
                  {formData.avatar ? (
                    <img 
                      src={URL.createObjectURL(formData.avatar)} 
                      alt="Preview" 
                      className="preview" 
                    />
                  ) : (
                    <div className="placeholder">MAXI2COM</div>
                  )}
                </div>
                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </>
        )}

        <div className="form-group">
          <label><span className="neccesary-span">* </span>Login</label>
          <input
            type="text"
            name="username"
            placeholder="Enter login..."
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label><span className="neccesary-span">* </span>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter password..."
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>

        {activeTab === 'registration' && (
          <div className="form-group">
            <label><span className="neccesary-span">* </span>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password..."
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
          </div>
        )}

        <div className="form-actions">
          {activeTab === 'login' ? (
            <button 
              type="button"
              className="switch-button registration-switch"
              onClick={() => setActiveTab('registration')}
            >
              Create account
            </button>
          ) : (
            <button 
              type="button"
              className="switch-button login-switch"
              onClick={() => setActiveTab('login')}
            >
              Back to sign in
            </button>
          )}

          <button type="submit" className="submit-btn">
            {activeTab === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthForm;
