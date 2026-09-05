import { useState } from 'react';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import { useAuth } from '../context/AuthContext.jsx';
import { toggleLike } from '../services/postService';
import CommentSection from './CommentSection.jsx';

const timeAgo = (dateStr) => {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return 'just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
};

const PostCard = ({ post, onPostUpdate }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [liking, setLiking] = useState(false);

  const isLiked = post.likes?.some((l) => l.userId === user?.id || l.userId?._id === user?.id);

  const handleLikeToggle = async () => {
    if (liking) return;
    setLiking(true);
    try {
      const data = await toggleLike(post._id);
      onPostUpdate(post._id, { likes: data.likes, likesCount: data.likesCount });
    } catch (err) {
      console.error('Failed to toggle like', err);
    } finally {
      setLiking(false);
    }
  };

  const handleCommentAdded = (comments, commentsCount) => {
    onPostUpdate(post._id, { comments, commentsCount });
  };

  return (
    <div className="social-card">
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <div className="avatar-circle">{post.username?.charAt(0).toUpperCase()}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: 14.5 }}>{post.username}</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {timeAgo(post.createdAt)}
            </span>
          </div>

          {post.text && (
            <p
              style={{
                margin: '6px 0 0',
                fontSize: 14.5,
                color: 'var(--text-primary)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {post.text}
            </p>
          )}

          {post.image && <img src={post.image} alt="post" className="post-image" />}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginTop: 12,
              paddingTop: 10,
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <button
              onClick={handleLikeToggle}
              disabled={liking}
              className={`action-pill like-btn ${isLiked ? 'liked' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                border: 'none',
                borderRadius: 999,
                padding: '8px 14px',
                minHeight: 40,
                cursor: liking ? 'default' : 'pointer',
                background: isLiked ? 'rgba(139, 108, 255, 0.15)' : 'var(--bg-elevated)',
                color: isLiked ? 'var(--accent-purple)' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              {isLiked ? (
                <FavoriteRoundedIcon fontSize="small" />
              ) : (
                <FavoriteBorderRoundedIcon fontSize="small" />
              )}
              {post.likesCount ?? post.likes?.length ?? 0}
            </button>

            <button
              onClick={() => setShowComments((s) => !s)}
              className="action-pill"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                border: 'none',
                borderRadius: 999,
                padding: '8px 14px',
                minHeight: 40,
                cursor: 'pointer',
                background: showComments ? 'rgba(79, 140, 255, 0.15)' : 'var(--bg-elevated)',
                color: showComments ? 'var(--accent-blue)' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              <ChatBubbleOutlineRoundedIcon fontSize="small" />
              {post.commentsCount ?? post.comments?.length ?? 0}
            </button>
          </div>

          {showComments && (
            <CommentSection
              postId={post._id}
              comments={post.comments || []}
              onCommentAdded={handleCommentAdded}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
