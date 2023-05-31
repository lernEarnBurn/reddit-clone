import { Input } from './ui/input';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

import { useRef } from 'react';

import { addDoc, collection, getFirestore } from 'firebase/firestore';

interface SubgedditFormProps {
  setCreateSubgeddit: React.Dispatch<React.SetStateAction<boolean>>;
}

export function SubgedditForm(props: SubgedditFormProps) {
  const nameRef = useRef<HTMLInputElement>(null);
  const descriptRef = useRef<HTMLTextAreaElement>(null);

  async function createCommunity() {
    try {
      await addDoc(collection(getFirestore(), 'subgeddits'), {
        name: nameRef.current?.value,
        description: descriptRef.current?.value,
        leader: localStorage.getItem('user'),
        followers: 1,
        posts: [],
      });
      //now add this to leaders (users) subgeddits
    } catch (error) {
      console.error('Error writing new message to Firebase Database', error);
    }
    props.setCreateSubgeddit(false);
  }

  return (
    <>
      <div className="fixed left-0 top-0 z-10 flex h-full w-full items-center justify-center bg-gray-500 bg-opacity-50">
        <div className="h-[65vh] w-[25vw] items-center rounded-lg bg-gray-300 p-6">
          <div className="flex items-center justify-center gap-10">
            <h1 className="text-2xl">Create A Community</h1>
            <button
              className="ml-8"
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
              className="mb-2 mt-14"
              placeholder="Name"
            ></Input>
            <Textarea
              ref={descriptRef}
              className="mb-2 max-h-[35vh] min-h-[20vh]"
              placeholder="Description"
            />
            <Button onClick={createCommunity} className="w-full">
              Create
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
