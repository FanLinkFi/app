import React from 'react'
import { Button, Typography } from '@mui/material'
import Link from 'next/link'

const Home = () => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', overflowY: '-moz-hidden-unscrollable'
  }}
  >
    <img src="/assets/logo.png" style={{ width: '200px' }} />
    <br />
    <br />

    <Typography variant="h3" component="div">Welcome to FanLink</Typography>
    <br />
    <br />
    <Typography variant="h5">I am a...</Typography>
    <br />
    <div style={{ display: 'flex', justifyContent: 'space-evenly', width: '30%' }}>
      <Link href="/fan"><Button variant="contained" color="primary">Fan</Button></Link>
      <Link href="/creator/login"><Button variant="contained" color="secondary">Creator</Button></Link>
    </div>
  </div>
)

export default Home
