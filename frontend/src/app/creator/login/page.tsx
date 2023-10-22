'use client'
import { Typography } from '@mui/material'


import { GoogleLogin } from '@react-oauth/google'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh'
    }}
    >
      <Typography variant="h3">Login to Your Creator Account</Typography>
      <br />
      <br />
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
