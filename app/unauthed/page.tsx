import SignInButton from "@/components/SignIn"
export default function Unauthed(){
    return (
        <div className = "h-screen w-screen flex flex-col items-center justify-center">
        <h1 className = "text-7xl">Not signed in!</h1>
        <span className = "w-max">
            <SignInButton/>
        </span>
    </div>
    )
}