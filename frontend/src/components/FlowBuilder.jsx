import { Grid2, styled } from '@mui/material'
import { LeftSideForm } from './LeftSideForm'
import PreviewComponent from './PreviewComponent'

const StyledBackground = styled(Grid2)(({ theme }) => ({
  padding: '1rem'
}))

export const FlowBuilder = () => {
  return (
    <StyledBackground container>
      <Grid2 item size={6}>
        <LeftSideForm />
      </Grid2>
      <Grid2 item size={6}>
        <PreviewComponent />
      </Grid2>
    </StyledBackground>
  )
}

export default FlowBuilder
