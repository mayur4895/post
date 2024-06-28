'use client'
import Allposts from '@/components/Allposts';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import React from 'react'

const Postpage = () => {
  return (
     <Allposts/>
  )
}

export default Postpage
