import useSound from "use-sound"
export default function Button({children, className, onClickAction, href, disabled, type, form, shouldPreventDefault=true}: {children: React.ReactNode, className?: string, onClickAction?: any, href?: string, disabled?: boolean, type?: "button" | "submit" | "reset", form?: string, shouldPreventDefault?: boolean}){
   const [ play, { stop }] = useSound("https://hc-cdn.hel1.your-objectstorage.com/s/v3/43360dacf6efbbf41a787166931bd273c10c9fc5_ui_change_selection_audio.mp4") 
   const [ clickPlay ] = useSound("https://hc-cdn.hel1.your-objectstorage.com/s/v3/d3bd3f0972d62d58cdfce91bc042d32ee643aa94_ui_button_confirm_audio.mp4")
   
   function handleClick(event: any){
        if (shouldPreventDefault){
            event.preventDefault();
        }
        clickPlay();
        if (onClickAction){
            onClickAction();
        }
   }
   
   return (
        <button form = {form} type={type} className = {`w-full group ${ disabled ? "brightness-60" : "hover:bg-radial hover:scale-110 transition duration-300 ease-in-out hover:from-white/70 hover:to-60%" } my-3 flex flex-row items-center justify-center justify-items-center  ${className}`} onMouseEnter={() => play()} onMouseLeave={() => stop()} onClick={(event) => handleClick(event)}>
            <img alt="Left arrow" className = "w-6 -rotate-45 align-middle self-start" src = "https://hc-cdn.hel1.your-objectstorage.com/s/v3/3c6072a6a2de50498ea8551f38cad3c367ad2b98_image.png"/>
            <span className = "align-middle self-middle px-2">
                { disabled 
                    ? children
                    : <a href = {href}>{children}</a>
                }
            </span>  
            <img alt="Right arrow" className = "w-6 rotate-135 align-middle self-end" src = "https://hc-cdn.hel1.your-objectstorage.com/s/v3/3c6072a6a2de50498ea8551f38cad3c367ad2b98_image.png"/>
        </button>
    )
}