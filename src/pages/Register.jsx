import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import logo from '../images/nimlogo.png';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
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
      await api.post('/api/auth/register/', form);
      navigate('/login');
    } catch (err) {
      const data = err.response?.data;
      setError(data?.username?.[0] || data?.password?.[0] || 'Register failed');
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
        <h1>Create your AI workspace</h1>
        <p>Join Nim Chatbox today and get secure access to your personal AI assistant.</p>
      </div>

      <form className="authPanel" onSubmit={handleSubmit}>
        <h2>Create account</h2>
        <p>Start your protected AI chat experience.</p>

        {error && <div className="errorBox">{error}</div>}

        <label>Username</label>
        <input name="username" value={form.username} onChange={handleChange} placeholder="Enter username" required />

        <label>Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Enter email" />

        <label>Password</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Minimum 6 characters" required />

        <button disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</button>
        <span>Already have account? <Link to="/login">Login</Link></span>
      </form>
    </div>
  );
}
