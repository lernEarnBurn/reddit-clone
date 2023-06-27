import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import { getUsersSubgeddits } from '../modules/getUsersSubgeddits';

import { DocumentData } from 'firebase/firestore';

import { Link } from 'react-router-dom';

interface PageInfoProps {
  subgeddit: string;
  subgedditObj: DocumentData;
  user: string | null;
}

export function PageInfo(props: PageInfoProps) {

  const [followed, setFollowed] = useState<boolean | null>(false);
  const [isRealSubgeddit, setIsRealSubgeddit] = useState<boolean | null>(null);

  useEffect(() => {
    if (props.subgeddit === 'Home' || props.subgeddit === 'Popular') {
      setIsRealSubgeddit(false);
    } else {
      setIsRealSubgeddit(true);
    }

    const checkIfFollowingSubgeddit = async () => {
      if(props.user){
        const followedSubgeddits = await getUsersSubgeddits(props.user);
        if(followedSubgeddits){
          for (const subgeddit of followedSubgeddits) {
            console.log(`prop subgeddit: ${props.subgeddit === subgeddit}`)
            if (props.subgeddit === subgeddit) {
              setFollowed(true);
              
            }
          }
        }
      }
    };

    checkIfFollowingSubgeddit();
  }, [props.subgeddit, props.user]);


  return (
    <div className="ml-2 mt-2 h-auto min-w-[20vw] max-w-[20vw] flex-col justify-end rounded-sm bg-gray-800 pb-4">
      <div className="primary-foreground mt-6 flex justify-center text-2xl font-bold">
        <p>g/{props.subgeddit}</p>
      </div>

      <div className="primary-foreground px-6 py-4">
        {props.subgedditObj.description}
      </div>
      <div>
        {isRealSubgeddit ? (
          <>
            <div className="flex justify-center gap-14">
              <div className="text-center text-xs text-gray-100">
                <div className="text-2xl">{props.subgedditObj.followers}</div>
                Followers
              </div>
              <div className="text-center text-xs text-gray-100">
                <div className="text-2xl">1</div>Online RN
              </div>
            </div>
            <Link to="/create-post">
              <Button className="ml-[1vw] mt-2 h-[5vh] w-[18vw]">
                Create Post
              </Button>
            </Link>
            {props.subgeddit !== 'Home' &&
            props.subgeddit !== 'Popular' &&
            followed ? (
              <Button className="ml-[1vw] mt-2 h-[5vh] w-[18vw]">
                Unfollow
              </Button>
            ) : props.subgeddit !== 'Home' &&
              props.subgeddit !== 'Popular' &&
              !followed ? (
                <Button className=" ml-[1vw] mt-2 h-[5vh] w-[18vw]">
                  Follow
                </Button>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
}
