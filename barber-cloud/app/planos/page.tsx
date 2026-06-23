"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const Planos = () => {

  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {

    if (status === "loading") 
    return
    
    if(session?.user?.role !== "BARBER") {
      router.push("/")
    }
  }, [session,status,router])


  return ( 
    <div>
      <p>sadas</p>
    </div>
   );
}
 
export default Planos;