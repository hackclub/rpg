export default function StatPill({children, className}: {children: React.ReactNode, className?: string}){
    return (
        <span className = {`bg-gray-200/20 border border-white/20 text-sm rounded-lg p-1 max-w-max flex flex-row align-middle gap-1 items-center justify-center break-normal ${className}`}>
            {children}
        </span>
    )
}