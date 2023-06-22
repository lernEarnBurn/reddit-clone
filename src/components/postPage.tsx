import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { PageInfo } from "./pageInfo";

import { query, collection, getDocs, updateDoc, getFirestore, DocumentData, doc, DocumentReference, getDoc, where, increment } from "firebase/firestore";

import { getDocumentIdFromField } from "../modules/getIdFromField";

import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { PageInfoSkeleton } from "./ui/PageInfoSkeleton";
import { PostPageSkeleton } from "./ui/PostPageSkeleton";

export function PostPage() {
    const {id} = useParams()

    const [post, setPost] = useState<DocumentData>({})
    const [subgedditData, setSubgedditData] = useState<DocumentData>({})

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function getPostDetails(): Promise<void>{
            
            const db = getFirestore()
            if(id){
                setLoading(true)
                const postRef: DocumentReference = doc(db, 'posts', id);
                
                const postSnapshot = await getDoc(postRef);
                if (postSnapshot.exists()) {
                  const postData = postSnapshot.data();
                  setPost(postData)  
                }
            }
        }

        getPostDetails()
    }, [id])


    useEffect(() => {
        async function getSubgedditDetails(): Promise<void>{ 
            setUpvotesAmount(post.upvotes)
            const collectionRef = collection(getFirestore(), 'subgeddits');
            const q = query(collectionRef, where('name', '==', post.subgeddit));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
              const documentSnapshot = querySnapshot.docs[0];
              const data = documentSnapshot.data();
              setSubgedditData(data)
              setLoading(false)
            }
        }

        getSubgedditDetails()
    }, [post])

    const [hasImage, setImageStatus] = useState(false);

  useEffect(() => {
    if(post && post.content){
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

  

    return (
            !loading  ? (
              <div className="flex items-start justify-center">
                  <div className=" mt-2 flex min-w-[50vw] w-[50vw] rounded-sm bg-gray-800 px-3 py-2 text-gray-100">
                      <div className="mr-4 mt-1">
                          <button
                            className={
                              alreadyIncremented
                                ? 'clicked-up h-[3vh] w-[1.2vw] bg-cover  bg-center'
                                : 'up h-[3vh] w-[1.2vw] bg-cover  bg-center'
                            }
                            onClick={incrementUpvotes}
                          ></button>
                          <div className="-mt-[.65vh]  text-center text-sm">{post.upvotes === Number ? post.upvotes : upvotesAmount}</div>
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
                            <div className="primary-foreground cursor-pointer text-md hover:underline">
                              g/{post.subgeddit}
                            </div>
                            <div className="primary-foreground text-xs mt-1">
                              Posted by{' '}
                              <span className="cursor-pointer hover:underline text-gray-300">
                                u/{post.postedBy}
                              </span>{' '}
                              {post && post.timePosted ? post.timePosted.toString() : null}
                            </div>
                          </div>
                          <div className="primary-foreground mb-2 text-2xl mt-1">{post.title}</div>
                          {!hasImage ? (
                            <div className="whitespace-normal text-sm">{post.content}</div>
                          ) : (
                            <div
                              className="h-[60vh] w-[45vw] bg-cover bg-center bg-no-repeat object-cover"
                              style={{ backgroundImage: `url(${post.content})` }}
                            ></div>
                          )}
                          <p className="ml-1 text-xs primary-foreground mt-6">Comment As <span className="cursor-pointer hover:underline text-gray-300">{post.postedBy}</span></p>
                          <Textarea className="mt-1 border-black text-gray-200 focus:border-gray-200" placeholder="What Are Your Thoughts?"></Textarea>
                          <Button
                              className="mt-2 h-[6vh] w-full text-xl"
                          >Comment</Button>
                      </div>         
                  </div>
                  <PageInfo subgeddit={post.subgeddit} subgedditObj={subgedditData}/>        
              </div>
            ): (
              <div className="flex items-start justify-center">
                <PostPageSkeleton/>
                <PageInfoSkeleton subgeddit={post.subgeddit}/>
              </div>
            )
        )
}