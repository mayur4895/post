'use client'
import React from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { CiCirclePlus } from "react-icons/ci";


import { CgMenuRight } from "react-icons/cg";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarTrigger,
  } from "@/components/ui/menubar"
import { Button } from './ui/button';
import { signOut } from 'next-auth/react';
import { useModal } from '@/hooks/use-modal-store';
import { CurrentUser } from '@/hooks/use-current-user';
import { redirect } from 'next/navigation';
  
const Navbar = () => {
  const {onOpen,type} = useModal();
  const currentUser = CurrentUser();
  if(!currentUser ){
  return redirect("/auth/login")
  }
 
  return (
    <div>
      <Menubar className='px-10  z-50 h-12 justify-between flex items-center'>
  <MenubarMenu>
    <MenubarTrigger>Mayur.</MenubarTrigger> 
  </MenubarMenu>
  <div className=' flex items-center space-x-4'>  
  <MenubarMenu>
    <MenubarTrigger className=' cursor-pointer hover:text-red-400  flex items-center gap-2 text-nowrap' onClick={()=>{onOpen("createPost")}}><CiCirclePlus size={20}/> create Post</MenubarTrigger> 
  </MenubarMenu> 
  <MenubarMenu> 
   <Button
                          type="submit" 
                          className=" font-normal hidden lg:block"
                          onClick={() => {
                            signOut();
                          }}>
                          Logout
                        </Button> 
   
  </MenubarMenu>
  <MenubarMenu> 
  <Sheet>
  <SheetTrigger className='lg:hidden block'><CgMenuRight size={22}/></SheetTrigger>
  <SheetContent>
    <SheetHeader className=' text-start flex flex-col'> 
      <SheetDescription> 
        {currentUser?.email}
      </SheetDescription>
    </SheetHeader> 
    <Button
                          type="submit" 
                          variant={"link"}
                          className=" mt-5 p-0 font-normal lg:hidden block"
                          onClick={() => {
                            signOut();
                          }}>
                          Logout
                        </Button> 
  </SheetContent>
</Sheet>
</MenubarMenu>

 
  </div>

</Menubar>

    </div>
  )
}

export default Navbar
