import { Card, CardHeader, CardContent, Typography, IconButton, Avatar } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';

export default function BlogCard({ blog }) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardHeader
        avatar={<Avatar src={blog.author.photoURL} />}
        title={blog.author.name}
        subheader={new Date(blog.createdAt?.toDate()).toLocaleDateString()}
      />
      <CardContent>
        <Typography variant="h5">{blog.title}</Typography>
        <Typography variant="body2">{blog.content}</Typography>
      </CardContent>
      <div>
        <IconButton>
          <FavoriteIcon /> {blog.likes.length}
        </IconButton>
        <IconButton>
          <CommentIcon /> {blog.comments.length}
        </IconButton>
      </div>
    </Card>
  );
}