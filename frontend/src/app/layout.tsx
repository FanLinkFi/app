import './globals.css'
import { ReactElement } from 'react'
import '../../styles/global.css'

const RootLayout = ({ children }: { children: ReactElement }) => (
  <html lang="en">
    <body>
      {children}
    </body>
  </html>
)

export default RootLayout
