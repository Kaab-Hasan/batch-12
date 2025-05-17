import { useState } from 'react';
import { Button, TextField } from '@mui/material';
import { db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function CreateBlog({ user }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const blogRef = doc(db, 'blogs', Date.now().toString());
      await setDoc(blogRef, {
        title,
        content,
        author: {
          uid: user.uid,
          name: user.displayName,
          photoURL: user.photoURL
        },
        likes: [],
        comments: [],
        createdAt: new Date()
      });
      // Reset form
      setTitle('');
      setContent('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField fullWidth label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <TextField fullWidth multiline rows={4} label="Content" value={content} onChange={(e) => setContent(e.target.value)} />
      <Button type="submit">Publish</Button>
    </form>
  );
}