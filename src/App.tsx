import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './components/home';
import { Popular } from './components/popular';
import { SearchBar } from './components/ui/searchBar';
import { useState, useRef, useEffect } from 'react';
import { Button } from './components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Loginform } from './components/loginForm';
import { CreatePost } from './components/createPost';
import { SubgedditForm } from './components/subgedditForm';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./components/ui/tooltip"

import { getAuth, signOut } from 'firebase/auth';

function useLogin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showLogIn, setShowLogIn] = useState(false);
  const [user, setUser] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setLoggedIn(true);
      setShowLogIn(false);
      setUser(savedUser);
      setLoading(false);
    }
  }, []);

  return {
    loggedIn,
    setLoggedIn,
    showLogIn,
    setShowLogIn,
    user,
    setUser,
    loading,
  };
}

function useSelectNavigation() {
  const selectRef = useRef<HTMLSelectElement>(null);
  const [currentSelectValue, setSelectValue] = useState('/');

  useEffect(() => {
    const savedValue = localStorage.getItem('selectedValue');
    if (savedValue && savedValue !== currentSelectValue) {
      setSelectValue(savedValue);
      if (selectRef.current) {
        selectRef.current.value = savedValue;
      }
    }
  }, [currentSelectValue]);

  function changeRoute() {
    const selectedValue = selectRef.current?.value;
    if (selectedValue) {
      localStorage.setItem('selectedValue', selectedValue);
      window.location.href = selectedValue;

      setSelectValue(selectedValue);
    }
  }

  return {
    selectRef,
    currentSelectValue,
    changeRoute,
  };
}

function App() {
  const {
    loggedIn,
    setLoggedIn,
    showLogIn,
    setShowLogIn,
    user,
    setUser,
    loading,
  } = useLogin();
  const { selectRef, currentSelectValue, changeRoute } = useSelectNavigation();

  function logOut() {
    setUser('');
    setLoggedIn(false);
    signOut(getAuth());
    localStorage.removeItem('user');
  }

  function initiateLogIn() {
    setShowLogIn(true);
  }

  const [createSubgeddit, setCreateSubgeddit] = useState(false);

  return (
    <BrowserRouter>
      <div className="h-10vh z-6 flex w-full items-center bg-gray-800 bg-opacity-95">
        <div className="logo mr-6"></div>
        <select
          ref={selectRef}
          onChange={changeRoute}
          className="primary-foreground w-[14vw] bg-gray-800 p-1"
          value={currentSelectValue}
        >
          <option value="/">Home</option>
          <option value="/popular">Popular</option>
          <option value="/create-post">Create Post</option>
        </select>
        <SearchBar
          className="ml-10 w-[32vw] border-gray-900 font-medium text-gray-200 focus:border-gray-50"
          placeholder="Search Geddit"
        />
        <div className="ml-14 flex gap-5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className='icon' style={{backgroundImage: "url('/images/notification.svg')"}}></TooltipTrigger>
              <TooltipContent >
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className='icon' style={{backgroundImage: "url('/images/message.svg')"}}></TooltipTrigger>
              <TooltipContent >
                <p>Messaging</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className='icon' style={{backgroundImage: "url('/images/advertise.svg')"}}></TooltipTrigger>
              <TooltipContent >
                <p>Advertise</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger  onClick={() => setCreateSubgeddit(true)} className='icon mr-16' style={{backgroundImage: "url('/images/add.svg')"}}></TooltipTrigger>
              <TooltipContent >
                <p>Create Community</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {createSubgeddit && (
          <SubgedditForm setCreateSubgeddit={setCreateSubgeddit} />
        )}

        {showLogIn && (
          <Loginform
            setShowLogIn={setShowLogIn}
            setLoggedIn={setLoggedIn}
            setUser={setUser}
          />
        )}
        {!loggedIn && localStorage.getItem('user') === null ? (
          <>
            <Button size={'lg'} variant="default" onClick={initiateLogIn}>
              Log In
            </Button>
            <Avatar className="ml-8 h-[6vh] w-[4.5vw] bg-contain">
              <AvatarImage src="/images/stockAvatar.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </>
        ) : loading ? (
          /*Implement skeleton from shadcn to allow for a smother load of user */
          <div className="primary-foreground absolute right-4  flex items-start justify-center rounded-md bg-gray-900">
            <Avatar className="h-[6vh] w-[4.5vw] bg-contain ">
              <AvatarImage src="/images/stockAvatar.png" />
            </Avatar>
            <div className="flex-col">
              <p className="mt-.5 mr-4">{user}</p>
              <p
                onClick={logOut}
                className="right-30 top-5.5 absolute cursor-pointer text-xs text-gray-100 underline"
              >
                Log Out
              </p>
            </div>
          </div>
        ) : (
          <div className="primary-foreground absolute right-4  flex items-start justify-center rounded-md bg-gray-900">
            <Avatar className="h-[6vh] w-[4.5vw] bg-contain ">
              <AvatarImage src="/images/stockAvatar.png" />
            </Avatar>
            <div className="flex-col">
              <p className="mt-.5 mr-4">{user}</p>
              <p
                onClick={logOut}
                className="right-30 top-5.5 absolute cursor-pointer text-xs text-gray-100 underline"
              >
                Log Out
              </p>
            </div>
          </div>
        )}
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/popular" element={<Popular />} />
        <Route path="/create-post" element={<CreatePost />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
