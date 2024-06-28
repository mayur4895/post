'use client'
import Navbar from '@/components/Navbar'
import { CurrentUser } from '@/hooks/use-current-user';
import { redirect } from 'next/navigation';
import React from 'react'

const POstLayout = ({children}:{children:React.ReactNode}) => {

  const currentUser = CurrentUser();
  console.log(currentUser);
  
  if(!currentUser){
    redirect("/auth/signup")
  }
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
