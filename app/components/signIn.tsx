'use client'
import { signIn } from "next-auth/react";
import Button from "./common/Button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignInButton(){
    const session = useSession();
    const router = useRouter();
    return (
        <>
        { session.status === "authenticated" 
            ? <Button onClick={() => router.push("/campsite")}>START</Button>
            : <Button onClick={() => signIn("slack", {callbackUrl: "/campsite"})}>SIGN IN</Button>
        }
        </>
    )
}
