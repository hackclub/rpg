import { useEffect } from "react"
import { useRouter } from "next/navigation"
export default function Modal({isOpen, setIsOpen, children, customClose, customCloseAction}: {isOpen: boolean, setIsOpen: (value: any) => void, children: React.ReactNode, customClose?: string, customCloseAction?: (value: any) => void}){
    useEffect(() => { // weird solution for disabling scrolling when the modal is open
        if (isOpen) {
            document.body.classList.add("overflow-y-hidden")
        } else {
            document.body.classList.remove("overflow-y-hidden")
        }}
    ,[isOpen])
    const router = useRouter()
    return (
        <>
        { isOpen ? 
            <div className = "bg-dark/80 absolute h-full w-full transition-all duration-300 ease-in-out sm:px-32 sm:py-12 md:px-64 md:py-28 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className = "z-50 bg-darker overflow-y-scroll size-full p-10 flex flex-col">
                    <div className = "grow">
                        {children}
                    </div>
                    <button className = "ml-auto" onClick={() => {setIsOpen(false); router.refresh(); customCloseAction}}>{customClose ? customClose : "Close"}</button>
                </div>
            </div>
        : null }
    </>
    )
}