import { ReactElement } from 'react'

const RootLayout = ({ children }: { children: ReactElement }) => (
  <html lang="en">
    <body>
      {children}
    </body>
  </html>
)

export default RootLayout
