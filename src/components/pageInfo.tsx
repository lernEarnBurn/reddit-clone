import { Button } from './ui/button';

interface PageInfoProps {
  subgeddit: string;
}

export function PageInfo(props: PageInfoProps) {
  return (
    <div className="ml-2 mt-2 max-w-[20vw] flex-col justify-end rounded-sm bg-gray-800">
      <div className="primary-foreground mt-6 flex justify-center text-2xl font-bold">
        <p>g/{props.subgeddit}</p>
      </div>
      <div className="primary-foreground px-6 py-4">
        This is the dasddddddd dddddass ssssss sssssssss ssssssss ssses This is
        the dasddddddd dddddass ssssss sssssssss ssssssss ssses cription and it
        is goi to be long as hell. This is the description and it is goi to be
        long as hell
      </div>
      <div className="flex justify-center gap-14">
        <div className="text-center text-xs text-gray-100">
          <div className="text-2xl">78</div>Followers
        </div>
        <div className="text-center text-xs text-gray-100">
          <div className="text-2xl">30</div>Online RN
        </div>
      </div>
      <Button className="ml-[1vw] mt-6 h-[5vh] w-[18vw]">Create Post</Button>
    </div>
  );
}
