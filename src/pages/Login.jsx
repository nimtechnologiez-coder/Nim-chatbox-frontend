import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import logo from '../images/nimlogo.png';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/login/', form);
      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);
      localStorage.setItem('username', form.username);
      navigate('/chat');
    } catch (err) {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="authLayout">
      <div className="authVisual">
        <Link to="/" className="backHome">← Back to home</Link>
        <div className="brandIcon">
          <img src={logo} alt="Nim Chatbox Logo" />
        </div>
        <h1>Nim Chatbox</h1>
        <p>Nim Chatbox — your smart assistant for learning, support, and instant guidance.</p>
      </div>

      <form className="authPanel" onSubmit={handleSubmit}>
        <h2>Welcome back</h2>
        <p>Login to continue your chat with Nim Chatbox.</p>

        {error && <div className="errorBox">{error}</div>}

        <label>Username</label>
        <input name="username" value={form.username} onChange={handleChange} placeholder="Enter username" required />

        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Enter password" required />

        <button disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        <span>New user? <Link to="/register">Create account</Link></span>
      </form>
    </div>
  );
}
