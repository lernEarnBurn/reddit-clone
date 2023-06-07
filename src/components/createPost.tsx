import '../App.css';
import { useState, useRef } from 'react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';

import {
  addDoc,
  updateDoc,
  collection,
  getFirestore,
  doc,
  arrayUnion,
  Firestore,
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from 'firebase/storage';

import { getDocumentIdFromField } from '../modules/getIdFromField';
import { inCollection } from '../modules/inCollection';

interface CreatePostProps {
  loggedIn: boolean;
  setDisplayLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CreatePost(props: CreatePostProps) {
  const [onTextMode, changeMode] = useState(true);

  function changePostType(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    if (onTextMode === true && event.currentTarget.textContent === 'Image') {
      changeMode(false);
    } else if (
      onTextMode === false &&
      event.currentTarget.textContent === 'Text'
    ) {
      changeMode(true);
    }
  }

  const imageUploaderRef = useRef<HTMLInputElement>(null);
  const [currentImage, setCurrentImage] = useState('');

  function displaySelectedImage(): void {
    if (imageUploaderRef.current?.files) {
      const file = imageUploaderRef.current.files[0];
      const reader = new FileReader();
      console.log('done');
      reader.onload = (e) => {
        setCurrentImage(`url(${e.target?.result})`);
      };
      reader.readAsDataURL(file);
    }
  }

  const titleInputRef = useRef<HTMLInputElement>(null);
  const subgedditInputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  function clearInputs(text: boolean) {
    if (
      text &&
      titleInputRef.current &&
      subgedditInputRef.current &&
      contentRef.current
    ) {
      titleInputRef.current.value = '';
      subgedditInputRef.current.value = '';
      contentRef.current.value = '';
      //display something showing that it was posted
    } else if (
      !text &&
      titleInputRef.current &&
      subgedditInputRef.current &&
      imageUploaderRef.current
    ) {
      titleInputRef.current.value = '';
      subgedditInputRef.current.value = '';
      imageUploaderRef.current.value = '';
      setCurrentImage('');
      //display something showing that it was posted
    }
  }

  async function addPostToUser(database: Firestore, postId: string) {
    const userId = await getDocumentIdFromField(
      'users',
      'name',
      localStorage.getItem('user')
    );
    const userRef = doc(database, 'users', userId);

    await updateDoc(userRef, {
      posts: arrayUnion(postId),
    });
  }

  async function addPostToSubgeddit(database: Firestore, postId: string) {
    const subgedditId = await getDocumentIdFromField(
      'subgeddits',
      'name',
      subgedditInputRef.current?.value
    );
    const subgedditRef = doc(database, 'subgeddits', subgedditId);

    await updateDoc(subgedditRef, {
      posts: arrayUnion(postId),
    });
  }

  async function createPost(text: boolean) {
    if (await inCollection('subgeddits', subgedditInputRef.current?.value)) {
      try {
        const postRef = await addDoc(collection(getFirestore(), 'posts'), {
          comments: [],
          content: '',
          postedBy: localStorage.getItem('user'),
          subgeddit: subgedditInputRef.current?.value,
          timePosted: Date.now(),
          title: titleInputRef.current?.value,
          upvotes: 0,
        });

        if (text) {
          await updateDoc(postRef, {
            content: contentRef.current?.value,
            storageUri: null,
          });
        } else if (!text && imageUploaderRef.current?.files) {
          const filePath = `${localStorage.getItem('user')}/${postRef.id}/${
            imageUploaderRef.current?.files[0].name
          }`;
          const newImageRef = ref(getStorage(), filePath);
          const fileSnapshot = await uploadBytesResumable(
            newImageRef,
            imageUploaderRef.current?.files[0]
          );

          const publicImageUrl = await getDownloadURL(newImageRef);

          await updateDoc(postRef, {
            content: publicImageUrl,
            storageUri: fileSnapshot.metadata.fullPath,
          });
        }

        const db = getFirestore();

        await addPostToUser(db, postRef.id);
        await addPostToSubgeddit(db, postRef.id);

        clearInputs(text);

        //placeholder for a nicer alert
        alert('Post Created');
      } catch (error) {
        alert(error);
        console.error('Error writing new message to Firebase Database', error);
      }

      location.reload();
    } else {
      if (subgedditInputRef.current) {
        subgedditInputRef.current.style.borderColor = 'red';
        setTimeout(() => {
          if (subgedditInputRef.current) {
            subgedditInputRef.current.style.borderColor = 'black';
          }
        }, 1000);
      }
    }
  }

  return (
    <>
      <div className="mx-auto mt-2 h-[89vh] w-[45vw] flex-col rounded-sm bg-gray-800">
        <div className="flex h-[10vh] w-full">
          <button
            onClick={changePostType}
            className={`primary-foreground flex w-[50%] items-center justify-center text-2xl hover:opacity-90 ${
              onTextMode && 'selected'
            }`}
          >
            Text
          </button>
          <button
            onClick={changePostType}
            className={`primary-foreground flex w-[50%] items-center justify-center text-2xl hover:opacity-90 ${
              !onTextMode && 'selected'
            }`}
          >
            Image
          </button>
        </div>
        {onTextMode ? (
          <>
            <Input
              className="text-md mt-6  h-[7vh] border-gray-900 text-gray-200 focus:border-gray-200"
              placeholder="Subgeddit"
              ref={subgedditInputRef}
            />
            <Input
              className=" text-md  h-[7vh] border-gray-900 text-gray-200 focus:border-gray-200"
              placeholder="Title"
              ref={titleInputRef}
            />
            <Textarea
              className=" text-md max-h-[52vh] min-h-[52vh] border-gray-900 text-gray-200 focus:border-gray-200"
              placeholder="Text(Optional)"
              ref={contentRef}
            />
            {props.loggedIn ? (
              <Button
                className="ml-6 mt-4 h-[6vh] w-[42vw] text-xl"
                onClick={() => createPost(true)}
              >
                Post
              </Button>
            ) : (
              <Button
                className="ml-6 mt-4 h-[6vh] w-[42vw] text-xl"
                onClick={() => {
                  props.setDisplayLogin(true);
                }}
              >
                Post
              </Button>
            )}
          </>
        ) : (
          <>
            <Input
              className="text-md mt-6  h-[7vh] border-gray-900 text-gray-200 focus:border-gray-200"
              placeholder="Subgeddit"
              ref={subgedditInputRef}
            />
            <Input
              className=" text-md  h-[7vh] border-gray-900 text-gray-200 focus:border-gray-200"
              placeholder="Title"
              ref={titleInputRef}
            />
            <button
              style={{ backgroundImage: currentImage }}
              onClick={() => {
                imageUploaderRef.current?.click();
              }}
              className={`h-[52vh] w-full rounded-sm border border-gray-900 bg-cover bg-center bg-no-repeat text-lg text-gray-500 focus:border-gray-200 ${
                currentImage === '' ? 'text-opacity-100' : 'text-opacity-0'
              }`}
            >
              Click To Upload Image
            </button>
            <input
              onChange={displaySelectedImage}
              ref={imageUploaderRef}
              className="hidden"
              type="file"
              accept="image/*"
            />
            {props.loggedIn ? (
              <Button
                className="ml-6 mt-4 h-[6vh] w-[42vw] text-xl"
                onClick={() => createPost(false)}
              >
                Post
              </Button>
            ) : (
              <Button
                className="ml-6 mt-4 h-[6vh] w-[42vw] text-xl"
                onClick={() => {
                  props.setDisplayLogin(true);
                }}
              >
                Post
              </Button>
            )}
          </>
        )}
      </div>
    </>
  );
}
