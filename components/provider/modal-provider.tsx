'use client'

import { useEffect, useState } from "react"
import CreatePostModal from "../modal/create-post-modal"
import EditPostModal from "../modal/edit-post-modal"
import DeletePost from "../modal/delete-post-modal"
 
 

const ModalProvider = ()=>{

const [isMounted,setisMounted] = useState(false)


useEffect(()=>{
setisMounted(true);
},[setisMounted])

if(!isMounted){
    return null
}

    return(<>
      <CreatePostModal/>
      <EditPostModal/>
      <DeletePost/>
    </>)
}

export default ModalProvider;