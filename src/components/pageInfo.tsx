import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import { getUsersSubgeddits } from '../modules/getUsersSubgeddits';

import { DocumentData, getFirestore, doc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from 'firebase/firestore';

import { getDocumentIdFromField } from '../modules/getIdFromField';

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
            if (props.subgeddit === subgeddit) {
              setFollowed(true);
              
            }
          }
        }
      }
    };

    checkIfFollowingSubgeddit();
  }, [props.subgeddit, props.user]);

  const [alreadyRunning, setAlreadyRunning] = useState(false)
  

  async function followSub(){
    if(!alreadyRunning){
      setAlreadyRunning(true)

      setFollowed((prevFollowed) => !prevFollowed)

      if(props.user){
        const userId = await getDocumentIdFromField(
          'users',
          'name',
          localStorage.getItem('user')
        );

        const userRef = doc(getFirestore(), 'users', userId);

        await updateDoc(userRef, {
          following: arrayUnion(props.subgeddit),
        });

        setAlreadyRunning(false)

      }
    }
  }

  async function unfollowSub(){
    if(!alreadyRunning){
      setAlreadyRunning(true)
      setFollowed((prevFollowed) => !prevFollowed)

      if(props.user){
        const userId = await getDocumentIdFromField(
          'users',
          'name',
          localStorage.getItem('user')
        );

        const userRef = doc(getFirestore(), 'users', userId);

        await updateDoc(userRef, {
          following: arrayRemove(props.subgeddit),
        });

        setAlreadyRunning(false)

      }
    }
  }


  return (
    <div className="ml-2 mt-2 h-auto min-w-[20vw] max-w-[20vw] flex-col justify-center rounded-sm bg-gray-800 pb-4 ">
      <div className="primary-foreground mt-6 flex justify-center text-2xl font-bold">
        <p>g/{props.subgeddit}</p>
      </div>
      {props.subgeddit !== 'Home' &&
            props.subgeddit !== 'Popular' &&
            followed ? (
              <Button onClick={unfollowSub} className="ml-[6.4vw] rounded-2xl mt-3 py-3 h-[3vh] w-[7vw] text-xs">
                Unfollow
              </Button>
            ) : props.subgeddit !== 'Home' &&
              props.subgeddit !== 'Popular' &&
              !followed ? (
                <Button onClick={followSub} className="ml-[6.4vw] rounded-2xl mt-3 py-3 h-[3vh] w-[7vw] text-xs">
                  Follow
                </Button>
            ) : null}

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
              <Button className="ml-[1vw] mt-4 h-[5vh] w-[18vw]">
                Create Post
              </Button>
            </Link>
            
          </>
        ) : null}
      </div>
    </div>
  );
}
