import SignInButton from "@/components/SignIn";
export default function Index() {
  return (
    <>
      <div className = "flex flex-col justify-center items-center">
      <img alt="Flames" className = "left-1/2 -translate-x-1/2 absolute w-1/4 md:w-1/8 bottom-0 z-0" src = "https://hc-cdn.hel1.your-objectstorage.com/s/v3/e8ec60289f5ad98c6e15a24b3998e644944b755e_fire_sparks.gif"/>
        <img alt="Header (top)" className = "w-1/4" src = "https://hc-cdn.hel1.your-objectstorage.com/s/v3/01a7c6aa5aa33a6a13d6f8fadb293e72947ec813_image.png"/>
          <h1 className ="text-8xl py-4">RPG</h1>
        <img alt="Header (bottom)" className = "w-1/4 rotate-180" src = "https://hc-cdn.hel1.your-objectstorage.com/s/v3/01a7c6aa5aa33a6a13d6f8fadb293e72947ec813_image.png"/>
          <p className = "py-2">exciting placeholder text.</p>
          <div className = "block my-2" id = 'menu'>
            <SignInButton/>
          </div>
      </div>
    </>
  );
}
