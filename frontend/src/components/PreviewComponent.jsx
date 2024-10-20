import { useGlobalContext } from '@/context/GlobalContext'
import { Box, CircularProgress, Grid2, Typography } from '@mui/material'

export const PreviewComponent = () => {
  const { loadingPreview, previewUrl } = useGlobalContext()
  return (
    <Grid2 container heigth={'100%'} position={'relative'}>
      <Grid2 item size={12} sx={{ position: 'absolute', left: 100 }}>
        {loadingPreview ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <CircularProgress />
          </Box>
        ) : !previewUrl ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}></Box>
        ) : (
          <iframe src={previewUrl} width='460px' height='900px' />
        )}
      </Grid2>
    </Grid2>
  )
}

export default PreviewComponent
