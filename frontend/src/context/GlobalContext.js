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
  handleShowPreview: () => {}
})

export const useGlobalContext = () => useContext(GlobalContext)

export const GlboalProvider = ({ children }) => {
  const [tokenId, setTokenId] = useState('')
  const [requestId, setRequestId] = useState('')
  const [generatedContent, setGeneratedContent] = useState('')
  const { mutate: generateContent, isLoading: generatingContent } = useGenerateJSON()
  const { data: previewContent, isLoading: loadingPreview, refetch: reloadPreview } = useGeneratePreview(tokenId)
  const { data: generatedData, isLoading: loadingGeneratedData } = useGetGeneratedJson(requestId)

  useEffect(() => {
    if (generatedData?.result?.done) {
      setGeneratedContent(JSON.stringify(generatedData?.result?.content, null, 4))
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
    reloadPreview(tokenId)
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
    reloadPreview
  }

  return <GlobalContext.Provider value={contextValue}>{children}</GlobalContext.Provider>
}
