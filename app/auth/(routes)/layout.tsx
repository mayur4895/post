import React from 'react'

const Layout = ({children}:{children:React.ReactNode}) => {
  return (
    <div className="flex h-[100vh] w-full justify-center items-center">
      {children}
    </div>
  )
}

export default Layout
