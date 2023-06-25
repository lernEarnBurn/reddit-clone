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
  DocumentReference,
} from 'firebase/firestore';

import { DocumentData } from 'firebase/firestore';

import { v4 as uuidv4 } from 'uuid';

import { useLocation, useParams } from 'react-router-dom';

import { ArrowUpSquare } from 'lucide-react';
import { CalendarDays } from 'lucide-react';

import { PostSkeleton } from './ui/PostSkeleton';
import { PageInfoSkeleton } from './ui/PageInfoSkeleton';

import { getUsersSubgeddits } from '../modules/getUsersSubgeddits';
import { getNotUsersSubgeddits } from '../modules/getNotUsersSubgeddits';

interface contentScreenProps {
  user: string | null;
}

//add caching to reduce speeds when refreshing pages
export function ContentScreen(props: contentScreenProps) {
  const route = useLocation();
  const { subgeddit: routeSubgeddit } = useParams();
  const [subgeddit, setSubgeddit] = useState('');

  useEffect(() => {
    if (route.pathname === '/') {
      setSubgeddit('Home');
    } else if (route.pathname === '/popular') {
      setSubgeddit('Popular');
    } else {
      if (routeSubgeddit) {
        setSubgeddit(routeSubgeddit);
      }
    }
  }, [route, routeSubgeddit]);

  const [subgedditData, setSubgedditData] = useState<DocumentData>({});

  const [posts, setPosts] = useState<DocumentData[]>([]);

  async function fetchPopularPostIds(): Promise<DocumentData[] | void> {
    if (props.user) {
      const notFollowedSubgedditsIds = await getNotUsersSubgeddits(props.user);

      let notFollowedPosts: DocumentData[] = [];
      if (notFollowedSubgedditsIds) {
        for (const subgeddit of notFollowedSubgedditsIds) {
          const collectionRef = collection(getFirestore(), 'subgeddits');
          const q = query(collectionRef, where('name', '==', subgeddit));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const documentSnapshot = querySnapshot.docs[0];
            const data = documentSnapshot.data();

            notFollowedPosts = [...notFollowedPosts, ...data.posts];
          }
        }
      }
      return notFollowedPosts;
    } else {
      //insert not logged in home post algorithm here and return the array of posts
      console.log('not logged in');
    }
  }

  //handle case if not logged in (few places around application need this as well)
  async function fetchHomePostIds(): Promise<DocumentData[] | void> {
    if (props.user) {
      const followedSubgedditsIds = await getUsersSubgeddits(props.user);

      let followedPosts: DocumentData[] = [];
      if (followedSubgedditsIds) {
        for (const subgeddit of followedSubgedditsIds) {
          const collectionRef = collection(getFirestore(), 'subgeddits');
          const q = query(collectionRef, where('name', '==', subgeddit));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const documentSnapshot = querySnapshot.docs[0];
            const data = documentSnapshot.data();

            followedPosts = [...followedPosts, ...data.posts];
          }
        }
      }
      return followedPosts;
    } else {
      //insert not logged in home post algorithm here and return the array of posts
      console.log('not logged in');
    }
  }

  //also if rapidly switch it fetches the first subgeddit then the second
  const [firstEffectCompleted, setFirstEffectCompleted] =
    useState<boolean>(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getSubgedditData(): Promise<void> {
      setLoading(true);

      if (subgeddit !== 'Home' && subgeddit !== 'Popular') {
        const db = getFirestore();
        const collectionRef = collection(db, 'subgeddits');

        const q = query(collectionRef, where('name', '==', subgeddit));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const documentSnapshot = querySnapshot.docs[0];
          const data = documentSnapshot.data();
          setSubgedditData(data);
        }
      } else if (subgeddit === 'Home') {
        await fetchHomePostIds().then((postIds: DocumentData[] | void) => {
          setSubgedditData({
            name: 'Home',
            description:
              'This is the Home Page Where you can view posts from all of your followed subgeddits.',
            posts: postIds,
            followers: 0,
            leader: '',
          });
        });
      } else if (subgeddit === 'Popular') {
        await fetchPopularPostIds().then((postIds: DocumentData[] | void) => {
          setSubgedditData({
            name: 'Popular',
            description:
              'This is the Popular Page Where you can discover new communitys by seeing what everybody else likes.',
            posts: postIds,
            followers: 0,
            leader: '',
          });
        });
      }
    }
    getSubgedditData()
      .then(() => setFirstEffectCompleted(true))
      .catch((error) => {
        console.error('Error fetching subgedditData:', error);
        setFirstEffectCompleted(true);
      });
  }, [subgeddit]);

  useEffect(() => {
    if (!firstEffectCompleted || !subgedditData || !subgedditData.posts) {
      return;
    }

    setPosts([]);

    async function fetchPosts(): Promise<void> {
      const postIds = await subgedditData.posts;
      const postStorage: DocumentData[] = [];
      const db = getFirestore();
      if (postIds) {
        for (const id of postIds) {
          const postRef: DocumentReference = doc(db, 'posts', id);

          try {
            const postSnapshot = await getDoc(postRef);
            if (postSnapshot.exists()) {
              const postData = postSnapshot.data();
              const postWithId = { id: postSnapshot.id, ...postData };
              postStorage.push(postWithId);
            }
          } catch (error) {
            console.error(`Error fetching document with ID ${id}:`, error);
          }
        }

        setPosts(postStorage);
        setLoading(false);
      }
    }

    fetchPosts();
  }, [subgedditData, firstEffectCompleted]);

  //flicker when repeatedly click a sorter
  function sortByPopularity(): void {
    const postsCopy: DocumentData[] = JSON.parse(JSON.stringify(posts));

    const length: number = postsCopy.length;

    for (let i = 0; i < length - 1; i++) {
      for (let j = 0; j < length - i - 1; j++) {
        if (postsCopy[j + 1].upvotes > postsCopy[j].upvotes) {
          const temp: DocumentData = postsCopy[j + 1];
          postsCopy[j + 1] = postsCopy[j];
          postsCopy[j] = temp;
        }
      }
    }

    setPosts(postsCopy);
  }

  function sortByNew(): void {
    const postsCopy: DocumentData[] = structuredClone(posts);

    const length: number = postsCopy.length;

    for (let i = 0; i < length - 1; i++) {
      for (let j = 0; j < length - i - 1; j++) {
        // Compare adjacent elements
        if (postsCopy[j + 1].timePosted > postsCopy[j].timePosted) {
          const temp: DocumentData = postsCopy[j + 1];
          postsCopy[j + 1] = postsCopy[j];
          postsCopy[j] = temp;
        }
      }
    }
    if (posts !== postsCopy) {
      setPosts(postsCopy);
    }
  }

  return (
    <div className="flex items-start justify-center">
      <div className="flex-col">
        <div className="mt-2 flex h-[8vh] w-[40vw] items-center justify-evenly rounded-sm bg-gray-800 ">
          <div
            onClick={sortByPopularity}
            className="primary-foreground flex items-center rounded-sm px-2 py-1 hover:cursor-pointer hover:bg-gray-900"
          >
            <ArrowUpSquare />
            <div className="select-none text-xl">Top</div>
          </div>
          <div
            onClick={sortByNew}
            className="primary-foreground flex items-center rounded-sm  px-2 py-1 hover:cursor-pointer hover:bg-gray-900"
          >
            <CalendarDays />
            <div className="select-none text-xl">New</div>
          </div>
        </div>
        {!loading ? (
          posts.map((post) => {
            return (
              <Post
                content={post.content}
                title={post.title}
                user={post.postedBy}
                subgeddit={post.subgeddit}
                timePosted={post.timePosted}
                upvotes={post.upvotes}
                key={uuidv4()}
                id={post.id}
              />
            );
          })
        ) : (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        )}
      </div>
      {!loading ? (
        <PageInfo subgeddit={subgeddit} subgedditObj={subgedditData} />
      ) : (
        <PageInfoSkeleton subgeddit={subgeddit} />
      )}
    </div>
  );
}
