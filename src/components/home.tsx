
export function Home(){
    /* gonna make this overall format into a compontent with strategic props to allow dynamic information to appear */
    return (
        <>
            <div className="bg-gray-700 h-auto min-h-[91vh] w-screen absolute"> 
                <div className="w-[30vw] h-[8vh] bg-gray-800 flex items-center justify-evenly mt-2">
                    <div className="flex primary-foreground">
                        <img src="/images/add.svg"></img>
                        <div>Top</div>
                    </div>
                    <div className="flex primary-foreground">
                        <img src="/images/add.svg"></img>
                        <div>New</div>
                    </div>
                </div>
            </div>
        </>
    )
}