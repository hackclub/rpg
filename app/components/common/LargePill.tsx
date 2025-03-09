export default function LargePill({children, className}: {children: React.ReactNode, className?: string}){
    return (
        <div className = "w-full bg-accent/40 rounded-sm border border-accent h-1/4 p-6">
            {children}
        </div>
    )
}