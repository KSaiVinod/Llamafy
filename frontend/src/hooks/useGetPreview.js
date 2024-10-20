import axios from 'axios'
import { useMutation, useQuery } from 'react-query'

const generatePreview = async (id, content) => {
  return axios
    .post(`${process.env.NEXT_PUBLIC_API_GATEWAY}/flow/preview?token_id=${id}`, { content: JSON.parse(content) })
    .then(res => res)
}

export const useGeneratePreview = () => {
  return useMutation(({ id, content }) => generatePreview(id, content))
}
