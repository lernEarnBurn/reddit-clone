import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

import { useState, useRef, useEffect } from "react";
import { CSSProperties } from "react";

import {  
    updateDoc,
  
    getFirestore,
  
    DocumentData,
  
    doc,
    arrayUnion,
    increment,
    collection,
    addDoc
  
  } from 'firebase/firestore';
  
import { getDocumentIdFromField } from "../modules/getIdFromField";

import { MessageSquare } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

interface CommentProps {
    comment: DocumentData;
    style?: CSSProperties;
}

export function Comment(props: CommentProps){

  
    

  const [upvotesAmount, setUpvotesAmount] = useState<number>(props.comment.upvotes);
  const [alreadyIncremented, setAlreadyIncremented] = useState(false);
  const [alreadyDecremented, setAlreadyDecremented] = useState(false);

  async function incrementUpvotes(): Promise<void> {
    if (!alreadyIncremented) {
      const commentId = await getDocumentIdFromField(
        'comments',
        'id',
        props.comment.id
      );
      if (alreadyDecremented) {
        try {
          const commentRef = doc(getFirestore(), 'comments', commentId);
          updateDoc(commentRef, {
            upvotes: increment(2),
          });

          setUpvotesAmount(upvotesAmount + 2);
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          const commentRef = doc(getFirestore(), 'comments', commentId);
          updateDoc(commentRef, {
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
      const commentId = await getDocumentIdFromField(
        'comments',
        'id',
        props.comment.id
      );

      if (alreadyIncremented) {
        try {
          const commentRef = doc(getFirestore(), 'comments', commentId);
          updateDoc(commentRef, {
            upvotes: increment(-2),
          });

          setUpvotesAmount(upvotesAmount - 2);
        } catch (error) {
          console.log(error);
        }
      } else {
        try {
          const commentRef = doc(getFirestore(), 'comments', commentId);
          updateDoc(commentRef, {
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

  const [displayReply, setDisplayReply] = useState(false)
  function toggleReply(){
    if(displayReply){
        setDisplayReply(false)
    }else{
        setDisplayReply(true)
    }
  }

  async function addCommentToComment(newCommentId: string): Promise<void>{
    if(newCommentId){
        const db = getFirestore()
        const commentRef = doc(db, "comments", props.comment.id);
        await updateDoc(commentRef, {
          comments: arrayUnion(newCommentId)
        });


    }
  }

  const replyInputRef = useRef<HTMLTextAreaElement>(null)
  const [commentBtnLoading, setCommentBtnLoading] = useState(false)
  async function reply(): Promise<void>{

    if (replyInputRef.current?.value !== '') {
        setCommentBtnLoading(true);
        try {
          const commentRef = await addDoc(
            collection(getFirestore(), 'comments'),
            {
              postedBy: localStorage.getItem('user'),
              content: replyInputRef.current?.value,
              comments: [],
              upvotes: 0,
              level: Number(props.comment.level) + 1 ,
            }
          );
  
          await addCommentToComment(commentRef.id);
        } catch (err) {
          console.log(err);
        }
  
        setCommentBtnLoading(false);
        if (replyInputRef.current) {
          replyInputRef.current.value = '';
        }
      }
  }

  function buttonWithLoading(){
    if(commentBtnLoading){
        return (
            <Button disabled className="ml-[2.8vw] mt-1 w-[38vw]">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Please Wait
            </Button>
        )
    }else{
        return (
            <Button onClick={reply} className="ml-[2.8vw] mt-1 w-[38vw]">
                Reply
            </Button>
        )
    }
  }

  //indenting not working and neither is the commenting on order
    return (
        <div className={`my-8`}>
            <div className='flex items-center gap-3'>    
                <Avatar className='h-8 w-8'>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className='text-xs primary-foreground'>{props.comment.postedBy}</h1>
            </div>
            <p className='ml-[2.8vw] mt-1'>{props.comment.content}</p>
            <nav className="flex items-center">
                <div className="flex items-center gap-2 ml-[2.8vw] mt-2">
                    <button
                      className={
                        alreadyIncremented
                          ? 'clicked-up h-[3.5vh] w-[1vw] bg-cover  bg-center hover:bg-gray-700 rounded-sm'
                          : 'up h-[3.5vh] w-[1vw] bg-cover  bg-center hover:bg-gray-700 rounded-sm'
                      }
                      onClick={incrementUpvotes}
                    ></button>
                    <div className="text-center text-sm">
                      {props.comment.upvotes === Number ? props.comment.upvotes : upvotesAmount}
                    </div>
                    <button
                      className={
                        alreadyDecremented
                          ? 'clicked-down h-[3.5vh] w-[1vw] bg-cover  bg-center hover:bg-gray-700 rounded-sm'
                          : 'down h-[3.5vh] w-[1vw] bg-cover  bg-center hover:bg-gray-700 rounded-sm'
                      }
                      onClick={decrementUpvotes}
                    ></button>
                </div>
                <button onClick={toggleReply} className="ml-6 flex mt-2 text-sm hover:bg-gray-700 rounded-sm items-center">
                    <MessageSquare className="mr-1 h-[4vh] w-[1.2vw]" color="#f8f7f7" />
                    Reply
                </button>
            </nav>
            {displayReply ? (
                <>
                    <Textarea
                      ref={replyInputRef}
                      className="mt-4 ml-[2.8vw] border-black text-gray-200 focus:border-gray-200 w-[38vw]"
                      placeholder="What Are Your Thoughts?"
                    ></Textarea>
                    
                    {buttonWithLoading()}
                   
                </>
            ) : (
                null
            )}
        </div>
    )
}