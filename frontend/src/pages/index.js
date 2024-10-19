import FlowBuilder from '@/components/FlowBuilder'
import { Box, Card } from '@mui/material'

export default function Home() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundImage: 'url("background.jpg")',
        backgroundSize: 'cover'
      }}
    >
      <Card sx={{ minWidth: '70%', minHeight: '70%' }}>
        <FlowBuilder />
      </Card>
    </Box>
  )
}
