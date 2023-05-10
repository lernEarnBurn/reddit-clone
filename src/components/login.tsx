import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage  } from '@radix-ui/react-avatar';
import { Input } from './ui/input';

import { useState } from 'react';

import {
    getAuth,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
  } from 'firebase/auth';
  
interface LoginProps {
    setShowLogIn: React.Dispatch<React.SetStateAction<boolean>>;
}


export function Login(props: LoginProps){

    const [signUp, setSignUp] = useState(false)

    async function logInGoogle() {
        /*may just keep as show and not waste one of my google apps on it */
        const provider = new GoogleAuthProvider();
        await signInWithPopup(getAuth(), provider);
      }

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-500 bg-opacity-50">
              <div className="bg-white rounded-lg p-6 h-[65vh] w-[25vw] flex-col items-center">
                <div className='flex justify-between'>
                    {signUp ? (
                        <h2 className="text-2xl font-medium mb-4">Sign Up</h2>
                    ) : (
                        <h2 className="text-2xl font-medium mb-4">Login</h2>
                    )}
                  <button className='mb-12 mr-2 p-1' onClick={() => {props.setShowLogIn(false)}}>X</button>
                </div>
                <button onClick={logInGoogle} className="flex mb-12 items-center gap-2 justify-center hover:bg-gray-100 rounded-sm w-full">
                  <Avatar className='w-[1.3vw] h-[2vh] bg-contain ml-8 mb-1'>
                    <AvatarImage src="/images/google.webp" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <p className='text-lg mr-10'>Sign-in with Google</p>
                </button>
                <Input className=' mb-4' placeholder='Email'/>
                <Input placeholder='Password'/>
                {signUp ? (
                    <> 
                        <Button size={"lg"} className='mt-4 w-full'>Submit</Button>  
                        <div className='flex mt-6 gap-2 items-center'>
                          <p>Already Have An Account?</p>
                          <a onClick={() => {setSignUp(false)}} className='text-sm cursor-pointer text-blue-500 underline'>Log In</a>
                        </div>                                                      
                    </>
                ) : (
                    <>
                        <Button size={"lg"} className='mt-4 w-full'>Submit</Button>  
                        <div className='flex mt-6 gap-2 items-center'>
                          <p>New to Geddit?</p>
                          <a onClick={() => {setSignUp(true)}} className='text-sm cursor-pointer text-blue-500 underline'>Sign Up</a>
                        </div>              
                    </>
                )}
              </div>
            </div>
    )
}