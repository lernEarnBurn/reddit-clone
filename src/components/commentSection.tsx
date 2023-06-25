import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { Textarea } from './ui/textarea';

import {
  collection,
  updateDoc,
  getFirestore,
  DocumentData,
  doc,
  getDoc,
  Firestore,
  arrayUnion,
  addDoc,
} from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';

interface CommentSectionProps {
  id: string | undefined;
  post: DocumentData;
}

export function CommentSection(props: CommentSectionProps) {
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  async function addCommentToPost(database: Firestore, commentId: string) {
    if (props.id) {
      const postRef = doc(database, 'posts', props.id);
      await updateDoc(postRef, {
        comments: arrayUnion(commentId),
      });
    }
  }

  const [commentBtnLoading, setCommentBtnLoading] = useState(false);

  async function createComment(): Promise<void> {
    if (commentInputRef.current?.value !== '') {
      setCommentBtnLoading(true);
      console.log(commentInputRef.current?.value);
      try {
        const commentRef = await addDoc(
          collection(getFirestore(), 'comments'),
          {
            postedBy: localStorage.getItem('user'),
            content: commentInputRef.current?.value,
            comments: [],
            upvotes: 0,
            level: 0,
          }
        );

        await addCommentToPost(getFirestore(), commentRef.id);
      } catch (err) {
        console.log(err);
      }

      setCommentBtnLoading(false);
      if (commentInputRef.current) {
        commentInputRef.current.value = '';
      }
    }
  }

  //make a recursive function that goes until hits base case of comments = [] then starts going up
  //on each list it will go and push comments onto comments state and have them indented with inline jsx

  const [comments, setComments] = useState<DocumentData[]>([]);
  useEffect(() => {
    const tempComments: DocumentData[] = []
    console.log('ran')
    
    async function getCommentData(commentIds: string[]): Promise<void> {
        
      for (const id of commentIds) {
        const docRef = doc(getFirestore(), 'comments', id);
        const docSnap = await getDoc(docRef);
        if(docSnap && docSnap.exists()){
            tempComments.push(docSnap.data())

            const commentComments = docSnap.data()?.comments;
    
            if(commentComments.length === 0) { 
    
                return
    
            }else{
    
                for (const comment of commentComments) {
                    const nestedCommentIds = comment.comments;
    
                    if (nestedCommentIds.length > 0) {
    
                      await getCommentData(nestedCommentIds);
    
                    }
    
                }
    
          
    
            }
                
        }
      }
    }
   
    getCommentData(props.post.comments).then(() => {console.log(comments)});
    
  }, [props.post]);

  return (
    <>
      <p className="primary-foreground ml-1 mt-6 text-xs">
        Comment As{' '}
        <span className="cursor-pointer text-gray-300 hover:underline">
          {props.post.postedBy}
        </span>
      </p>

      <Textarea
        ref={commentInputRef}
        className="mt-1 border-black text-gray-200 focus:border-gray-200"
        placeholder="What Are Your Thoughts?"
      ></Textarea>

      {!commentBtnLoading ? (
        <Button onClick={createComment} className="mt-2 h-[6vh] w-full text-xl">
          Comment
        </Button>
      ) : (
        <Button disabled className="mt-2 h-[6vh] w-full text-xl">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please Wait
        </Button>
      )}
      <hr className="primary-foreground mb-6 mt-8 border-[.08vh]" />
      <section></section>
    </>
  );
}
