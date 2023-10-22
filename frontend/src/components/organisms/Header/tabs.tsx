import Link from 'next/link'
import { usePathname } from 'next/navigation'

const CustomTabs: React.FC = () => {
  const pathname = usePathname()

  return (
    <div className="border-b border-gray-200">
      <div className="flex">
        <Link href="/fan" passHref>
          <div className={`cursor-pointer mr-8 pb-2 ${pathname === '/fan' ? 'border-b-2 border-blue-500' : ''}`}>
            <span className="mr-2">
              <i className="fas fa-globe" />
              {' '}
              {/* Placeholder for the ExploreIcon. Use Font Awesome or any other icon library */}
            </span>
            Browse
          </div>
        </Link>

        <Link href="/fan/chats" passHref>
          <div className={`cursor-pointer mr-8 pb-2 ${pathname === '/fan/chats' ? 'border-b-2 border-blue-500' : ''}`}>
            <span className="mr-2">
              <i className="fas fa-comments" />
              {' '}
              {/* Placeholder for the ChatIcon */}
            </span>
            Chats
          </div>
        </Link>

        <Link href="/fan/chats" passHref>
          <div className={`cursor-pointer mr-8 pb-2 ${pathname === 'PrivateContent' ? 'border-b-2 border-blue-500' : ''}`} style={{ pointerEvents: 'none', opacity: 0.5 }}>
            <span className="mr-2">
              <i className="fas fa-lock" />
              {' '}
              {/* Placeholder for the LockIcon */}
            </span>
            [Coming Soon] Private Content
          </div>
        </Link>
      </div>
    </div>
  )
}

export default CustomTabs
