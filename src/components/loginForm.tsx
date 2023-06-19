/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Input } from './ui/input';

import { Loader2 } from 'lucide-react';

import { useState, useRef } from 'react';
import type { RefObject } from 'react';

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
} from 'firebase/auth';

import { addDoc, collection, getFirestore } from 'firebase/firestore';

interface LoginProps {
  setDisplayLogin: React.Dispatch<React.SetStateAction<boolean>>;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<string | null>>;
}

export function Loginform(props: LoginProps) {
  const emailRef: RefObject<HTMLInputElement> = useRef(null);
  const passwordRef: RefObject<HTMLInputElement> = useRef(null);

  const [onSignUp, setSignUp] = useState(false);

  async function logInGoogle() {
    /*may just keep as show and not waste one of my google apps on it */
    /*Not implemented */
    const provider = new GoogleAuthProvider();
    await signInWithPopup(getAuth(), provider);
  }

  async function storeUser(email: string) {
    try {
      await addDoc(collection(getFirestore(), 'users'), {
        following: [],
        name: email,
        posts: [],
        profilePicUrl: '',
      });
    } catch (error) {
      console.error('Error writing new message to Firebase Database', error);
    }
  }

  const [loading, setLoading] = useState(false)

  async function signUp() {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    const auth = getAuth();

    if (email && password) {
      try {
        setLoading(true)
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        await storeUser(email);

        const user = userCredential.user;
        console.log(user);
        props.setLoggedIn(true);
        props.setDisplayLogin(false);
        props.setUser(String(user.email));
        localStorage.setItem('user', String(user.email));
        await setPersistence(auth, browserSessionPersistence);
        location.reload();
      } catch (error: unknown) {
        if (error instanceof Error) {
          const errorMessage = error.message;
          console.log(errorMessage);
        }
      }
      setLoading(false)
      window.location.href = '/popular'
      localStorage.setItem('last-subgeddit', 'Popular')

    }
  }

  async function logIn() {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    const auth = getAuth();

    if (email && password) {
      try {
        setLoading(true)
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        console.log(user);
        props.setLoggedIn(true);
        props.setDisplayLogin(false);
        props.setUser(String(user.email));
        localStorage.setItem('user', String(user.email));
        await setPersistence(auth, browserSessionPersistence);
        location.reload();
      } catch (error: unknown) {
        if (error instanceof Error) {
          const errorMessage = error.message;
          console.log(errorMessage);
        }
      }
      setLoading(false)
      window.location.href = '/'
      localStorage.setItem('last-subgeddit', 'Home')
    }
  }

  return (
    <div className="fixed left-0 top-0 z-10 flex h-full w-full items-center justify-center text-gray-300 bg-gray-500 bg-opacity-50">
      <div className="h-[58vh] w-[25vw] flex-col items-center rounded-lg bg-gray-800 p-6">
        <div className="flex justify-between">
          {onSignUp ? (
            <h2 className="mb-4 text-3xl font-medium">Sign Up</h2>
          ) : (
            <h2 className="mb-4 text-3xl font-medium">Login</h2>
          )}
          <button
            className="mb-12 mr-2 mt-1 px-2 py-1 rounded-sm hover:bg-red-700 text-center"
            onClick={() => {
              props.setDisplayLogin(false);
            }}
          >
            X
          </button>
        </div>
        <button
          onClick={logInGoogle}
          className="mb-8 flex w-full items-center justify-center gap-2 rounded-sm hover:bg-gray-700"
        >
          <Avatar className="mb-1 ml-8 h-[2vh] w-[1.3vw] bg-contain">
            <AvatarImage src="/images/google.webp" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <p className="mr-10 text-lg">Sign-in with Google</p>
        </button>
        <Input
          ref={emailRef}
          type="email"
          className="border-black focus:border-gray-300 mb-4"
          placeholder="Email"
        />
        <Input className='border-black focus:border-gray-300' ref={passwordRef} type="password" placeholder="Password" />
        {onSignUp ? (
          <>
            {!loading ? (
              <Button onClick={signUp} size={'lg'} className="mt-4 w-full">
                Submit
              </Button>
            ) : (
              <Button disabled size={'lg'} className="mt-4 w-full">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please Wait
              </Button>
            )}
            <div className="mt-6 flex items-center gap-2">
              <p>Already Have An Account?</p>
              <a
                onClick={() => {
                  setSignUp(false);
                }}
                className="cursor-pointer text-sm text-blue-500 underline"
              >
                Log In
              </a>
            </div>
          </>
        ) : (
          <>
            {!loading ? (
              <Button onClick={logIn} size={'lg'} className="mt-4 w-full">
                Submit
              </Button>
            ) : (
              <Button disabled size={'lg'} className="mt-4 w-full">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please Wait
              </Button>
            )}
            <div className="mt-6 flex items-center gap-2">
              <p>New to Geddit?</p>
              <a
                onClick={() => {
                  setSignUp(true);
                }}
                className="cursor-pointer text-sm text-blue-500 underline"
              >
                Sign Up
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
