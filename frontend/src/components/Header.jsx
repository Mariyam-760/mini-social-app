import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { useAuth } from '../context/AuthContext.jsx';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const initial = user?.username ? user.username.charAt(0).toUpperCase() : '?';

  return (
    <header className="top-header">
      <div
        className="page-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              color: '#fff',
              fontSize: 15,
            }}
          >
            S
          </div>
          <span style={{ fontWeight: 700, fontSize: 18 }}>Social</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="avatar-circle" style={{ width: 34, height: 34, fontSize: 14 }}>
            {initial}
          </div>
          <span
            style={{
              color: 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: 14,
              display: window.innerWidth < 480 ? 'none' : 'inline',
            }}
          >
            {user?.username}
          </span>
          <Tooltip title="Logout">
            <IconButton onClick={handleLogout} sx={{ color: 'var(--text-secondary)' }}>
              <LogoutRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </header>
  );
};

export default Header;
