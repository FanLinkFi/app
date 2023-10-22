import VideoGrid from '@/components/organisms/VideoGrid'
import { videos } from '@/utils/db'

const Home: React.FC = () => (
  <div>
    <div style={{ padding: 20 }}>
      <VideoGrid videos={[videos[0], videos[1]]} />
    </div>
  </div>
)

export default Home
