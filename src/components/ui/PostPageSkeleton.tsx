import { Skeleton } from "./skeleton"

export function PostPageSkeleton(){
    return (
            <div className=" mt-2 flex min-w-[50vw] w-[50vw] rounded-sm bg-gray-800 px-3 py-2 text-gray-100">
                <div className="mr-4 mt-1">
                  <button
                  className='up h-[3vh] w-[1.2vw] bg-cover bg-center'
                  ></button>
                  <div className=" text-center text-sm"></div>
                  <button
                    className='mt-2 down h-[3vh] w-[1.2vw] bg-cover bg-center'  
                  ></button>
                </div>
                          
                    <div className="flex-col justify-center gap-6">
                        <div className="flex items-center gap-2">
                          <Skeleton className='w-[18vw] h-[2vh] bg-gray-200 bg-opacity-20 mt-2'/>
                        </div>
                        <Skeleton className='w-[23vw] h-[3.4vh] bg-gray-200 bg-opacity-20 mt-2 mb-3'/>

                        <Skeleton className="w-[45vw] h-[53vh] bg-gray-100 bg-opacity-20"/>
                        <Skeleton className='w-[11vw] h-[1.4vh] bg-gray-200 bg-opacity-20 mt-4 mb-2'/>
                        <Skeleton className='w-[45vw] h-[13vh] bg-gray-200 bg-opacity-20 mt-1'/>

                        <Skeleton className='w-[45vw] h-[5.7vh] bg-gray-200 bg-opacity-20 mt-2'/>

                    </div> 
                </div>
    )
}