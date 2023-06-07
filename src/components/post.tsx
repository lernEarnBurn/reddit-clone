import { useState, useEffect } from 'react';

interface PostProps {
  content: string;
  title: string;
  user: string;
  subgeddit: string;
  timeStamp: string;
  upvotes: number;
}

export function Post(props: PostProps) {
  const [hasImage, setImageStatus] = useState(false);

  useEffect(() => {
    if (props.content.substring(0, 4) == 'http') {
      setImageStatus(true);
    }
  }, [props.content]);

  return (
    <div className="hover:border-1 mt-2 flex w-[40vw] rounded-sm bg-gray-800 px-3  py-2 text-gray-100 hover:border hover:border-gray-50">
      <div className="mr-4 mt-1 flex-col">
        <div className="up h-[3vh] w-[1.2vw] bg-cover"></div>
        <div className="ml-[.48vw] text-sm">{props.upvotes}</div>
        <div className="down h-[3vh] w-[1.2vw] bg-cover"></div>
      </div>
      <div className="flex-col justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="primary-foreground cursor-pointer text-sm hover:underline">
            g/{props.subgeddit}
          </div>
          <div className="primary-foreground text-xs">
            Posted by{' '}
            <span className="cursor-pointer hover:underline ">
              u/{props.user}
            </span>{' '}
            {props.timeStamp}
          </div>
        </div>
        <div className="primary-foreground mb-2 text-xl">{props.title}</div>
        {!hasImage ? (
          <div className="whitespace-normal text-sm">{props.content}</div>
        ) : (
          /*figure out how to properly size images and possibly figure out aspect ratios */
          <div
            className="h-[40vh] w-[36vw] bg-cover bg-center bg-no-repeat object-cover"
            style={{ backgroundImage: `url(${props.content})` }}
          ></div>
        )}
      </div>
    </div>
  );
}
