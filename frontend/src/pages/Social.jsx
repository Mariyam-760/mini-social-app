import { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Header from '../components/Header.jsx';
import BottomNav from '../components/BottomNav.jsx';
import CreatePost from '../components/CreatePost.jsx';
import PostCard from '../components/PostCard.jsx';
import { getPosts } from '../services/postService';
import { useAuth } from '../context/AuthContext.jsx';

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
};

const Social = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load feed');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handlePostUpdate = (postId, updates) => {
    setPosts((prev) => prev.map((p) => (p._id === postId ? { ...p, ...updates } : p)));
  };

  return (
    <div className="app-shell">
      <Header />
      <div className="page-container">
        <div style={{ margin: '4px 2px 16px' }}>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>
            {greeting()}
          </div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>
            <span className="gradient-text">{user?.username}</span>
          </div>
        </div>

        <CreatePost onPostCreated={handlePostCreated} />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
            <CircularProgress sx={{ color: 'var(--accent-blue)' }} />
          </div>
        ) : posts.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: 'var(--text-secondary)',
            }}
          >
            No posts yet. Be the first to share something!
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post._id} post={post} onPostUpdate={handlePostUpdate} />
          ))
        )}
      </div>
      <BottomNav />
    </div>
  );
};

export default Social;
