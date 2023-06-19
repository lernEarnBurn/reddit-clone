import { Skeleton } from "./skeleton";


interface PageInfoSkelProps {
    subgeddit: string;
}

export function PageInfoSkeleton(props : PageInfoSkelProps){
    return (
        
        <div className="ml-2 mt-2 h-auto max-w-[20vw] min-w-[20vw] flex-col justify-end rounded-sm bg-gray-800 pb-4">
        <div className="mt-6 flex justify-center">
          <Skeleton className="w-[12vw] h-[3.5vh] bg-gray-100 bg-opacity-20"/>
        </div>
        
        <div className="px-6 py-4">
            <Skeleton className="w-[15.5vw] h-[2vh] bg-gray-100 bg-opacity-20"/>
            <Skeleton className="mt-2 w-[16.9vw] h-[2vh] bg-gray-100 bg-opacity-20"/>
            <Skeleton className="mt-2 w-[16vw] h-[2vh] bg-gray-100 bg-opacity-20"/>
            <Skeleton className="mt-2 w-[16.7vw] h-[2vh] bg-gray-100 bg-opacity-20"/>
        </div>
        {props.subgeddit !== 'Home' && props.subgeddit !== 'Popular'  ? (
            <>
                <div className="flex justify-center gap-14">
                  <div>
                    <Skeleton className="w-[2.3vw] h-[3vh] bg-gray-100 bg-opacity-20"/>
                    <Skeleton className="mt-1 w-[3vw] h-[2vh] bg-gray-100 bg-opacity-20"/>
                  </div>
                  <div>
                    <Skeleton className="w-[2.3vw] h-[3vh] bg-gray-100 bg-opacity-20"/>
                    <Skeleton className="mt-1 w-[3vw] h-[2vh] bg-gray-100 bg-opacity-20"/>
                  </div>
                </div>

                <Skeleton className="mt-4 ml-3 w-[18vw] h-[4.6vh] bg-gray-100 bg-opacity-20"/>
                <p>Has Spot</p>
            </>
        ) : null}
        
      </div>
    
    )
}