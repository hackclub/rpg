export default function StatPill({children}: {children: React.ReactNode}){
    return (
        <span className = "bg-gray-200/20 border border-white/20 text-sm rounded-lg p-1 w-max flex flex-row align-middle gap-1 items-center justify-center">
            {children}
        </span>
    )
}