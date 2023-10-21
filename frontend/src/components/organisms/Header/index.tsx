import {
  AppBar, Toolbar, Typography, InputBase, Button, Tabs, Tab, Box
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import Link from 'next/link'
import ConnectWallet from '@/components/molecules/ConnectWallet'
import CustomTabs from './tabs'

type Props = {
  isCreator?: boolean,
}

const Header = ({ isCreator = false }: Props) => (
  <Toolbar>
    <Box display="flex" alignItems="center">
      {/* You can replace the Typography component with an <img> for your logo */}
      <Typography variant="h6" style={{ flexGrow: 1 }}>
        Your App Logo
      </Typography>

      {!isCreator && (
        <CustomTabs value="Browse" />
      )}
    </Box>

    <Box display="flex" alignItems="center" marginLeft="auto">
      {!isCreator && (
        <Box position="relative" marginRight={2}>
          <SearchIcon position="absolute" top="50%" left={0} transform="translateY(-50%)" color="action" />
          <InputBase placeholder="Search…" style={{ paddingLeft: 30 }} />
        </Box>
      )}

      <ConnectWallet />
    </Box>
  </Toolbar>
)

export default Header
