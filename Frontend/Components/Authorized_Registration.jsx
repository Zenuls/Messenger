import React, { useState, useEffect, useRef } from 'react';

const AuthForm = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    username: '',
    birthday: '',
    password: '',
    confirmPassword: '',
    avatar: null
  });
  const [message, setMessage] = useState(null);
  const canvasRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (activeTab === 'registration') {
      if (formData.password !== formData.confirmPassword) {
        setMessage("Пароли не совпадают!");
        return;
      }

      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('lastname', formData.lastname);
      fd.append('username', formData.username);
      fd.append('birthday', formData.birthday);
      fd.append('password', formData.password);
      if (formData.avatar) {
        fd.append('avatar', formData.avatar);
      }

      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          body: fd
        });
        const text = await res.text();
        if (res.ok && text === 'OK') {
          setMessage('Регистрация прошла успешно! Теперь войдите.');
          setActiveTab('login');
          setFormData({
            name: '',
            lastname: '',
            username: '',
            birthday: '',
            password: '',
            confirmPassword: '',
            avatar: null
          });
        } else {
          setMessage(text);
        }
      } catch (err) {
        setMessage('Ошибка регистрации: ' + err.message);
      }

    } else {
      // login
      const fd = new FormData();
      fd.append('username', formData.username);
      fd.append('password', formData.password);

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          body: fd
        });
        if (res.ok) {
          const user = await res.json();
          setMessage(`Привет, ${user.name}!`); 
          // TODO: сохранить user в контекст/хранилище, редирект и т.п.
        } else {
          const text = await res.text();
          setMessage(text || 'Неверные учётные данные');
        }
      } catch (err) {
        setMessage('Ошибка входа: ' + err.message);
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      ctx.clearRect(0, 0, w, h);
      const drawCircle = (x, y, r) => {
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, 'rgba(40,167,69,0.8)');
        g.addColorStop(1, 'rgba(40,167,69,0)');
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.fillStyle = g;
        ctx.filter = 'blur(50px)';
        ctx.fill();
        ctx.filter = 'none';
      };
      for (let i = 0; i < 5; i++) {
        drawCircle(
          Math.random() * w,
          Math.random() * h,
          100 + Math.random() * 200
        );
      }
    };
    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, []);

  return (
    <div className="auth-container">
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '100%', height: '100%',
          zIndex: -1
        }}
      />
      <div className="header">
        <h1>{activeTab === 'login' ? 'SIGN IN' : 'REGISTRATION'}</h1>
      </div>
      {message && <div className="message">{message}</div>}
      <form onSubmit={handleSubmit}>
        {activeTab === 'registration' && (
          <>
            <div className="form-group">
              <label>* Your name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>* Your lastname</label>
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>* Your birthday</label>
              <input
                type="date"
                name="birthday"
                value={formData.birthday}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Avatar image</label>
              <div className="image-upload">
                <div className="image-preview">
                  {formData.avatar
                    ? <img
                        src={URL.createObjectURL(formData.avatar)}
                        alt="Preview"
                        className="preview"
                      />
                    : <div className="placeholder">MAXI2COM</div>
                  }
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
          <label>* Login</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>* Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        {activeTab === 'registration' && (
          <div className="form-group">
            <label>* Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
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
              onClick={() => {
                setActiveTab('registration');
                setMessage(null);
              }}
            >
              Create account
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setMessage(null);
              }}
            >
              Back to sign in
            </button>
          )}
          <button type="submit">
            {activeTab === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthForm;
