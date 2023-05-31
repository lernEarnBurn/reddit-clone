import { getFirestore, collection, query, getDocs, where } from "firebase/firestore";


export async function inCollection(collectionName: string, name: string | undefined): Promise<boolean> {
    const db = getFirestore();
    const collectionRef = collection(db, collectionName);
  
    const q = query(collectionRef, where('name', '==', name));
    const querySnapshot = await getDocs(q);
  
    return !querySnapshot.empty;
  }