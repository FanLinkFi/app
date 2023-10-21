import CreatorGrid from '@/components/organisms/CreatorGrid'
import { videos } from '@/utils/db'

export default function CreatorPage() {
  return (
    <div>
      <CreatorGrid videos={videos} />
    </div>
  )
}
