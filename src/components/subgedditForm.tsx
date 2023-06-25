import { Input } from './ui/input';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

import { Loader2 } from 'lucide-react';

import { useRef, useState } from 'react';

import {
  addDoc,
  collection,
  getFirestore,
  updateDoc,
  arrayUnion,
  doc,
} from 'firebase/firestore';

import { getDocumentIdFromField } from '../modules/getIdFromField';

interface SubgedditFormProps {
  setCreateSubgeddit: React.Dispatch<React.SetStateAction<boolean>>;
}

export function SubgedditForm(props: SubgedditFormProps) {
  const nameRef = useRef<HTMLInputElement>(null);
  const descriptRef = useRef<HTMLTextAreaElement>(null);

  const [loading, setLoading] = useState(false);

  async function createCommunity() {
    try {
      //do a loading circle on button
      setLoading(true);
      await addDoc(collection(getFirestore(), 'subgeddits'), {
        name: nameRef.current?.value,
        description: descriptRef.current?.value,
        leader: localStorage.getItem('user'),
        followers: 1,
        posts: [],
      });
      //now add this to leaders (users) subgeddits

      const db = getFirestore();

      const userId = await getDocumentIdFromField(
        'users',
        'name',
        localStorage.getItem('user')
      );
      const userRef = doc(db, 'users', userId);

      await updateDoc(userRef, {
        following: arrayUnion(nameRef.current?.value),
      });
      location.reload();
    } catch (error) {
      console.error('Error writing new message to Firebase Database', error);
    }
    setLoading(false);
    props.setCreateSubgeddit(false);
  }

  /*Needs a loading animation when creating a subgeddit */

  return (
    <>
      <div className="fixed left-0 top-0 z-10 flex h-full w-full items-center justify-center bg-gray-500 bg-opacity-50 text-gray-300">
        <div className="h-[58vh] w-[25vw] items-center rounded-lg bg-gray-800 p-6">
          <div className="flex items-center justify-center gap-10">
            <h1 className="text-2xl">Create A Community</h1>
            <button
              className="ml-8 rounded-sm px-1 hover:bg-red-700"
              onClick={() => {
                props.setCreateSubgeddit(false);
              }}
            >
              X
            </button>
          </div>
          <div className="flex-col">
            <Input
              ref={nameRef}
              className="mb-2 mt-14 border-black focus:border-gray-300"
              placeholder="Name"
            ></Input>
            <Textarea
              ref={descriptRef}
              className="mb-2 max-h-[35vh] min-h-[20vh] border-black focus:border-gray-300"
              placeholder="Description"
            />
            {!loading ? (
              <Button onClick={createCommunity} className="w-full">
                Create
              </Button>
            ) : (
              <Button disabled onClick={createCommunity} className="w-full">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please Wait
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
