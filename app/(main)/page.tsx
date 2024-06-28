import { Button } from "@/components/ui/button";
import { CurrentUser } from "@/hooks/use-current-user";
 import {useRouter} from "next/navigation"
import Image from "next/image";
import { redirect } from "next/navigation";

export default function Home() {
 const router = useRouter();
 
  return (
   <div className="item">
    <Button onClick={()=>{router.push("/auth/signup")}}> Goto Signup</Button>
   </div> 
  );
}
