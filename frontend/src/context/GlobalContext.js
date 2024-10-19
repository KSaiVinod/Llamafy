import { useCreateFlowTemplate } from '@/hooks/useCreateFlowTemplate'
import { useGenerateJSON } from '@/hooks/useGenerateJson'
import { useGeneratePreview } from '@/hooks/useGetPreview'
import React, { useContext, useState } from 'react'

export const GlobalContext = React.createContext({
  tokenId: '',
  setTokenId: () => {},
  loadingTemplate: false,
  handleCreateTemplate: () => {},
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
  const [generatedContent, setGeneratedContent] = useState({})
  const { mutate: createFlowTemplate, isLoading: loadingTemplate } = useCreateFlowTemplate()
  const { mutate: generateContent, isLoading: generatingContent } = useGenerateJSON()
  const { data: previewContent, isLoading: loadingPreview, refetch: reloadPreview } = useGeneratePreview(tokenId)
  const handleCreateTemplate = data => {
    createFlowTemplate(data, {
      onSuccess: data => {
        setTokenId(data?.id)
      }
    })
  }

  const handleGenerateTemplate = value => {
    generateContent(
      { prompt: value },
      {
        onSuccess: data => {
          setGeneratedContent(data)
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
    loadingTemplate,
    handleCreateTemplate,
    handleGenerateTemplate,
    generatingContent,
    generatedContent,
    handleShowPreview,
    previewContent,
    loadingPreview,
    reloadPreview
  }

  return <GlobalContext.Provider value={contextValue}>{children}</GlobalContext.Provider>
}
