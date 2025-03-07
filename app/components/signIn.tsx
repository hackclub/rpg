'use client'
import { signIn } from "next-auth/react";
import Button from "./Button";

export default function SignInButton(){
    return (
        <Button onClick={() => signIn(undefined, {redirectUrl: "/"})}>SIGN IN</Button>
    )
}
