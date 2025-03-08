import Button from "./Button"

export default function Sign({children, href}: {children?: React.ReactNode, href: string}){
    return (
        <div className = "flex flex-col w-full">
            <div className = "flex justify-between">
                <div className = "h-3 md:h-9 border-l-2 border-amber-950 brightness/25"/>
                <div className = "h-3 md:h-9 border-r-2 border-amber-950 brightness/25"/>
            </div>
            <div className = "cursor-pointer group border-amber-950 border-2 h-max break-all flex justify-between items-center uppercase text-center bg-amber-800 brightness/75  inset-shadow-accent/50 font-text text-red-950 text-md md:text-lg lg:text-2xl p-4 vignette-sm">
                <span className = "md:max-lg:hidden inline">•</span>
                    <span className="group-hover:text-accent/80 group-hover:bg-radial group-hover:transition group-hover:duration-300 group-hover:ease-in-out group-hover:from-amber-700/50 group-hover:to-90% "><a href = {href}>{children}</a></span>
                    <span className = "md:max-lg:hidden inline">•</span>
            </div>
        </div>
    )
}