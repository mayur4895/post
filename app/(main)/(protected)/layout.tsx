import Navbar from '@/components/Navbar'
import React from 'react'

const POstLayout = ({children}:{children:React.ReactNode}) => {
  return (
    <div className='w-full'>
      <Navbar/>
      <div>
        {children}
      </div>
    </div>
  )
}

export default POstLayout
