/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Input } from './ui/input';

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

interface LoginProps {
  setShowLogIn: React.Dispatch<React.SetStateAction<boolean>>;
  setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<string>>;
}

export function Loginform(props: LoginProps) {
  const emailRef: RefObject<HTMLInputElement> = useRef(null);
  const passwordRef: RefObject<HTMLInputElement> = useRef(null);

  const [onSignUp, setSignUp] = useState(false);

  async function logInGoogle() {
    /*may just keep as show and not waste one of my google apps on it */
    const provider = new GoogleAuthProvider();
    await signInWithPopup(getAuth(), provider);
  }

  async function signUp() {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    const auth = getAuth();

    if (email && password) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        console.log(user);
        props.setLoggedIn(true);
        props.setShowLogIn(false);
        props.setUser(String(user.email));
        localStorage.setItem('user', String(user.email));
        await setPersistence(auth, browserSessionPersistence);
      } catch (error: unknown) {
        if (error instanceof Error) {
          const errorMessage = error.message;
          console.log(errorMessage);
        }
      }
    }
  }

  async function logIn() {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    const auth = getAuth();

    if (email && password) {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        console.log(user);
        props.setLoggedIn(true);
        props.setShowLogIn(false);
        props.setUser(String(user.email));
        localStorage.setItem('user', String(user.email));
        await setPersistence(auth, browserSessionPersistence);
      } catch (error: unknown) {
        if (error instanceof Error) {
          const errorMessage = error.message;
          console.log(errorMessage);
        }
      }
    }
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-500 bg-opacity-50">
      <div className="bg-white rounded-lg p-6 h-[65vh] w-[25vw] flex-col items-center">
        <div className="flex justify-between">
          {onSignUp ? (
            <h2 className="text-3xl font-medium mb-4">Sign Up</h2>
          ) : (
            <h2 className="text-3xl font-medium mb-4">Login</h2>
          )}
          <button
            className="mb-12 mr-2 p-1"
            onClick={() => {
              props.setShowLogIn(false);
            }}
          >
            X
          </button>
        </div>
        <button
          onClick={logInGoogle}
          className="flex mb-12 items-center gap-2 justify-center hover:bg-gray-100 rounded-sm w-full"
        >
          <Avatar className="w-[1.3vw] h-[2vh] bg-contain ml-8 mb-1">
            <AvatarImage src="/images/google.webp" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <p className="text-lg mr-10">Sign-in with Google</p>
        </button>
        <Input
          ref={emailRef}
          type="email"
          className=" mb-4"
          placeholder="Email"
        />
        <Input ref={passwordRef} type="password" placeholder="Password" />
        {onSignUp ? (
          <>
            <Button onClick={signUp} size={'lg'} className="mt-4 w-full">
              Submit
            </Button>
            <div className="flex mt-6 gap-2 items-center">
              <p>Already Have An Account?</p>
              <a
                onClick={() => {
                  setSignUp(false);
                }}
                className="text-sm cursor-pointer text-blue-500 underline"
              >
                Log In
              </a>
            </div>
          </>
        ) : (
          <>
            <Button onClick={logIn} size={'lg'} className="mt-4 w-full">
              Submit
            </Button>
            <div className="flex mt-6 gap-2 items-center">
              <p>New to Geddit?</p>
              <a
                onClick={() => {
                  setSignUp(true);
                }}
                className="text-sm cursor-pointer text-blue-500 underline"
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
