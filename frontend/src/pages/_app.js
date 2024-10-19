import { GlboalProvider } from '@/context/GlobalContext'
import '@/styles/globals.css'
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'

export default function App({ Component, pageProps }) {
  const [queryClient] = useState(new QueryClient())
  return (
    <QueryClientProvider client={queryClient}>
      <GlboalProvider>
        <Component {...pageProps} />
      </GlboalProvider>
    </QueryClientProvider>
  )
}
