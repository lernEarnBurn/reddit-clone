import { Skeleton } from './skeleton';

export function PostPageSkeleton() {
  return (
    <div className=" mt-2 flex w-[50vw] min-w-[50vw] rounded-sm bg-gray-800 px-3 py-2 text-gray-100">
      <div className="mr-4 mt-1">
        <button className="up h-[3vh] w-[1.2vw] bg-cover bg-center"></button>
        <div className=" text-center text-sm"></div>
        <button className="down mt-2 h-[3vh] w-[1.2vw] bg-cover bg-center"></button>
      </div>

      <div className="flex-col justify-center gap-6">
        <div className="flex items-center gap-2">
          <Skeleton className="mt-2 h-[2vh] w-[18vw] bg-gray-200 bg-opacity-20" />
        </div>
        <Skeleton className="mb-3 mt-2 h-[3.4vh] w-[23vw] bg-gray-200 bg-opacity-20" />

        <Skeleton className="h-[53vh] w-[45vw] bg-gray-100 bg-opacity-20" />
        <Skeleton className="mb-2 mt-4 h-[1.4vh] w-[11vw] bg-gray-200 bg-opacity-20" />
        <Skeleton className="mt-1 h-[13vh] w-[45vw] bg-gray-200 bg-opacity-20" />

        <Skeleton className="mt-2 h-[5.7vh] w-[45vw] bg-gray-200 bg-opacity-20" />
      </div>
    </div>
  );
}
