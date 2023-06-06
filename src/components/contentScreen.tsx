import { PageInfo } from './pageInfo';
import { Post } from './post';
import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { collection, getFirestore, getDocs, query, where, doc, getDoc } from 'firebase/firestore';

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

  const [subgedditData, setSubgedditData] = useState<DocumentData>({name: 'Home', 
                                                                    description: 'This is the Home Page Where you can view posts from all of your followed subgeddits.', 
                                                                    posts: [], 
                                                                    followers: 0,
                                                                    leader: ''})

  const [posts, setPosts] = useState<DocumentData[] | null>(null)
  //bug: only displays a subgeddits post if click to a different one (delayed effect)
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
        setSubgedditData({name: 'Home', 
                          description: 'This is the Home Page Where you can view posts from all of your followed subgeddits.', 
                          posts: [], 
                          followers: 0,
                          leader: ''})
      }else if(props.subgeddit === "Popular"){
        await handlePopularContent()
        setSubgedditData({name: 'Home', 
                          description: 'This is the Popular Page Where you can view popular posts and discover new subgeddits.', 
                          posts: [], 
                          followers: 0,
                          leader: ''})
      }
    }

    async function fetchPosts(postIds: string[]): Promise<void> {
      if(postIds.length > 0){

        const postStorage: DocumentData[] = []
        const db = getFirestore();
        
        for (const id of postIds) {
          const postRef = doc(db, 'posts', id); 

          try {
            const postSnapshot = await getDoc(postRef);
            if (postSnapshot.exists()) {
              postStorage.push(postSnapshot.data());
            }
          } catch (error) {
            console.error(`Error fetching document with ID ${id}:`, error);
          }
        }
        console.log(postStorage)
        setPosts(postStorage);
      }
    }
    
    setPosts(null)
    getSubgedditData().then(() => fetchPosts(subgedditData.posts))
        
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
        {posts && posts.map((post, index) => {
          return <Post 
                    content={post.content}  
                    title={post.title}
                    user={post.postedBy}
                    subgeddit={post.subgeddit}
                    timeStamp={post.timePosted}
                    upvotes={post.upvotes}
                    key={index}
                  />
        })}
       
      </div>
      <PageInfo subgeddit={props.subgeddit} subgedditObj={subgedditData} />
    </div>
  );
}
