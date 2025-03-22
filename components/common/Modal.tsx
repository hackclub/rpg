import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Modal({isOpen, setIsOpen, children, customClose, customCloseAction, showClose=true}: {isOpen: boolean, setIsOpen: (value: any) => void, children: React.ReactNode, customClose?: string, customCloseAction?: () => void, showClose?: boolean}){
    useEffect(() => { // weird solution for disabling scrolling when the modal is open
        if (isOpen) {
            document.body.classList.add("overflow-y-hidden")
        } else {
            document.body.classList.remove("overflow-y-hidden")
        }}
    ,[isOpen])
    
    return (
        <>
        { isOpen ? 
            <div className = "z-100 bg-dark/80 border border-dark fixed h-screen min-h-screen w-full transition-all duration-300 ease-in-out sm:px-32 sm:py-12 md:px-36 md:py-18 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className = "z-100 bg-darker rounded-sm overflow-y-scroll size-full p-8 flex flex-col">
                    <div className = "grow">
                        {children}
                    </div>
                    { showClose ? <button className = "sticky bottom-0 right-0 w-max self-center sm:self-end p-2 bg-darker/25 border border-white/40 rounded-sm" onClick={() => {setIsOpen(false); customCloseAction && customCloseAction()}}>{customClose ? customClose : "Close"}</button> : null }

                    </div>
            </div>
        : null }
    </>
    )
}