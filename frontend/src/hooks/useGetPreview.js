import axios from 'axios'
import { useQuery } from 'react-query'

const generatePreview = async id => {
  return axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY}/flow/preview?token_id=${id}`).then(res => res.data)
}

export const useGeneratePreview = id => {
  return useQuery(['Preview', id], () => generatePreview(id), {
    enabled: Boolean(id)
  })
}
