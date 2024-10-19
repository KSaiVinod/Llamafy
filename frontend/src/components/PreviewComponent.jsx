import { useGeneratePreview } from '@/hooks/useGetPreview'
import { Box, Grid2 } from '@mui/material'

export const PreviewComponent = () => {
  const { data: previewData } = useGeneratePreview()

  return (
    <Grid2 container heigth={'100%'} position={'relative'}>
      <Grid2 item sx={{ position: 'absolute', left: 50 }}>
        <iframe
          src='https://business.facebook.com/wa/manage/flows/430099223269725/preview/?token=9beaafe3-fe35-435e-b4f6-45570386876c'
          width='460px'
          height='900px'
        />
      </Grid2>
    </Grid2>
  )
}

export default PreviewComponent
