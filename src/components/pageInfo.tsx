import { Button } from "./ui/button";

interface PageInfoProps {
  subgeddit: string;
}

export function PageInfo(props: PageInfoProps) {
  return (
    <div className="ml-2 mt-2 max-w-[20vw] max-h-[50vh] rounded-sm bg-gray-800 flex-col justify-end">
      <div
        className="primary-foreground mt-6 text-2xl font-bold flex justify-center">
        <p>g/{props.subgeddit}</p>
      </div>
      <div className="primary-foreground px-6 py-4">This is the dasddddddd dddddass ssssss sssssssss ssssssss sssescription and it is goi to be long as hell. This is the description and it is goi to be long as hell</div>
      <div className="flex gap-14 justify-center">
        <div className="text-xs text-center text-gray-100"><div className="text-2xl">78</div>Followers</div>
        <div className="text-xs text-center text-gray-100"><div className="text-2xl">30</div>Online RN</div>
      </div>
      <Button className="w-[18vw] h-[5vh] mt-6 ml-[1vw]">Create Post</Button>
    </div>
  );
}
