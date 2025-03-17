import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Modal({isOpen, setIsOpen, children, customClose, customCloseAction}: {isOpen: boolean, setIsOpen: (value: any) => void, children: React.ReactNode, customClose?: string, customCloseAction?: () => void}){
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
            <div className = "z-60 bg-dark/80 border border-dark fixed h-screen min-h-screen w-full transition-all duration-300 ease-in-out sm:px-32 sm:py-12 md:px-36 md:py-18 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className = "z-50 bg-darker rounded-sm overflow-y-scroll size-full p-10 flex flex-col">
                    <div className = "grow">
                        {children}
                    </div>
                    <button className = "self-center lg:self-end" onClick={() => {setIsOpen(false); customCloseAction && customCloseAction()}}>{customClose ? customClose : "Close"}</button>
                </div>
            </div>
        : null }
    </>
    )
}