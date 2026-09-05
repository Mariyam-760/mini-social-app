import { useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Alert from '@mui/material/Alert';
import { useAuth } from '../context/AuthContext.jsx';
import { createPost } from '../services/postService';

const CreatePost = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const initial = user?.username ? user.username.charAt(0).toUpperCase() : '?';

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5MB');
      return;
    }

    setError('');
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    setError('');
    if (!text.trim() && !imageFile) {
      setError('Write something or add an image to post');
      return;
    }

    setSubmitting(true);
    try {
      const post = await createPost({ text: text.trim(), imageFile });
      onPostCreated(post);
      setText('');
      removeImage();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="social-card">
      <div style={{ display: 'flex', gap: 12 }}>
        <div className="avatar-circle">{initial}</div>
        <div style={{ flex: 1 }}>
          <TextField
            fullWidth
            multiline
            minRows={2}
            maxRows={6}
            placeholder="What's on your mind?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            variant="standard"
            InputProps={{
              disableUnderline: true,
              style: { color: 'var(--text-primary)', fontSize: 15 },
            }}
          />

          {imagePreview && (
            <div className="image-preview-wrap">
              <img src={imagePreview} alt="preview" />
              <IconButton
                size="small"
                onClick={removeImage}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  background: 'rgba(0,0,0,0.6)',
                  color: '#fff',
                  '&:hover': { background: 'rgba(0,0,0,0.8)' },
                }}
              >
                <CloseRoundedIcon fontSize="small" />
              </IconButton>
            </div>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 1.5, py: 0 }}>
              {error}
            </Alert>
          )}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 14,
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: 12,
            }}
          >
            <div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <IconButton
                onClick={() => fileInputRef.current?.click()}
                sx={{ color: 'var(--accent-blue)' }}
              >
                <ImageOutlinedIcon />
              </IconButton>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={submitting || (!text.trim() && !imageFile)}
              variant="contained"
              disableElevation
              sx={{
                borderRadius: 999,
                textTransform: 'none',
                fontWeight: 700,
                px: 3,
                background: 'var(--accent-gradient)',
                '&:hover': { background: 'var(--accent-gradient)', opacity: 0.9 },
                '&.Mui-disabled': { background: '#2a2f3f', color: '#6b7180' },
              }}
            >
              {submitting ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Post'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
