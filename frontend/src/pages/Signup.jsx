import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from '../context/AuthContext.jsx';
import { signup as signupService } from '../services/authService';

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

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !email.trim() || !password) {
      setError('All fields are required');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const data = await signupService(username.trim(), email.trim(), password);
      login(data.token, data.user);
      navigate('/social', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="brand-mark">S</div>
        <h1 style={{ textAlign: 'center', fontSize: 22, fontWeight: 800, margin: '0 0 4px' }}>
          Create your account
        </h1>
        <p
          style={{
            textAlign: 'center',
            color: 'var(--text-secondary)',
            fontSize: 14,
            margin: '0 0 24px',
          }}
        >
          Join the conversation
        </p>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={textFieldSx}
          />
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
            helperText="At least 6 characters"
            FormHelperTextProps={{ sx: { color: 'var(--text-muted)' } }}
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
            {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Sign Up'}
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
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
