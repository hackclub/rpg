'use client'
import { impersonate } from "@/lib/impersonate";
import { useSession } from "next-auth/react";
import { User } from "@prisma/client";
export default function Impersonate({user}: {user: User}){
    const session = useSession()
    return (
        <>
        { 
            session?.data?.user.role === "admin" 
                ? <button onClick={() => impersonate(user.providerAccountId!)}>👀</button> 
            : null
        } 
        </>
    )
}