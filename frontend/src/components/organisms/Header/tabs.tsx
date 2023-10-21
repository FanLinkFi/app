import {
  Tabs, Tab, Box, Typography
} from '@mui/material'
import ChatIcon from '@mui/icons-material/Chat'
import ExploreIcon from '@mui/icons-material/Explore'
import LockIcon from '@mui/icons-material/Lock'
import Link from 'next/link'

interface CustomTabsProps {
  value: string;
}

const CustomTabs: React.FC<CustomTabsProps> = ({ value }) => (
  <Box>
    <Tabs value={value} textColor="primary" indicatorColor="primary">
      <Link href="/fan" passHref>
        <Tab
          value="Browse"
          label={(
            <Box display="flex" alignItems="center">
              <ExploreIcon fontSize="small" style={{ marginRight: '8px' }} />
              <Typography variant="body2">Browse</Typography>
            </Box>
            )}
        />
      </Link>

      <Link href="/fan/chats" passHref>
        <Tab
          value="Chats"
          label={(
            <Box display="flex" alignItems="center">
              <ChatIcon fontSize="small" style={{ marginRight: '8px' }} />
              <Typography variant="body2">Chats</Typography>
            </Box>
            )}
        />
      </Link>

      <Link href="/fan/chats" passHref>
        <Tab
          value="PrivateContent"
          label={(
            <Box display="flex" alignItems="center">
              <LockIcon fontSize="small" style={{ marginRight: '8px' }} />
              <Typography variant="body2">[Coming Soon] Private Content</Typography>
            </Box>
            )}
          disabled
        />
      </Link>
    </Tabs>
  </Box>
)

export default CustomTabs
