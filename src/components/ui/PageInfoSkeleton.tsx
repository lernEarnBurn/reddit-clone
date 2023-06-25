import { Skeleton } from './skeleton';

interface PageInfoSkelProps {
  subgeddit: string;
}

export function PageInfoSkeleton(props: PageInfoSkelProps) {
  return (
    <div className="ml-2 mt-2 h-auto min-w-[20vw] max-w-[20vw] flex-col justify-end rounded-sm bg-gray-800 pb-4">
      <div className="mt-6 flex justify-center">
        <Skeleton className="h-[3.5vh] w-[12vw] bg-gray-100 bg-opacity-20" />
      </div>

      <div className="px-6 py-4">
        <Skeleton className="h-[2vh] w-[15.5vw] bg-gray-100 bg-opacity-20" />
        <Skeleton className="mt-2 h-[2vh] w-[16.9vw] bg-gray-100 bg-opacity-20" />
        <Skeleton className="mt-2 h-[2vh] w-[16vw] bg-gray-100 bg-opacity-20" />
        <Skeleton className="mt-2 h-[2vh] w-[16.7vw] bg-gray-100 bg-opacity-20" />
      </div>
      {props.subgeddit !== 'Home' && props.subgeddit !== 'Popular' ? (
        <>
          <div className="flex justify-center gap-14">
            <div>
              <Skeleton className="h-[3vh] w-[2.3vw] bg-gray-100 bg-opacity-20" />
              <Skeleton className="mt-1 h-[2vh] w-[3vw] bg-gray-100 bg-opacity-20" />
            </div>
            <div>
              <Skeleton className="h-[3vh] w-[2.3vw] bg-gray-100 bg-opacity-20" />
              <Skeleton className="mt-1 h-[2vh] w-[3vw] bg-gray-100 bg-opacity-20" />
            </div>
          </div>

          <Skeleton className="ml-3 mt-4 h-[4.6vh] w-[18vw] bg-gray-100 bg-opacity-20" />
          <p>Has Spot</p>
        </>
      ) : null}
    </div>
  );
}
