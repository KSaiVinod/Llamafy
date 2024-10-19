import axios from 'axios'
import { useMutation } from 'react-query'

const createFlowTemplate = async data => {
  return await axios.post(`${process.env.NEXT_PUBLIC_API_GATEWAY}/flow/create`, data)
}

export const useCreateFlowTemplate = () => {
  return useMutation(obj => createFlowTemplate(obj))
}
