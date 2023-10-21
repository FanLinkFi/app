'use client'

import {
  List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Box, IconButton, InputBase, Divider
} from '@mui/material'
import { faker } from '@faker-js/faker'
import SendIcon from '@mui/icons-material/Send'
import { useState } from 'react'

interface Creator {
  id: string;
  name: string;
  avatarUrl: string;
}

interface CreatorsTabProps {
  creators: Creator[];
}

// Generate a list of creators using faker
const generateCreators = (count: number) => {
  const creators = []
  for (let i = 0; i < count; i++) {
    creators.push({
      id: faker.string.uuid(),
      name: faker.internet.displayName(),
      avatarUrl: faker.image.avatar()
    })
  }
  return creators
}

const creators = generateCreators(10)

const CreatorsTab: React.FC = () => {
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null)

  return (
    <Box display="flex">
      <List style={{ width: '300px', borderRight: '1px solid #e0e0e0' }}>
        {creators.map((creator) => (
          <ListItem button key={creator.id} onClick={() => setSelectedCreator(creator)}>
            <ListItemAvatar>
              <Avatar src={creator.avatarUrl} alt={creator.name} />
            </ListItemAvatar>
            <ListItemText primary={creator.name} />
          </ListItem>
        ))}
      </List>

      {selectedCreator && (
        <Box flex="1" p={3}>
          <Typography variant="h6">
            Group Chat with
            {' '}
            {selectedCreator.name}
          </Typography>
          {/* This is a placeholder for the chat content. You can integrate a chat component here. */}
          <Box mt={2} style={{ height: '400px', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
            <Box flexGrow={1} overflow="auto" mt={2} style={{ border: '1px solid #e0e0e0', borderRadius: '4px', padding: '8px' }}>
              {/* Placeholder for chat messages */}
            </Box>
            <Divider />
            <Box display="flex" alignItems="center" mt={2}>
              <InputBase placeholder="Type your message…" style={{ flexGrow: 1, marginLeft: '8px' }} />
              <IconButton color="primary" component="span">
                <SendIcon />
              </IconButton>
            </Box>
            {' '}

          </Box>
        </Box>
      )}
    </Box>
  )
}

export default CreatorsTab
