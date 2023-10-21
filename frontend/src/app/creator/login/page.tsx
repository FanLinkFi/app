'use client'

import { GoogleLogin } from '@react-oauth/google'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh'
    }}
    >
      <h1>Login to Your Creator Account</h1>
      <GoogleLogin
        onSuccess={() => {
          router.push('/creator')
        }}
        onError={() => {
          console.log('Login Failed')
        }}
      />
    </div>
  )
}
