export default function Loading(){
    return (
        <div className = "h-screen w-screen">
            <div className = "absolute right-10 bottom-10 flex flex-row gap-10 items-center justify-center">
                <h2>Loading...</h2>
                <img alt="A GIF of Orpheus dancing" className = "h-32" src = "https://hc-cdn.hel1.your-objectstorage.com/s/v3/dec8028951d54528fb5cf350e60e6258c8fbb7da_ezgif.com-gif-maker.gif"/>
            </div>
        </div>
    )
}