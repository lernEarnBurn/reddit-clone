import { PageInfo } from './pageInfo';
import { Post } from './post';
import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { collection, getFirestore, getDocs, query, where } from 'firebase/firestore';

import { DocumentData } from 'firebase/firestore';

interface contentScreenProps {
  subgeddit: string
}


async function handleHomeContent(){
  const user = getAuth().currentUser?.displayName
  return
}

async function handlePopularContent(){
  return
}

export function ContentScreen(props: contentScreenProps) {

  const [subgedditData, setSubgedditData] = useState<DocumentData>({name: '', description: '', posts: [], followers: 0, leader: ''})

  useEffect(() => {
    async function getSubgedditData() {
      if(props.subgeddit !== "Home" && props.subgeddit !== "Popular"){
        const db = getFirestore();
        const collectionRef = collection(db, 'subgeddits');

        const q = query(collectionRef, where('name', '==', props.subgeddit));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const documentSnapshot = querySnapshot.docs[0];        
          const data = documentSnapshot.data();
          setSubgedditData(data)
        }

      }else if(props.subgeddit === "Home"){
        await handleHomeContent()
      }else if(props.subgeddit === "Popular"){
        await handlePopularContent()
      }
    }

    getSubgedditData();
  }, [props.subgeddit]);

  return (
    <div className="flex justify-center items-start">
      <div className="flex-col">
        <div className="mt-2 flex h-[8vh] w-[40vw] items-center justify-evenly rounded-sm bg-gray-800 ">
          <div className="primary-foreground flex">
            <img src="/images/add.svg"></img>
            <div>Top</div>
          </div>
          <div className="primary-foreground flex">
            <img src="/images/add.svg"></img>
            <div>New</div>
          </div>
        </div>
        <Post
          content="https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=449&q=80"
          title="making props to work for posts"
          user="lerner1737@gmail.com"
          subgeddit="AmITheAsshole"
          timeStamp="3 days ago"
          upvotes={88}
        />
        <Post
          content="https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=449&q=80"
          title="making props to work for posts"
          user="lerner1737@gmail.com"
          subgeddit="AmITheAsshole"
          timeStamp="3 days ago"
          upvotes={88}
        />
        <Post
          content="://images.unsplash.com/photo-1517423440428-a5a00ad4 93e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by 1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=449&q=80"
          title="making props to work for posts"
          user="lerner1737@gmail.com"
          subgeddit="AmITheAsshole"
          timeStamp="3 days ago"
          upvotes={88}
        />
      </div>
      <PageInfo subgeddit={props.subgeddit} subgedditObj={subgedditData} />
    </div>
  );
}
