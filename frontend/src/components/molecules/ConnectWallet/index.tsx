'use client'

import { Button } from '@mui/material'
import {
  AppConfig,
  UserSession,
  AuthDetails,
  showConnect
} from '@stacks/connect'
import { useState, useEffect } from 'react'

const ConnectWallet = () => {
  const [message, setMessage] = useState('')
  const [transactionId, setTransactionId] = useState('')
  const [currentMessage, setCurrentMessage] = useState('')
  const [userData, setUserData] = useState(undefined)

  const appConfig = new AppConfig(['store_write'])
  const userSession = new UserSession({ appConfig })

  const appDetails = {
    name: 'Hello Stacks',
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

  console.log(userData)

  return (
    <div>
      {!userData && (
      <Button variant="contained" color="primary" fullWidth onClick={connectWallet}>
        Connect
      </Button>
      )}
    </div>
  )
}

export default ConnectWallet
