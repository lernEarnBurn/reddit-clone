import { collection, query, where, getDocs, getFirestore } from 'firebase/firestore';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getDocumentIdFromField(collectionName: string, fieldName: string, fieldValue: any): Promise<string> {
    const db = getFirestore()
    const collectionRef = collection(db, collectionName);
  
    const q = query(collectionRef, where(fieldName, '==', fieldValue));
    const querySnapshot = await getDocs(q);
  
    if (!querySnapshot.empty) {
      const documentSnapshot = querySnapshot.docs[0];
      return documentSnapshot.id;
    }
  
    return "error";
  }
