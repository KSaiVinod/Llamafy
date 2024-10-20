import { useCreateFlowTemplate } from '@/hooks/useCreateFlowTemplate'
import { useGenerateJSON } from '@/hooks/useGenerateJson'
import { useGetGeneratedJson } from '@/hooks/useGetGeneratedJson'
import { useGeneratePreview } from '@/hooks/useGetPreview'
import React, { useContext, useEffect, useState } from 'react'

export const GlobalContext = React.createContext({
  tokenId: '',
  setTokenId: () => {},
  loadingTemplate: false,
  handleGenerateTemplate: () => {},
  generatingContent: false,
  generatedContent: {},
  previewContent: {},
  loadingPreview: false,
  reloadPreview: () => {},
  handleShowPreview: () => {},
  generatedData: {}
})

export const useGlobalContext = () => useContext(GlobalContext)

export const GlboalProvider = ({ children }) => {
  const [tokenId, setTokenId] = useState('')
  const [requestId, setRequestId] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')
  const [generatedContent, setGeneratedContent] = useState('')
  const { mutate: generateContent, isLoading: generatingContent } = useGenerateJSON()
  const { data: generatedData, isLoading: loadingGeneratedData } = useGetGeneratedJson(requestId)
  const { mutate: previewContent, isLoading: loadingPreview } = useGeneratePreview()

  useEffect(() => {
    if (generatedData?.result?.done) {
      setGeneratedContent(JSON.stringify(generatedData?.result?.content, null, 4))
      setTokenId(generatedData?.result?.token_id || '3354633534666753')
    }
  }, [JSON.stringify(generatedData)])

  const handleGenerateTemplate = value => {
    generateContent(
      { prompt: value },
      {
        onSuccess: ({ data }) => {
          setRequestId(data?.request_id)
        }
      }
    )
  }

  const handleShowPreview = () => {
    previewContent(
      { id: tokenId, content: generatedContent },
      {
        onSuccess: ({ data }) => {
          setPreviewUrl(data?.result?.preview?.preview_url)
        }
      }
    )
  }

  const contextValue = {
    tokenId,
    setTokenId,
    handleGenerateTemplate,
    generatingContent,
    generatedContent,
    setGeneratedContent,
    handleShowPreview,
    previewContent,
    loadingPreview,
    generatedData,
    previewUrl,
    setPreviewUrl
  }

  return <GlobalContext.Provider value={contextValue}>{children}</GlobalContext.Provider>
}
