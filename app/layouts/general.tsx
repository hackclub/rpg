'use client'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import Signpost from "@/components/Signpost";
import Loading from "@/components/common/Loading";

export default function GeneralLayout({children, title}: {children?: React.ReactNode, title: string}){
    const session = useSession();
    const router = useRouter();
    useEffect(() => {
        if (session.status === "unauthenticated"){
            router.push("/unauthed")
        }
    }, [session.status, router])

    return (
        <>
        { session.status === "authenticated" ?
        <>
        <div className = "grid md:max-lg:grid-cols-5 md:grid-cols-7 gap-8 md:gap-20">
            <div className = "order-last md:order-first col-span-full md:col-span-2 *:-my-16 *:md:-my-24 *:sm:-my-30">
                <div className = "sticky top-0 flex flex-col items-center justify-center align-middle sm:h-[100vh]">
                    <Signpost className = "static"/>
                </div>
            </div>
            <div className = "col-span-full md:max-lg:col-span-3 md:col-span-5">
                <h1 className = "text-5xl sm:text-6xl md:text-7xl">⟢ {title}</h1>
                <div className = "py-16 sm:py-8">
                    {children}  
                </div>
            </div>
        </div>
        </>
        : session.status === "loading" 
        ? <Loading/> : <Loading/>
        }
        </>
    )
}