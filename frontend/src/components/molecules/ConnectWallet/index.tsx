'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@mui/material'
import {
  AppConfig,
  UserSession,
  AuthDetails,
  showConnect
} from '@stacks/connect'
import { useState, useEffect } from 'react'

type Props = {
  isCreator?: boolean,
}

const ConnectWallet = ({ isCreator = false }: Props) => {
  const router = useRouter()
  const [userData, setUserData] = useState(undefined)

  const appConfig = new AppConfig(['store_write'])
  const userSession = new UserSession({ appConfig })

  const appDetails = {
    name: 'FanLink',
    icon: 'https://freesvg.org/img/1541103084.png'
  }

  const connectWallet = () => {
    showConnect({
      appDetails,
      onFinish: () => window.location.reload(),
      userSession
    })
  }

  useEffect(() => {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        setUserData(userData)
      })
    } else if (userSession.isUserSignedIn()) {
      setUserData(userSession.loadUserData())
    }
  }, [])

  return (
    <div>
      {!userData ? (
        <Button variant="contained" color="primary" fullWidth onClick={connectWallet}>
          Connect
        </Button>
      )
        : isCreator ? (<div>Connected</div>) : (
          <button className="bg-blue-600 text-white rounded py-2 px-4 hover:bg-blue-700 mr-4" onClick={() => router.push('/fan/wallet')}>
            My Wallet
          </button>
        )}
    </div>
  )
}

export default ConnectWallet
