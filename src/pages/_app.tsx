import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import { SWRConfig } from 'swr';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { lightTheme } from '../themes'
import { UiProvider, CartProvider, AuthProvider } from '../context';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider
      // session={pageProps.session}
    >
      <SWRConfig
        value={{
          fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
        }}
      >
        <UiProvider>
          <AuthProvider>
            <CartProvider>
              <ThemeProvider theme={lightTheme}>
                <CssBaseline />
                <Component {...pageProps} />
              </ThemeProvider>
            </CartProvider>
          </AuthProvider>
        </UiProvider>
      </SWRConfig>
    </SessionProvider>
  )
}

export default MyApp
