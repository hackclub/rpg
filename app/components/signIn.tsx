'use client'
import { signIn } from "next-auth/react";
import Button from "./Button";

export default function SignInButton(){
    return (
        <Button onClick={() => signIn("slack", {callbackUrl: "/campsite"})}>SIGN IN</Button>
    )
}
