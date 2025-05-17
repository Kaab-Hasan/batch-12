import { useState, useEffect } from 'react';
import { Avatar, Button, Grid, TextField } from '@mui/material';
import { auth, db, storage } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function Profile({ user }) {
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user.displayName);
  const [photoURL, setPhotoURL] = useState(user.photoURL);
  const [newPhoto, setNewPhoto] = useState(null);

  const handleUpdate = async () => {
    try {
      // Update profile image if changed
      if (newPhoto) {
        const storageRef = ref(storage, `profile/${user.uid}`);
        await uploadBytes(storageRef, newPhoto);
        const newUrl = await getDownloadURL(storageRef);
        setPhotoURL(newUrl);
        await updateProfile(auth.currentUser, { photoURL: newUrl });
      }

      // Update display name
      await updateProfile(auth.currentUser, { displayName });
      
      // Update Firestore user document
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        displayName,
        photoURL: newPhoto ? photoURL : user.photoURL
      });

      setEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Avatar src={photoURL} sx={{ width: 100, height: 100 }} />
      {editing && (
        <input type="file" onChange={(e) => setNewPhoto(e.target.files[0])} />
      )}
      {editing ? (
        <TextField value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
      ) : (
        <h2>{displayName}</h2>
      )}
      {editing ? (
        <Button onClick={handleUpdate}>Save</Button>
      ) : (
        <Button onClick={() => setEditing(true)}>Edit Profile</Button>
      )}
    </div>
  );
}