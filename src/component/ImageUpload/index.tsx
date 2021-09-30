import { useState } from 'react';
import { Button } from '@mui/material';
import './index.css';
import { firestore } from 'firebase';
import { db, storage } from '../../firebase';

interface Image {
  name: string;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ImageUpload({ username }: any) {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState<Image | null>(null);
  const [progress, setProgress] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (e: any) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  const handleUpload = () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const uploadTask = storage.ref(`image/${image!.name}`).put(image);
    uploadTask.on(
      'state_changed',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (snapshot: any) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        );
        setProgress(progress);
      },
      error => {
        alert(error.message);
      },
      () => {
        storage
          .ref('image')
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          .child(image!.name)
          .getDownloadURL()
          .then(url => {
            db.collection('post').add({
              timestamp: firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: username,
            });
            setProgress(0);
            setCaption('');
            setImage(null);
          });
      },
    );
  };
  return (
    <div>
      <progress value={progress} max="100" />
      <input
        type="text"
        placeholder="Enter a caption..."
        onChange={event => setCaption(event.target.value)}
        value={caption}
      />
      <input type="file" onChange={handleChange} />
      <Button onClick={handleUpload}>UP LOAD</Button>
    </div>
  );
}

export default ImageUpload;
