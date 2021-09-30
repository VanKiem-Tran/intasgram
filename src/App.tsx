/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useEffect, useState } from 'react';
import './App.css';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Post from './component/Post';
import { db, auth } from './firebase';
import ImageUpload from './component/ImageUpload';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
interface IPost {
  userName: string;
  caption: string;
  imageUrl: string;
}
interface UserData {
  authUser: null;
}
function App() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<UserData | null>(null);
  const handleOpen = () => setOpen(true);
  const handleOpenSignIn = () => setOpenSignIn(true);
  const handleClose = () => setOpen(false);
  const handleCloseSignIn = () => setOpenSignIn(false);
  const signIn = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch(error => alert(error.message));
    setOpenSignIn(false);
  };
  const signUp = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(authUser => {
        return authUser.user.updateProfile({
          displayName: userName,
        });
      })
      .catch(error => alert(error.message));
  };
  useEffect(() => {
    // eslint-disable-next-line
    const unSubcribe = auth.onAuthStateChanged((authUser: any) => {
      if (authUser) {
        setUser(authUser);
        if (authUser.displayName) {
          // dont update username
        } else {
          return authUser.updateProfile({
            displayName: userName,
          });
        }
      } else {
        setUser(null);
      }
    });
    return () => {
      unSubcribe();
    };
  }, [user, userName]);
  useEffect(() => {
    db.collection('posts').onSnapshot(snapshot => {
      const posts = snapshot.docs.map(doc => doc.data() as IPost);
      setPosts(posts);
    });
  }, []);
  return (
    <div className="App">
      {user?.authUser ? (
        <ImageUpload username={user.authUser} />
      ) : (
        <h3>Sorry you need to login to upload</h3>
      )}
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} className="classes.paper">
            <form className="app__signUp">
              <img
                className="app__imageSIgnUp"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="logo"
              />
              <input
                className="app__input"
                placeholder="User Name"
                type="text"
                value={userName}
                onChange={e => setUserName(e.target.value)}
              />
              <input
                className="app__input"
                placeholder="Email"
                type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <input
                className="app__input"
                placeholder="Password"
                type="text"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <Button type="submit" onClick={signUp}>
                SIGN UP
              </Button>
            </form>
          </Box>
        </Modal>
        <Modal
          open={openSignIn}
          onClose={handleCloseSignIn}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} className="classes.paper">
            <form className="app__signUp">
              <img
                className="app__imageSIgnUp"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="logo"
              />
              <input
                className="app__input"
                placeholder="Email"
                type="text"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <input
                className="app__input"
                placeholder="Password"
                type="text"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <Button type="submit" onClick={signIn}>
                SIGN IN
              </Button>
            </form>
          </Box>
        </Modal>
      </div>
      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="logo"
        />
      </div>
      {user ? (
        <Button type="submit" onClick={() => auth.signOut()}>
          LOG OUT
        </Button>
      ) : (
        <div className="app__loginCnntainer">
          <Button onClick={handleOpenSignIn}>SIGN IN</Button>
          <Button onClick={handleOpen}>SIGN UP</Button>
        </div>
      )}
      {posts.map(post => (
        <Post
          userName={post.userName}
          caption={post.caption}
          imageUrl={post.imageUrl}
        />
      ))}
    </div>
  );
}

export default App;
