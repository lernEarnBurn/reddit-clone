import { Skeleton } from "./skeleton"

export function PostSkeleton(){
    return (
        <div className='mt-2 flex h-[45vh] w-[40vw] rounded-sm bg-gray-800 px-3  py-2'>
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
              <Skeleton className='w-[16vw] h-[2vh] bg-gray-200 bg-opacity-20 mt-1'/>
              <Skeleton className='w-[20vw] h-[3vh] bg-gray-200 bg-opacity-20 mt-3'/>                
              <Skeleton className='w-[35vw] h-[34vh] bg-gray-200 bg-opacity-20 mt-2'/>                
            </div>
        </div>
    )
}