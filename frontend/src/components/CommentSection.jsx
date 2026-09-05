import { useState } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import CircularProgress from '@mui/material/CircularProgress';
import { addComment } from '../services/postService';

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

const CommentSection = ({ postId, comments, onCommentAdded }) => {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    try {
      const data = await addComment(postId, text.trim());
      onCommentAdded(data.comments, data.commentsCount);
      setText('');
    } catch (err) {
      console.error('Failed to add comment', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div style={{ marginTop: 12, borderTop: '1px solid var(--border-subtle)', paddingTop: 12 }}>
      {comments.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
          {comments.map((c, idx) => (
            <div key={idx} style={{ display: 'flex', gap: 10 }}>
              <div className="avatar-circle" style={{ width: 30, height: 30, fontSize: 12 }}>
                {c.username?.charAt(0).toUpperCase()}
              </div>
              <div
                style={{
                  background: 'var(--bg-elevated)',
                  borderRadius: 14,
                  padding: '8px 12px',
                  flex: 1,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 13 }}>{c.username}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {timeAgo(c.createdAt)}
                  </span>
                </div>
                <div style={{ fontSize: 13.5, color: 'var(--text-primary)', marginTop: 2 }}>
                  {c.text}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 999,
              background: 'var(--bg-elevated)',
              color: 'var(--text-primary)',
              fontSize: 13.5,
              '& fieldset': { borderColor: 'var(--border-subtle)' },
              '&:hover fieldset': { borderColor: 'var(--accent-blue)' },
              '&.Mui-focused fieldset': { borderColor: 'var(--accent-blue)' },
            },
          }}
        />
        <IconButton
          onClick={handleSubmit}
          disabled={!text.trim() || submitting}
          sx={{ color: 'var(--accent-blue)' }}
        >
          {submitting ? <CircularProgress size={18} /> : <SendRoundedIcon fontSize="small" />}
        </IconButton>
      </div>
    </div>
  );
};

export default CommentSection;
