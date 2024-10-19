import axios from 'axios'
import { useMutation } from 'react-query'

const generateJSON = async data => {
  return axios.post(`${process.env.NEXT_PUBLIC_API_GATEWAY}/flow/generate`, data)
}

export const useGenerateJSON = () => {
  return useMutation(obj => generateJSON(obj))
}
