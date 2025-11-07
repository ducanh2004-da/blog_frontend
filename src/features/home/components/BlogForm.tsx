import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { blogService } from '../service/blog.service';
import { tagService } from '../service/tag.service';
import { Toaster, toast } from 'react-hot-toast';
import { useAuthStore } from '@/stores/auth.store';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// MUI
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { BlogFormProps } from '../types/blog.type';

export default function BlogForm({
  editId = null,
  open = false,
  onClose,
}: BlogFormProps) {
  const theme = useTheme();
  const { user: authUser } = useAuthStore();
  const queryClient = useQueryClient();

  // local UI state (kept in sync with parent prop `open`)
  const [dialogOpen, setDialogOpen] = useState(Boolean(open));
  const [infoOpen, setInfoOpen] = useState(false);
  const [loadingLocal, setLoadingLocal] = useState(false);
  const [errorLocal, setErrorLocal] = useState(null);
  interface BlogPost {
    id?: string;
    title: string;
    content: string;
    updatedAt?: string;
    createdAt?: string;
    tags?: Array<{ name: string }> | { name: string };
  }
  const [result, setResult] = useState<BlogPost | null>(null);
  const [message, setMessage] = useState('');
  const [tagId, setTagId] = useState('');

  // form state
  const [formValues, setFormValues] = useState({ title: '', content: '' });

  // keep internal dialog sync with external `open` prop
  useEffect(() => {
    setDialogOpen(Boolean(open));
  }, [open]);

  // tags
  const {
    data: tagOptions,
    isLoading: tagsLoading,
    isError: tagsError
  } = useQuery({
    queryKey: ['tags'],
    queryFn: () => tagService.getTags(),
    staleTime: 1000 * 60 * 5,
  });

  // single post fetch for edit (enabled only when editing and dialog open)
  const {
    data: postData,
    isLoading: postLoading,
    isError: postError
  } = useQuery({
    queryKey: ['post', editId],
    queryFn: () => blogService.getPostById(String(editId)),
    enabled: Boolean(editId && dialogOpen),
    staleTime: 1000 * 60 * 5,
  });

  // when we receive postData, prefill the form
  useEffect(() => {
    if (postData) {
      // blogService.getPostById returns an array `blogs` (per your service),
      // so handle both array result or direct object
      const post = Array.isArray(postData) ? postData[0] : postData;
      if (post) {
        setFormValues({
          title: post.title ?? '',
          content: post.content ?? ''
        });
        // prefer tag id (post.tags may be array)
        setTagId(post.tags?.[0]?.id ?? '');
      }
    } else if (!editId && dialogOpen) {
      // new blog: reset
      setFormValues({ title: '', content: '' });
      setTagId('');
    }
  }, [postData, editId, dialogOpen]);

  // Mutations
  const createBlog = useMutation({
    mutationFn: ({ title, content, userId, tagId }: { title: string, content: string, userId: string | null, tagId: string | null }) =>
      blogService.createPost(title, content, userId, tagId),
    onSuccess: (data) => {
      // data is the GraphQL wrapper (createBlog) per your service
      // try to extract created blog
      const created = data?.blogs ? (Array.isArray(data.blogs) ? data.blogs[0] : data.blogs) : null;
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      setResult(created);
      setMessage(data?.message ?? 'Created');
      setInfoOpen(true);
      toast.success(data?.message ?? 'Blog created');
    },
    onError: (err) => {
      console.error('createBlog error', err);
      toast.error(err?.message ?? 'Create failed');
    }
  });

  const updateBlog = useMutation({
    mutationFn: ({ id, title, content, tagId }: { id: string, title: string, content: string, tagId: string | null }) =>
      blogService.updatePost(id, title, content, tagId),
    onSuccess: (data) => {
      const updated = data?.blogs ? (Array.isArray(data.blogs) ? data.blogs[0] : data.blogs) : null;
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      setResult(updated);
      setMessage(data?.message ?? 'Updated');
      setInfoOpen(true);
      toast.success(data?.message ?? 'Blog updated');
    },
    onError: (err) => {
      console.error('updateBlog error', err);
      toast.error(err?.message ?? 'Update failed');
    }
  });

  // handlers
  const handleLocalClose = () => {
    setDialogOpen(false);
    if (onClose) onClose();
  };

  const handleInfoClose = () => {
    setInfoOpen(false);
    // optionally close info and clear result
    setResult(null);
    setMessage('');
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleTagChange = (e: any) => {
    setTagId(e.target.value);
  };

  const validate = () => {
    if (!formValues.title || !formValues.title.trim()) {
      toast.error('Title is required');
      return false;
    }
    if (!formValues.content || !formValues.content.trim()) {
      toast.error('Content is required');
      return false;
    }
    // optional: require tag
    // if (!tagId) { toast.error('Please choose a tag'); return false; }
    return true;
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (!validate()) return;

    setLoadingLocal(true);
    setErrorLocal(null);

    try {
      if (editId) {
        // update
        await updateBlog.mutateAsync({
          id: String(editId),
          title: formValues.title,
          content: formValues.content,
          tagId: tagId || null
        });
      } else {
        // create
        await createBlog.mutateAsync({
          title: formValues.title,
          content: formValues.content,
          userId: authUser?.id ?? null,
          tagId: tagId || null
        });

        // reset only when created
        setFormValues({ title: '', content: '' });
        setTagId('');
      }

      // close dialog after success (mutations have their own success handlers)
      setDialogOpen(false);
      if (onClose) onClose();
    } catch (err) {
      console.error(err);
      toast.error('Unexpected error');
    } finally {
      setLoadingLocal(false);
    }
  };

  // UI helpers
  const currentLoading = loadingLocal || createBlog.isPending || updateBlog.isPending;

  return (
    <React.Fragment>
      {/* Optional: Add button to open dialog locally */}
      <Button className="md:inline-flex items-center gap-2 rounded-lg border border-transparent bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-200" variant="outlined" onClick={() => setDialogOpen(true)}>
        {editId ? 'Edit'  : 'Add new blog +'}

      </Button>

      <Toaster position="top-right" />

      <Dialog open={dialogOpen} onClose={handleLocalClose} fullWidth maxWidth="sm">
        <DialogTitle>{editId ? 'Edit Blog' : 'Add Blog'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {editId ? 'Edit your blog details' : "Let's create a new blog"}
          </DialogContentText>

          <Box component="form" id="blog-form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              autoFocus
              required
              margin="dense"
              id="title"
              name="title"
              label="Title"
              type="text"
              fullWidth
              variant="outlined"
              value={formValues.title}
              onChange={handleInputChange}
            />

            <TextField
              margin="dense"
              id="content"
              name="content"
              label="Content"
              type="text"
              fullWidth
              variant="outlined"
              multiline
              minRows={4}
              value={formValues.content}
              onChange={handleInputChange}
            />

            <FormControl fullWidth margin="dense" sx={{ mt: 2 }}>
              <InputLabel id="blog-tag-label">Tag</InputLabel>
              <Select
                labelId="blog-tag-label"
                id="blog-tag"
                value={tagId}
                label="Tag"
                onChange={handleTagChange}
                input={<OutlinedInput label="Tag" />}
              >
                {tagsLoading && <MenuItem value=""><em>Loading tags...</em></MenuItem>}
                {!tagsLoading && (!tagOptions || (Array.isArray(tagOptions) && tagOptions.length === 0)) && (
                  <MenuItem value=""><em>No tags</em></MenuItem>
                )}
                {Array.isArray(tagOptions) && tagOptions.map((t) => (
                  <MenuItem key={t.id ?? t._id ?? t.name} value={t.id ?? t._id ?? t.name}>
                    {t.name ?? t.title ?? String(t)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleLocalClose}>Cancel</Button>
          <Button type="submit" form="blog-form" disabled={currentLoading}>
            {currentLoading ? (editId ? 'Saving...' : 'Submitting...') : (editId ? 'Save' : 'Submit')}
          </Button>
        </DialogActions>
      </Dialog>

      {errorLocal && (
        <Box sx={{ color: 'error.main', mt: 1 }}>
          Error: {errorLocal ?? JSON.stringify(errorLocal)}
        </Box>
      )}

      {/* Info dialog after success */}
      {result && (
        <Dialog open={infoOpen} onClose={handleInfoClose} fullWidth maxWidth="sm">
          <DialogTitle>{message}</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <strong>{editId ? 'Blog Updated:' : 'Blog Created:'}</strong>
              <div>ID: {result?.id}</div>
              <div>Title: {result.title}</div>
              <div>Content: {result.content}</div>
              <div>Updated At: {result.updatedAt ?? result.createdAt}</div>
              <div>Tags: {Array.isArray(result.tags) ? result.tags.map(t => t.name).join(', ') : (result.tags?.name ?? '')}</div>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleInfoClose}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </React.Fragment>
  );
}

BlogForm.propTypes = {
  editId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  open: PropTypes.bool,
  onClose: PropTypes.func,
  rows: PropTypes.array,
  onblogChange: PropTypes.func,
};
