import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from '../context/AuthContext.jsx';
import { login as loginService } from '../services/authService';

const textFieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    background: 'var(--bg-elevated)',
    color: 'var(--text-primary)',
    '& fieldset': { borderColor: 'var(--border-subtle)' },
    '&:hover fieldset': { borderColor: 'var(--accent-blue)' },
    '&.Mui-focused fieldset': { borderColor: 'var(--accent-blue)' },
  },
  '& .MuiInputLabel-root': { color: 'var(--text-secondary)' },
  '& .MuiInputLabel-root.Mui-focused': { color: 'var(--accent-blue)' },
  mb: 2,
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Email and password are required');
      return;
    }

    setLoading(true);
    try {
      const data = await loginService(email.trim(), password);
      login(data.token, data.user);
      navigate('/social', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="brand-mark">S</div>
        <h1 style={{ textAlign: 'center', fontSize: 22, fontWeight: 800, margin: '0 0 4px' }}>
          Welcome back
        </h1>
        <p
          style={{
            textAlign: 'center',
            color: 'var(--text-secondary)',
            fontSize: 14,
            margin: '0 0 24px',
          }}
        >
          Log in to continue
        </p>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={textFieldSx}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={textFieldSx}
          />

          <Button
            type="submit"
            fullWidth
            disabled={loading}
            variant="contained"
            disableElevation
            sx={{
              mt: 1,
              py: 1.3,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 700,
              fontSize: 15,
              background: 'var(--accent-gradient)',
              '&:hover': { background: 'var(--accent-gradient)', opacity: 0.9 },
            }}
          >
            {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Log In'}
          </Button>
        </form>

        <p
          style={{
            textAlign: 'center',
            marginTop: 20,
            fontSize: 13.5,
            color: 'var(--text-secondary)',
          }}
        >
          Don&apos;t have an account?{' '}
          <Link to="/signup" style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
