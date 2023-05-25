
interface SubgedditFormProps {
    setCreateSubgeddit : React.Dispatch<React.SetStateAction<boolean>>;
}

export function SubgedditForm(props : SubgedditFormProps){
    return (
        <>  
            <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-gray-500 bg-opacity-50 z-10">
                <div className="h-[65vh] w-[25vw] flex-col items-center rounded-lg bg-gray-400 p-6">
                <button
                        className="mb-12 mr-2 p-1"
                        onClick={() => {
                          props.setCreateSubgeddit(false);
                        }}>
            X
          </button>
                </div>
            </div>
        </>
    )
}