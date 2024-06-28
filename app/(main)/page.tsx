'use client'
import { Button } from "@/components/ui/button";
import { CurrentUser } from "@/hooks/use-current-user";
import { redirect } from "next/navigation";
 
 

export default function Home() {
 
 
      redirect("/posts")
 
  return (
   <div className="items">
    <Button> Goto Signup</Button>
   </div> 
  );
}
