import Image from "next/image";
import SignInButton from "./components/signIn";
import Button from "./components/Button";
export default function Home() {
  
  return (
    <>
    <div className = "h-screen w-screen bg-dark bg-[url(/bg.svg)] inset-shadow-black vignette z-20">
      <div className = "flex flex-col bg-[url(/bg.svg)] justify-center h-full items-center">
        <img className = "w-1/4" src = "https://hc-cdn.hel1.your-objectstorage.com/s/v3/01a7c6aa5aa33a6a13d6f8fadb293e72947ec813_image.png"/>
          <h1 className ="text-8xl py-4">RPG</h1>
        <img className = "w-1/4 rotate-180" src = "https://hc-cdn.hel1.your-objectstorage.com/s/v3/01a7c6aa5aa33a6a13d6f8fadb293e72947ec813_image.png"/>
          <p className = "py-2">exciting placeholder text.</p>
          <div className = "block my-2" id = 'menu'>
            <SignInButton/>
            <Button href = "/">CLICK HERE</Button>
          </div>
      </div>
      <img className = "left-1/2 -translate-x-1/2 absolute w-1/4 md:w-1/7 bottom-0 z-0" src = "https://hc-cdn.hel1.your-objectstorage.com/s/v3/e8ec60289f5ad98c6e15a24b3998e644944b755e_fire_sparks.gif"/>

    </div>
    </>
  );
}
