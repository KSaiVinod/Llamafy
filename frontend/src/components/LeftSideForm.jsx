import { Editor } from '@monaco-editor/react'
import { Check, CheckCircleOutline, CheckOutlined, Close } from '@mui/icons-material'
import {
  Box,
  Button,
  Collapse,
  Fade,
  Grid2,
  IconButton,
  InputAdornment,
  OutlinedInput,
  styled,
  Typography
} from '@mui/material'
import { useState } from 'react'
import MemoMetaAiIcon from '../../public/svg/MetaAiIcon'

import '@/styles/dracula.json'
import '@/styles/iplastic.json'
import { useGlobalContext } from '@/context/GlobalContext'
import Link from 'next/link'

const CustomOutlinedInput = styled(OutlinedInput)(({ theme }) => ({
  borderRadius: '20px'
}))

const OutlinedBox = styled(Box)(({ theme }) => ({
  border: '1px solid',
  borderColor: theme.palette.divider,
  padding: '1rem'
}))

const options = {
  readOnly: false,
  padding: {
    top: 10,
    bottom: 10
  },
  bracketPairColorization: {
    enabled: true,
    independentColorPoolPerBracketType: true
  },
  minimap: {
    enabled: false
  },
  parameterHints: {
    enabled: false
  },
  quickSuggestions: {
    other: false,
    comments: false,
    strings: false
  },
  selectionClipboard: true,
  renderLineHighlight: 'none',
  lineDecorationsWidth: 2,
  lineNumbersMinChars: 2,
  overviewRulerBorder: false,
  fontFamily: 'JetBrains Mono',
  fontSize: 14,
  scrollbar: { verticalScrollbarSize: 5, handleMouseWheel: true },
  fastScrollSensitivity: 0,
  selectionHighlight: false,
  suggestOnTriggerCharacters: false,
  acceptSuggestionOnEnter: 'off',
  tabCompletion: 'off',
  formatOnPaste: true,
  formatOnType: true,
  wordBasedSuggestions: true

  // lineNumbers: 'off'
}

export const LeftSideForm = () => {
  const [inputValue, setInputValue] = useState('')
  const [showField, setShowField] = useState(true)

  const { handleGenerateTemplate, handleShowPreview, generatedContent, setGeneratedContent } = useGlobalContext()
  return (
    <Grid2 container paddingInline={'1rem'} spacing={2}>
      <Grid2 item size={12} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
        <Typography variant={'h6'}>Flow JSON</Typography>
        <IconButton size='small' onClick={() => setShowField(prev => !prev)}>
          <MemoMetaAiIcon width={'2.5em'} height={'2.5em'} />
        </IconButton>
      </Grid2>
      <Grid2 item size={12} width={'100%'}>
        <Collapse in={showField}>
          <Grid2 container>
            <Grid2 item size={12} width={'100%'} display={'flex'} gap={2} alignItems={'flex-start'}>
              <CustomOutlinedInput
                fullWidth
                multiline
                size='small'
                value={inputValue}
                onChange={e => setInputValue(e?.target?.value)}
                placeholder={'Ask Llama anything'}
                sx={{ display: 'flex', alignItems: 'flex-start' }}
                startAdornment={
                  <InputAdornment position='start' sx={{ mr: '10px' }}>
                    <MemoMetaAiIcon width={'1.5em'} height={'1.5em'} />
                  </InputAdornment>
                }
                endAdornment={
                  <InputAdornment position='end'>
                    <Fade in={inputValue?.length > 0} unmountOnExit>
                      <IconButton size='small' color={'success'} onClick={() => handleGenerateTemplate(inputValue)}>
                        <CheckCircleOutline />
                      </IconButton>
                    </Fade>
                  </InputAdornment>
                }
              />
              <IconButton onClick={() => setInputValue('')}>
                <Close />
              </IconButton>
            </Grid2>
          </Grid2>
        </Collapse>
      </Grid2>
      <Grid2 item size={12}>
        <OutlinedBox>
          <Editor
            options={options}
            height={'50vh'}
            defaultLanguage={'json'}
            value={generatedContent}
            onChange={value => setGeneratedContent(value)}
          />
        </OutlinedBox>
      </Grid2>
      <Grid2 item size={12} align={'right'}>
        <Button variant={'contained'} onClick={handleShowPreview}>
          Show Preview
        </Button>
      </Grid2>
    </Grid2>
  )
}
