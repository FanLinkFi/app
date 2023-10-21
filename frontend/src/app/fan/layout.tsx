'use client'

import { ReactElement } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import 'include-media/dist/_include-media.scss'
import Header from '@/components/organisms/Header'

const RootLayout = ({ children }: { children: ReactElement }) => (
  <html lang="en">
    <body>
      <Header />
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'pizeda'}>
        {children}
      </GoogleOAuthProvider>
    </body>
  </html>
)

export default RootLayout
