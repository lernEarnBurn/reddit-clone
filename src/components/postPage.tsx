import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { PageInfo } from "./pageInfo";

import { query, collection, getDocs, getFirestore, DocumentData, doc, DocumentReference, getDoc, where } from "firebase/firestore";

export function PostPage() {
    const {id} = useParams()

    const [post, setPost] = useState<DocumentData>({})
    const [subgedditData, setSubgedditData] = useState<DocumentData>({})

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


    useEffect(() => {
        async function getSubgedditDetails(): Promise<void>{ 
            const collectionRef = collection(getFirestore(), 'subgeddits');
            const q = query(collectionRef, where('name', '==', post.subgeddit));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
              const documentSnapshot = querySnapshot.docs[0];
              const data = documentSnapshot.data();
              setSubgedditData(data)
            }
        }

        getSubgedditDetails()
    }, [post])

    return (
            <div className="flex">
                <div>
                    
                </div>
                <PageInfo subgeddit={post.subgeddit} subgedditObj={subgedditData}/>
            </div>
        )
}