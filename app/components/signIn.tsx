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
            ? <Button onClickAction={() => router.push("/campsite")}>START</Button>
            : <Button onClickAction={() => signIn("slack", {callbackUrl: "/campsite"})}>SIGN IN</Button>
        }
        </>
    )
}
