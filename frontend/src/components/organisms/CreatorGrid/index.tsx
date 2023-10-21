'use client'

import {
  Card, CardContent, CardActions, CardMedia, Button, Grid, Typography
} from '@mui/material'
import { Box } from '@mui/system'

interface Video {
  id: string;
  title: string;
  image: string;
  nftsBought?: number;
}

interface VideoGridProps {
  videos: Video[];
  onMintClick?: (video: Video) => void;
}

const VideoGrid: React.FC<VideoGridProps> = ({ videos, onMintClick }) => (
  <Grid container spacing={3}>
    {videos.map((video) => (
      <Grid item xs={12} sm={6} md={4} key={video.id}>
        <Card>
          <CardMedia
            component="img"
            height="200"
            image={video.image}
            alt={video.title}
            title={video.title}
          />
          <CardContent>
            <Typography variant="h6" component="div">
              {video.title}
            </Typography>
          </CardContent>
          <CardActions>
            <Button variant="contained" color="primary" fullWidth onClick={() => onMintClick && onMintClick(video)}>
              Mint NFT
            </Button>
          </CardActions>
        </Card>
      </Grid>
    ))}
  </Grid>
)

export default VideoGrid
