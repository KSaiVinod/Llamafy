import axios from 'axios'
import { useQuery } from 'react-query'

const getGeneratedJson = async req_id => {
  return axios.get(`${process.env.NEXT_PUBLIC_API_GATEWAY}/flow/status?job_id=${req_id}`).then(res => res.data)
}

export const useGetGeneratedJson = req_id => {
  return useQuery(['generated_content', req_id], () => getGeneratedJson(req_id), {
    refetchInterval: data => (data?.result?.status && data?.result?.done ? 0 : 5000),
    refetchIntervalInBackground: true,
    enabled: Boolean(req_id)
  })
}
