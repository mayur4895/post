import { Button } from "@/components/ui/button";
import { CurrentUser } from "@/hooks/use-current-user";
 
import Image from "next/image";
import { redirect } from "next/navigation";

export default function Home() {
const currentUser = CurrentUser();
 if(!currentUser){
  redirect("/auth/login");
 }

 if(currentUser){
  redirect("/posts")
 }
  return (
  <Button> </Button> 
  );
}
