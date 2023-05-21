import { useState, useEffect } from 'react';



interface PostProps {
    content: string;
    title: string;
    user: string;
    subgeddit: string;
    timeStamp: string;
    upvotes: number;
  }


export function Post(props: PostProps){

    const [hasImage, setImageStatus] = useState(false)

    useEffect(() => {
        if(props.content.substring(0, 4) == "http"){
            setImageStatus(true)
        }
    }, [props.content])

    


    return(
        <div className="text-gray-100 w-[40vw] mt-2 bg-gray-800 rounded-sm px-3 py-2  hover:border hover:border-gray-50 hover:border-1 flex">
              <div className="mr-4 flex-col mt-1">
                <div className="w-[1.2vw] h-[3vh] bg-cover up"></div>
                <div className="text-sm ml-1">{props.upvotes}</div>
                <div className="w-[1.2vw] h-[3vh] bg-cover down"></div>
              </div>
              <div className="flex-col gap-6 justify-center">
                <div className="flex gap-2 items-center">
                  <div className="text-sm cursor-pointer hover:underline">g/{props.subgeddit}</div>
                  <div className="text-xs">Posted by <span className="cursor-pointer hover:underline">u/{props.user}</span> {props.timeStamp}</div>
                </div>
                <div className="text-xl">{props.title}</div>
                {!hasImage ? (
                    <div className="text-sm">
                        {props.content}
                    </div>
                ) : (
                    <div className="bg-contain w-[100%] h-[20vw]" style={{ backgroundImage: `url(${props.content})`, backgroundSize: '100% 100%' }}></div>

                )}
                
              </div>
        </div>
    )
}