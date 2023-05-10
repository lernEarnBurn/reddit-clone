import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home } from './components/home'
import { Popular } from './components/popular';
import { SearchBar } from './components/ui/searchBar'
import { useState } from 'react'
import { Button } from './components/ui/button';
import { Avatar, AvatarFallback, AvatarImage  } from '@radix-ui/react-avatar';
import { Input } from './components/ui/input';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select"

import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

function App() {
  /*possibly set local storage to save loggin info */
  const [loggedIn, setLoggedIn] = useState(false)
  const [showLogIn, setShowLogIn] = useState(false)

  async function logInGoogle() {
    /*may just keep as show and not waste one of my google apps on it */
    const provider = new GoogleAuthProvider();
    await signInWithPopup(getAuth(), provider);
  }
  
  /*gonna have a log out button that drops down from profile in top right corner */
  function signOutUser() {
    signOut(getAuth());
  }

  function logIn(){
    setShowLogIn(true)
  }

  return (
    <BrowserRouter>
      <div className="h-10vh w-full bg-opacity-95 bg-gray-800 flex items-center">
        <div className='logo mr-6'></div>
        <Select>
          <SelectTrigger className="w-[14vw] bg-gray-800 primary-foreground">
            <SelectValue placeholder="Page" />
          </SelectTrigger>
          <SelectContent className=' bg-gray-800 primary-foreground'>
            <SelectItem value="home">Home</SelectItem>
            <SelectItem value="popular">Popular</SelectItem>
            <SelectItem value="create-subreddit">Create Subgeddit</SelectItem>
            {/*A map function that makes an item for each subreddit */}
          </SelectContent>
        </Select>
        <SearchBar className='w-[32vw] ml-10 primary-foreground font-medium border-gray-900 focus:border-gray-50' placeholder='Search Geddit' />
        <div className='flex gap-5 ml-20'>
          <div style={{backgroundImage: "url('/images/notification.svg')"}} className='icon'></div>
          <div style={{backgroundImage: "url('/images/message.svg')"}} className='icon'></div>
          <div style={{backgroundImage: "url('/images/advertise.svg')"}} className='icon'></div>
          <div style={{backgroundImage: "url('/images/add.svg')"}} className='icon mr-16'></div>
        </div>

        {showLogIn && (
          /*This needs to be packaged as its own component to simplify things so i'm not in a conditionally rendered disaster */
            <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-500 bg-opacity-50">
              <div className="bg-white rounded-lg p-6 h-[65vh] w-[25vw] flex-col items-center">
                <div className='flex justify-between'>
                  <h2 className="text-2xl font-medium mb-4">Login</h2>
                  <button className='mb-12 mr-2 p-1' onClick={() => {setShowLogIn(false)}}>X</button>
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
                <Button size={"lg"} className='mt-4 w-full'>Submit</Button>  
                <div className='flex mt-6 gap-2 items-center'>
                  <p>New to Geddit?</p>
                  <a onClick={signUp} className='text-sm cursor-pointer text-blue-500 underline'>Sign Up</a>
                </div>              
              </div>
            </div>
         )}
      {loggedIn ? (
          <div>logged in</div>
        ) : (
          <>
            <Button size={"lg"} variant="default" onClick={logIn}>Log In</Button>
            <Avatar className='w-[4.5vw] h-[6vh] bg-contain ml-8'>
              <AvatarImage src="/images/stockAvatar.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </>
        )}
      </div>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/popular" element={<Popular/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
