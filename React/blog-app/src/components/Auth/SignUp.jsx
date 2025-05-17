import { useState } from 'react';
import { Button, TextField, Avatar } from '@mui/material';
import { auth, storage, db } from '../../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [profileImg, setProfileImg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Upload profile image
      const storageRef = ref(storage, `profile/${userCredential.user.uid}`);
      await uploadBytes(storageRef, profileImg);
      const photoURL = await getDownloadURL(storageRef);

      // Update user profile
      await updateProfile(userCredential.user, {
        displayName: fullName,
        photoURL
      });

      // Create user document
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        username,
        email,
        fullName,
        photoURL
      });

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Avatar src={profileImg ? URL.createObjectURL(profileImg) : null} />
      <input type="file" onChange={(e) => setProfileImg(e.target.files[0])} />
      <TextField label="Full Name" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
      <TextField label="Username" required value={username} onChange={(e) => setUsername(e.target.value)} />
      <TextField label="Email" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <TextField label="Password" required type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button type="submit">Sign Up</Button>
    </form>
  );
}