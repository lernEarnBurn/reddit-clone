import './App.css';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import { SearchBar } from './components/ui/searchBar';
import { useState, useEffect } from 'react';
import { Button } from './components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Loginform } from './components/loginForm';
import { CreatePost } from './components/createPost';
import { SubgedditForm } from './components/subgedditForm';
import { ContentScreen } from './components/contentScreen';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './components/ui/tooltip';

import { getAuth, signOut } from 'firebase/auth';

import { getUsersSubgeddits } from './modules/getUsersSubgeddits';


function useLogin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [DisplayLogin, setDisplayLogin] = useState(false);
  const [user, setUser] = useState('');

  const [followedSubgeddits, setFollowedSubgeddits] = useState<
    string[] | undefined
  >(undefined);

  useEffect(() => {
    async function fetchLoggedInState() {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setLoggedIn(true);
        setDisplayLogin(false);
        setUser(savedUser);
        const userFollowedSubgeddits = await getUsersSubgeddits(savedUser);
        setFollowedSubgeddits(userFollowedSubgeddits);
      }
    }

    fetchLoggedInState();
  }, []);

  return {
    loggedIn,
    setLoggedIn,
    DisplayLogin,
    setDisplayLogin,
    user,
    setUser,
    followedSubgeddits,
  };
}


function App() {
  const {
    loggedIn,
    setLoggedIn,
    DisplayLogin,
    setDisplayLogin,
    user,
    setUser,
    followedSubgeddits,
  } = useLogin();

  function logOut() {
    setUser('');
    setLoggedIn(false);
    signOut(getAuth());
    localStorage.removeItem('user');
  }

  function initiateLogIn() {
    setDisplayLogin(true);
  }

  const [createSubgeddit, setCreateSubgeddit] = useState(false);

  //all forms could use protocol and animation for if there is an incorrect input
  const [displayOptions, setDisplayOptions] = useState(false)

  function toggleDisplayOptions(){
    if(displayOptions){
      setDisplayOptions(false)
    }else{
      setDisplayOptions(true)
    }
  }

  const [lastClicked, setLastClicked] = useState<string>("Home")

  function onLinkClick(event:React.MouseEvent<HTMLAnchorElement>){
    const target = event.target as HTMLAnchorElement
    setDisplayOptions(false)
    setLastClicked(target.textContent || '')
  }


  return (
    <BrowserRouter>
      <div className="h-10vh z-6 flex w-full items-center bg-gray-800 bg-opacity-95">
        <div className="logo mr-6"></div>
        <div className='top-3 left-52 absolute'>
          <div onClick={toggleDisplayOptions} className='primary-foreground w-[14vw] bg-gray-800 p-1 hover:border hover:border-white rounded-sm text-lg text-center'>{lastClicked}</div>
          {displayOptions && (
            <div className='mt-2 bg-gray-800 rounded-sm primary-foreground flex flex-col'>
              <Link onClick={onLinkClick} className='text-lg text-center hover:bg-gray-500 hover:text-gray-900' to="/">Home</Link>
              <Link onClick={onLinkClick} className='text-lg text-center hover:bg-gray-500 hover:text-gray-900' to="/popular">Popular</Link>
              <Link onClick={onLinkClick} className='text-lg text-center hover:bg-gray-500 hover:text-gray-900' to="/create-post">Create Post</Link>
              {followedSubgeddits && 
                followedSubgeddits.map((subgeddit) => {
                  return (
                    <Link 
                      onClick={onLinkClick} 
                      className='text-lg text-center hover:bg-gray-500 hover:text-gray-900' 
                      key={subgeddit} 
                      to={`/subgeddits/${subgeddit}`}>
                      {subgeddit}
                    </Link>
                  );
                })}
            </div>
            )}
        </div>
        <SearchBar
          className="ml-60 w-[32vw] border-gray-900 font-medium text-gray-200 focus:border-gray-50"
          placeholder="Search Geddit"
        />
        <div className="ml-10 flex gap-5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                className="icon"
                style={{ backgroundImage: "url('/images/notification.svg')" }}
              ></TooltipTrigger>
              <TooltipContent>
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                className="icon"
                style={{ backgroundImage: "url('/images/message.svg')" }}
              ></TooltipTrigger>
              <TooltipContent>
                <p>Messaging</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                className="icon"
                style={{ backgroundImage: "url('/images/advertise.svg')" }}
              ></TooltipTrigger>
              <TooltipContent>
                <p>Advertise</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                onClick={() => setCreateSubgeddit(true)}
                className="icon mr-16"
                style={{ backgroundImage: "url('/images/add.svg')" }}
              ></TooltipTrigger>
              <TooltipContent>
                <p>Create Community</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {createSubgeddit && (
          <SubgedditForm setCreateSubgeddit={setCreateSubgeddit} />
        )}

        {DisplayLogin && (
          <Loginform
            setDisplayLogin={setDisplayLogin}
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
        )  : (
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
        <Route path="/" element={<ContentScreen subgeddit='Home' />} />
        <Route path="/popular" element={<ContentScreen subgeddit='Popular' />} />
        <Route
          path="/create-post"
          element={
            <CreatePost loggedIn={loggedIn} setDisplayLogin={setDisplayLogin} />
          }
        />
        {/*None of this stuff exists if you don't follow the subgeddit which at this point if you created it*/}
        {followedSubgeddits && 
          followedSubgeddits.map((subgeddit) => {
            return <Route key={subgeddit} path={`/subgeddits/${subgeddit}`} element={<ContentScreen subgeddit={subgeddit}/>}/>
        })}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
