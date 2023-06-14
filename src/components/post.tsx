import { useState, useEffect } from 'react';

import { getFirestore, increment, doc, updateDoc } from 'firebase/firestore';

import { getDocumentIdFromField } from '../modules/getIdFromField';

interface PostProps {
  content: string;
  title: string;
  user: string;
  subgeddit: string;
  timePosted: Date;
  upvotes: number;
}

export function Post(props: PostProps) {
  const [hasImage, setImageStatus] = useState(false);

  useEffect(() => {
    if (props.content.substring(0, 4) == 'http') {
      setImageStatus(true);
    }
  }, [props.content]);

  //might need to refresh to display change
  //so instead maybe make it a temporary superficial
  //frontend increment and then it'll be caught up for real next time
  const [upvotesAmount, setUpvotesAmount] = useState(props.upvotes);
  const [alreadyIncremented, setAlreadyIncremented] = useState(false);
  const [alreadyDecremented, setAlreadyDecremented] = useState(false);

  async function incrementUpvotes(): Promise<void> {
    if (!alreadyIncremented) {
      const postId = await getDocumentIdFromField(
        'posts',
        'timePosted',
        props.timePosted
      );
      if (alreadyDecremented) {
        try {
          const postRef = doc(getFirestore(), 'posts', postId);
          updateDoc(postRef, {
            upvotes: increment(2),
          });

          setUpvotesAmount(upvotesAmount + 2);
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          const postRef = doc(getFirestore(), 'posts', postId);
          updateDoc(postRef, {
            upvotes: increment(1),
          });

          setUpvotesAmount(upvotesAmount + 1);
        } catch (error) {
          console.log(error);
        }
      }

      setAlreadyIncremented(true);
      setAlreadyDecremented(false);
    }
  }

  async function decrementUpvotes(): Promise<void> {
    if (!alreadyDecremented) {
      const postId = await getDocumentIdFromField(
        'posts',
        'timePosted',
        props.timePosted
      );

      if (alreadyIncremented) {
        try {
          const postRef = doc(getFirestore(), 'posts', postId);
          updateDoc(postRef, {
            upvotes: increment(-2),
          });

          setUpvotesAmount(upvotesAmount - 2);
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          const postRef = doc(getFirestore(), 'posts', postId);
          updateDoc(postRef, {
            upvotes: increment(-1),
          });

          setUpvotesAmount(upvotesAmount - 1);
        } catch (error) {
          console.log(error);
        }
      }

      setAlreadyIncremented(false);
      setAlreadyDecremented(true);
    }
  }

  return (
    <div className="hover:border-1 mt-2 flex w-[40vw] rounded-sm bg-gray-800 px-3  py-2 text-gray-100 hover:border hover:border-gray-50">

      <div className="mr-4 mt-1">
        <button
          className={
            alreadyIncremented
              ? 'clicked-up h-[3vh] w-[1.2vw] bg-cover  bg-center'
              : 'up h-[3vh] w-[1.2vw] bg-cover  bg-center'
          }
          onClick={incrementUpvotes}
        ></button>
        <div className="-mt-[.65vh]  text-center text-sm">{upvotesAmount}</div>
        <button
          className={
            alreadyDecremented
              ? 'clicked-down h-[3vh] w-[1.2vw] bg-cover  bg-center'
              : 'down h-[3vh] w-[1.2vw] bg-cover  bg-center'
          }
          onClick={decrementUpvotes}
        ></button>
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
            {props.timePosted.toString()}
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
