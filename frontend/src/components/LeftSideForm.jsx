import { Grid, Grid2, Typography } from '@mui/material'
import MemoMetaAiIcon from '../../public/svg/MetaAiIcon'

export const LeftSideForm = () => {
  return (
    <Grid2 container paddingInline={'1rem'}>
      <Grid2 item size={12} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
        <Typography variant={'h6'}>Flow JSON</Typography>
        <MemoMetaAiIcon />
      </Grid2>
      <Grid2 item></Grid2>
    </Grid2>
  )
}
