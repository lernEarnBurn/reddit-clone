import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';

import { PageInfo } from './pageInfo';

import {
  query,
  collection,
  getDocs,
  updateDoc,
  getFirestore,
  DocumentData,
  doc,
  DocumentReference,
  getDoc,
  where,
  increment,
} from 'firebase/firestore';

import { getDocumentIdFromField } from '../modules/getIdFromField';

import { CommentSection } from './commentSection';

import { PageInfoSkeleton } from './ui/PageInfoSkeleton';
import { PostPageSkeleton } from './ui/PostPageSkeleton';

export function PostPage() {
  const { id } = useParams();

  const [post, setPost] = useState<DocumentData>({});
  const [subgedditData, setSubgedditData] = useState<DocumentData>({});

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getPostDetails(): Promise<void> {
      const db = getFirestore();
      if (id) {
        setLoading(true);
        const postRef: DocumentReference = doc(db, 'posts', id);

        const postSnapshot = await getDoc(postRef);
        if (postSnapshot.exists()) {
          const postData = postSnapshot.data();
          setPost(postData);
        }
      }
    }

    getPostDetails();
  }, [id]);

  useEffect(() => {
    async function getSubgedditDetails(): Promise<void> {
      setUpvotesAmount(post.upvotes);
      const collectionRef = collection(getFirestore(), 'subgeddits');
      const q = query(collectionRef, where('name', '==', post.subgeddit));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const documentSnapshot = querySnapshot.docs[0];
        const data = documentSnapshot.data();
        setSubgedditData(data);
        setLoading(false);
      }
    }

    getSubgedditDetails();
  }, [post]);

  const [hasImage, setImageStatus] = useState(false);

  useEffect(() => {
    if (post && post.content) {
      if (post.content.substring(0, 4) == 'http') {
        setImageStatus(true);
      }
    }
  }, [post]);

  const [upvotesAmount, setUpvotesAmount] = useState<number>(post.upvotes);
  const [alreadyIncremented, setAlreadyIncremented] = useState(false);
  const [alreadyDecremented, setAlreadyDecremented] = useState(false);

  async function incrementUpvotes(): Promise<void> {
    if (!alreadyIncremented) {
      const postId = await getDocumentIdFromField(
        'posts',
        'timePosted',
        post.timePosted
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
        post.timePosted
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

  return !loading ? (
    <div className="flex items-start justify-center">
      <div className=" mt-2 flex w-[50vw] min-w-[50vw] rounded-sm bg-gray-800 px-3 py-2 text-gray-100">
        <div className="mr-4 mt-1">
          <button
            className={
              alreadyIncremented
                ? 'clicked-up h-[3vh] w-[1.2vw] bg-cover  bg-center'
                : 'up h-[3vh] w-[1.2vw] bg-cover  bg-center'
            }
            onClick={incrementUpvotes}
          ></button>
          <div className="-mt-[.65vh]  text-center text-sm">
            {post.upvotes === Number ? post.upvotes : upvotesAmount}
          </div>
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
            <div className="primary-foreground text-md cursor-pointer hover:underline">
              g/{post.subgeddit}
            </div>
            <div className="primary-foreground mt-1 text-xs">
              Posted by{' '}
              <span className="cursor-pointer text-gray-300 hover:underline">
                u/{post.postedBy}
              </span>{' '}
              {post && post.timePosted ? post.timePosted.toString() : null}
            </div>
          </div>
          <div className="primary-foreground mb-2 mt-1 text-2xl">
            {post.title}
          </div>
          {!hasImage ? (
            <div className="whitespace-normal text-sm w-[44vw]">{post.content}</div>
          ) : (
            <div
              className="h-[60vh] w-[45vw] bg-cover bg-center bg-no-repeat object-cover"
              style={{ backgroundImage: `url(${post.content})` }}
            ></div>
          )}
          <CommentSection id={id} post={post} />
        </div>
      </div>
      <PageInfo subgeddit={post.subgeddit} subgedditObj={subgedditData} />
    </div>
  ) : (
    <div className="flex items-start justify-center">
      <PostPageSkeleton />
      <PageInfoSkeleton subgeddit={post.subgeddit} />
    </div>
  );
}
