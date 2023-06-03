import {
  collection,
  query,
  where,
  getDocs,
  getFirestore,
  DocumentData
} from 'firebase/firestore';

export async function getUsersSubgeddits(
    username: string
): Promise<string[] | undefined> {
  const db = getFirestore();
  const collectionRef = collection(db, 'users');

  const q = query(collectionRef, where('name', '==', username));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const documentSnapshot = querySnapshot.docs[0];
    const userData = documentSnapshot.data() as DocumentData;
    const following = userData.following;

    if (following !== undefined) {
      return following;
    }
  }

  return undefined;
}

