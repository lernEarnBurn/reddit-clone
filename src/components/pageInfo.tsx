import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import { getUsersSubgeddits } from '../modules/getUsersSubgeddits';

import { getAuth } from 'firebase/auth';

import { DocumentData } from 'firebase/firestore';


interface PageInfoProps {
  subgeddit: string;
  subgedditObj: DocumentData
}

export function PageInfo(props: PageInfoProps) {

  useEffect(() => {
    
    const checkIfSubgedditExists = async () => {
      const user = getAuth().currentUser?.displayName
      if(user){
        const followedSubgeddits = await getUsersSubgeddits(user);
        for (const subgeddit in followedSubgeddits) {
          if (props.subgeddit === subgeddit) {
            setFollowed(true);
          }
        }
      }
    };
  
    checkIfSubgedditExists();
  }, [props.subgeddit]);

  const [followed, setFollowed] = useState<boolean | null>(false)  

  return (
    <div className="ml-2 mt-2 max-w-[20vw] flex-col justify-end rounded-sm bg-gray-800 h-auto pb-4">
      <div className="primary-foreground mt-6 flex justify-center text-2xl font-bold">
        {/*Gonna get the id using my module and then get the full object and use that instead of just the prop */}
        <p>g/{props.subgedditObj.name}</p>
      </div>
      {(props.subgeddit !== "Home" && props.subgeddit !== "Popular" && followed) ? (
        <p>not followed</p>
      ) : (props.subgeddit !== "Home" && props.subgeddit !== "Popular" && !followed) ? (
        <p>followed</p>
      ): (
        null
      )}
      <div className="primary-foreground px-6 py-4">
        {props.subgedditObj.description}
      </div>
      <div className="flex justify-center gap-14">
        <div className="text-center text-xs text-gray-100">
          <div className="text-2xl">{props.subgedditObj.followers}</div>Followers
        </div>
        <div className="text-center text-xs text-gray-100">
          <div className="text-2xl">1</div>Online RN
        </div>
      </div>
      <Button className="ml-[1vw] mt-2 h-[5vh] w-[18vw]">Create Post</Button>

    </div>
  );
}
