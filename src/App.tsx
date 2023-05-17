import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home } from './components/home'
import { Popular } from './components/popular';
import { SearchBar } from './components/ui/searchBar'
import { useState, useRef, useEffect } from 'react'
import { Button } from './components/ui/button';
import { Avatar, AvatarFallback, AvatarImage  } from '@radix-ui/react-avatar';
import { Loginform } from './components/loginForm';

import {
  getAuth,
  signOut,
} from 'firebase/auth';

function App() {

  /*possibly set local storage to save loggin info*/
  const [loggedIn, setLoggedIn] = useState(false)

  const [showLogIn, setShowLogIn] = useState(false)

  const [user, setUser] = useState("")
  const [loading, setLoading] = useState(true)
  
  /*there is a visual bug that I need to take care of */
  useEffect(() => {
    const img = new Image();
    img.src = '/images/stockAvatar.png';
    img.onload = () => {
      const savedUser = localStorage.getItem('user');
      if(savedUser){
        setLoggedIn(true)
        setShowLogIn(false)
        setUser(savedUser)
        setLoading(false)
      }
    };

    // Clean up by removing the onload event handler
    return () => {
      img.onload = null;
    };
   
  }, [])

  const selectRef = useRef<HTMLSelectElement>(null);
  const [currentSelectValue, setSelectValue] = useState('/')
  
  function changeRoute() {
    const selectedValue = selectRef.current?.value;
    if (selectedValue) {
      localStorage.setItem("selectedValue", selectedValue);
      window.location.href = selectedValue;
      setSelectValue(selectedValue);
    }
  }

  useEffect(() => {
    const savedValue = localStorage.getItem("selectedValue");
    if (savedValue && savedValue !== currentSelectValue) {
      setSelectValue(savedValue);
      if(selectRef.current){
        selectRef.current.value = savedValue;
      }
      
    }
  }, [currentSelectValue]);

  


  function logOut(){
    setUser("")
    setLoggedIn(false)
    signOut(getAuth())
    localStorage.removeItem('user');    
  }


  function initiateLogIn(){
    setShowLogIn(true)
  }


  return (
    <BrowserRouter>
      <div className="h-10vh w-full bg-opacity-95 bg-gray-800 flex items-center">
        <div className='logo mr-6'></div>        
          <select         
            ref={selectRef} 
            onChange={changeRoute} 
            className="w-[14vw] bg-gray-800 primary-foreground"  
            value={currentSelectValue}  
            >
            <option value="/">Home</option>
            <option value="/popular">Popular</option>
            <option value="/create-subgeddit">Create Subgeddit</option>
          </select>
        <SearchBar className='w-[32vw] ml-10 primary-foreground font-medium border-gray-900 focus:border-gray-50' placeholder='Search Geddit' />
        <div className='flex gap-5 ml-14'>
          <div style={{backgroundImage: "url('/images/notification.svg')"}} className='icon'></div>
          <div style={{backgroundImage: "url('/images/message.svg')"}} className='icon'></div>
          <div style={{backgroundImage: "url('/images/advertise.svg')"}} className='icon'></div>
          <div style={{backgroundImage: "url('/images/add.svg')"}} className='icon mr-16'></div>
        </div>

        {showLogIn && (
          /*This needs to be packaged as its own component to simplify things so i'm not in a conditionally rendered disaster */
            <Loginform setShowLogIn={setShowLogIn} setLoggedIn={setLoggedIn} setUser={setUser}/>
         )}
      {!loggedIn && (localStorage.getItem('user') === null)  ? (
          <>
          <Button size={"lg"} variant="default" onClick={initiateLogIn}>Log In</Button>
          <Avatar className='w-[4.5vw] h-[6vh] bg-contain ml-8'>
            <AvatarImage src='/images/stockAvatar.png' />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </>
        ) : loading ? (
          <div className='flex items-start justify-center  primary-foreground bg-gray-900 rounded-md absolute right-4'>
            <Avatar className='w-[4.5vw] h-[6vh] bg-contain '>
              <AvatarImage src='/images/stockAvatar.png'/>
            </Avatar>
            <div className="flex-col">
              <p className='mt-.5 mr-4'>{user}</p>
            </div>
          </div>
          
          
        ) : (
            <div className='flex items-start justify-center  primary-foreground bg-gray-900 rounded-md absolute right-4'>
            <Avatar className='w-[4.5vw] h-[6vh] bg-contain '>
              <AvatarImage src='/images/stockAvatar.png' />
            </Avatar>
            <div className="flex-col">
              <p className='mt-.5 mr-4'>{user}</p>
              <p onClick={logOut} className='text-xs cursor-pointer text-gray-100 underline absolute right-30 top-5.5'>Log Out</p>
            </div>
          </div>
        )}
      </div>
      <Routes> 
        <Route path="/" element={<Home/>}/>
        <Route path="/popular" element={<Popular/>}/>
      </Routes>
    </BrowserRouter>
  )
}



/*gonna add create-geddit route as well as post route */

export default App
