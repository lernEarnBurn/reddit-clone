import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getFirestore, DocumentData, doc, DocumentReference, getDoc } from "firebase/firestore";

export function PostPage() {
    const {id} = useParams()

    const [post, setPost] = useState<DocumentData>({})

    useEffect(() => {
        async function getPostDetails(): Promise<void>{
            
            const db = getFirestore()
            if(id){
                const postRef: DocumentReference = doc(db, 'posts', id);
                
                const postSnapshot = await getDoc(postRef);
                if (postSnapshot.exists()) {
                  const postData = postSnapshot.data();
                  setPost(postData)  
                }
            }
        }
        
        getPostDetails()
        
    }, [id])

    return (
        <div className="text-green-500">{JSON.stringify(post)}</div>
    )
}