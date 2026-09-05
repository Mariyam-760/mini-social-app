import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { useAuth } from '../context/AuthContext.jsx';

const BottomNav = () => {
  const { user } = useAuth();
  const initial = user?.username ? user.username.charAt(0).toUpperCase() : '?';

  return (
    <nav className="bottom-nav">
      <div
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            color: '#fff',
            background: 'var(--accent-gradient)',
            borderRadius: 14,
            padding: '6px 22px',
          }}
        >
          <HomeRoundedIcon fontSize="small" />
          <span style={{ fontSize: 11, fontWeight: 700 }}>Feed</span>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            color: 'var(--text-secondary)',
          }}
        >
          <div
            className="avatar-circle"
            style={{ width: 24, height: 24, fontSize: 11, marginBottom: 1 }}
          >
            {initial}
          </div>
          <span style={{ fontSize: 11, fontWeight: 600 }}>{user?.username || 'You'}</span>
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
