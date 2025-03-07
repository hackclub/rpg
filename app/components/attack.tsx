export default function AttackButton(){
    return (
        <div>
            <button onClick = {() => fetch("/api/attack")}></button>
        </div>
    )
}