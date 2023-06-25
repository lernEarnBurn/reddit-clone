import { Skeleton } from './skeleton';

export function PostSkeleton() {
  return (
    <div className="mt-2 flex h-[45vh] w-[40vw] rounded-sm bg-gray-800 px-3  py-2">
      <div className="mr-4 mt-1">
        <button className="up h-[3vh] w-[1.2vw] bg-cover bg-center"></button>
        <div className=" text-center text-sm"></div>
        <button className="down mt-2 h-[3vh] w-[1.2vw] bg-cover bg-center"></button>
      </div>
      <div className="flex-col justify-center gap-6">
        <Skeleton className="mt-1 h-[2vh] w-[16vw] bg-gray-200 bg-opacity-20" />
        <Skeleton className="mt-3 h-[3vh] w-[20vw] bg-gray-200 bg-opacity-20" />
        <Skeleton className="mt-2 h-[34vh] w-[35vw] bg-gray-200 bg-opacity-20" />
      </div>
    </div>
  );
}
