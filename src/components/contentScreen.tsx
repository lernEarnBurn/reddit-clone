import { PageInfo } from './pageInfo';
import { Post } from './post';
import { useEffect, useState } from 'react';
import {
  collection,
  getFirestore,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from 'firebase/firestore';

import { DocumentData } from 'firebase/firestore';

import { ArrowUpSquare } from 'lucide-react';
import { CalendarDays } from 'lucide-react';

import { getUsersSubgeddits } from '../modules/getUsersSubgeddits';

interface contentScreenProps {
  subgeddit: string;
  user: string
}

//add caching to reduce speeds when refreshing pages

async function handlePopularContent() {
  return;
}

export function ContentScreen(props: contentScreenProps) {
  const [subgedditData, setSubgedditData] = useState<DocumentData>({});

  const [posts, setPosts] = useState<DocumentData[]>([]);


  //handle case if not logged in (few places around application need this as well)
  async function fetchHomePostIds(): Promise<DocumentData[]> {
    const followedSubgedditsIds = await getUsersSubgeddits(props.user)
    
    let followedPosts: DocumentData[] = []
    if(followedSubgedditsIds){
      for(const subgeddit of followedSubgedditsIds){

        const collectionRef = collection(getFirestore(), 'subgeddits');
        const q = query(collectionRef, where('name', '==', subgeddit));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const documentSnapshot = querySnapshot.docs[0];
          const data = documentSnapshot.data()
         
          followedPosts = [...followedPosts, ...data.posts]
        }
      }
    }
    return followedPosts
    
    
  }


  
  useEffect(() => {
    async function getSubgedditData(): Promise<void> {
      if (props.subgeddit !== 'Home' && props.subgeddit !== 'Popular') {
        const db = getFirestore();
        const collectionRef = collection(db, 'subgeddits');

        const q = query(collectionRef, where('name', '==', props.subgeddit));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const documentSnapshot = querySnapshot.docs[0];
          const data = documentSnapshot.data();
          setSubgedditData(data);
        }
      } else if (props.subgeddit === 'Home') {
        await fetchHomePostIds().then((postIds: DocumentData[])=>{setSubgedditData({
                                              name: 'Home',
                                              description:
                                                'This is the Home Page Where you can view posts from all of your followed subgeddits.',
                                              posts: postIds,
                                              followers: 0,
                                              leader: '',
                                            });});
        
      } else if (props.subgeddit === 'Popular') {
        await handlePopularContent();
        setSubgedditData({
          name: 'Popular',
          description:
            'This is the Popular Page Where you can view popular posts and discover new subgeddits.',
          posts: [],
          followers: 0,
          leader: '',
        });

      }
    }
    getSubgedditData();
  }, [props.subgeddit]);

  //the top and new functionality is gonna have to be implemented here
  useEffect(() => {
    setPosts([]);

    async function fetchPosts(): Promise<void> {
      const postIds = await subgedditData.posts;
      const postStorage: DocumentData[] = [];
      const db = getFirestore();
      if (postIds) {
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
        setPosts(postStorage);
      }
    }

    fetchPosts();
  }, [subgedditData]);

  return (
    <div className="flex items-start justify-center">
      <div className="flex-col">
        <div className="mt-2 flex h-[8vh] w-[40vw] items-center justify-evenly rounded-sm bg-gray-800 ">
          <div className="primary-foreground flex items-center rounded-sm px-2 py-1 hover:bg-gray-900">
            <ArrowUpSquare />
            <div className="text-xl">Top</div>
          </div>
          <div className="primary-foreground flex items-center  rounded-sm px-2 py-1 hover:bg-gray-900">
            <CalendarDays />
            <div className="text-xl">New</div>
          </div>
        </div>
        {posts.map((post, index) => {
          //this shit is running everytime i hit select
          return (
            <Post
              content={post.content}
              title={post.title}
              user={post.postedBy}
              subgeddit={post.subgeddit}
              timePosted={post.timePosted}
              upvotes={post.upvotes}
              key={index}
            />
          );
        })}
      </div>
      <PageInfo subgeddit={props.subgeddit} subgedditObj={subgedditData} />
    </div>
  );
}
