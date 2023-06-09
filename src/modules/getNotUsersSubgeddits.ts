import {
  collection,
  query,
  where,
  getDocs,
  getFirestore,
  DocumentData,
  QuerySnapshot,
} from 'firebase/firestore';

export async function getNotUsersSubgeddits(
  username: string
): Promise<string[] | undefined> {
  const db = getFirestore();
  const usersCollectionRef = collection(db, 'users');

  const q = query(usersCollectionRef, where('name', '==', username));
  const querySnapshot = await getDocs(q);

  

  if (!querySnapshot.empty) {
    const documentSnapshot = querySnapshot.docs[0];
    const userData = documentSnapshot.data() as DocumentData;
    const subgedditsFollowing = userData.following;

    const collectionRef = collection(db, 'subgeddits');

    const notFollowing: string[] = [];

    try {
        const querySnapshot = await getDocs(collectionRef);
  
        querySnapshot.forEach((doc) => {
          const subgeddit = doc.data();
          if (!subgedditsFollowing.includes(subgeddit.name)) {
            notFollowing.push(subgeddit.name);
          }
        });
  
        return notFollowing;
      } catch (error) {
        console.log('Error getting documents: ', error);
        return undefined;
      }
    }
  }
  
  
  
  
  
  
  
  
