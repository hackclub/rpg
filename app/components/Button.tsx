export default function Button({children, className, onClick, href}: {children: React.ReactNode, className?: string, onClick?: () => void, href?: string}){
    return (
        <button className = {`w-full group hover:bg-radial hover:scale-110 transition duration-300 ease-in-out hover:from-white/70 hover:to-60% my-3 flex flex-row items-center justify-center justify-items-center  ${className}`} onClick = {onClick}>
            <img className = "w-6 -rotate-45 align-middle self-start" src = "https://hc-cdn.hel1.your-objectstorage.com/s/v3/3c6072a6a2de50498ea8551f38cad3c367ad2b98_image.png"/>
            <span className = "align-middle px-2">
                <a href = {href}>{children}</a>
            </span>  
            <img className = "w-6 rotate-135 align-middle self-end" src = "https://hc-cdn.hel1.your-objectstorage.com/s/v3/3c6072a6a2de50498ea8551f38cad3c367ad2b98_image.png"/>
        </button>
    )
}