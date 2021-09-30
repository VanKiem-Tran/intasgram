import './index.css';
import { Avatar } from '@mui/material';

interface Props {
  userName: string;
  caption: string;
  imageUrl: string;
}
function Post({ userName, caption, imageUrl }: Props) {
  return (
    <div className="post">
      <div className="post__header">
        <Avatar
          className="post__avatar"
          alt="Remy Sharp"
          src="/static/images/avatar/1.jpg"
        />
        <h3>{userName}</h3>
      </div>

      <img className="post__image" src={imageUrl} alt="" />
      <h4 className="post__text">
        <strong>{userName}</strong> {caption}
      </h4>
    </div>
  );
}

export default Post;
