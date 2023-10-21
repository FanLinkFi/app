import {
  Box, Paper, InputBase, IconButton, Divider
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'

interface ChatMessage {
  id: string;
  sender: 'user' | 'creator';
  text: string;
}

interface ChatWindowProps {
  messages: ChatMessage[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => (
  <Box display="flex" flexDirection="column" height="100%">
    <Box flexGrow={1} overflow="auto" p={2} style={{ border: '1px solid #e0e0e0', borderRadius: '4px' }}>
      {messages.map((msg) => (
        <Box key={msg.id} my={1} alignSelf={msg.sender === 'user' ? 'flex-end' : 'flex-start'}>
          <Paper elevation={2} style={{ padding: '8px 12px', background: msg.sender === 'user' ? '#4caf50' : '#f5f5f5' }}>
            <Box style={{ wordBreak: 'break-word', color: msg.sender === 'user' ? '#fff' : '#333' }}>
              {msg.text}
            </Box>
          </Paper>
        </Box>
      ))}
    </Box>
    <Divider />
    <Box display="flex" alignItems="center" p={1}>
      <InputBase placeholder="Type your message…" style={{ flexGrow: 1, marginLeft: '8px' }} />
      <IconButton color="primary" component="span">
        <SendIcon />
      </IconButton>
    </Box>
  </Box>
)

export default ChatWindow
