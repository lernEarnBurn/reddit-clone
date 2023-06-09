import './App.css';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import SearchBar from './components/searchBar';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from './components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Loginform } from './components/loginForm';
import { CreatePost } from './components/createPost';
import { SubgedditForm } from './components/subgedditForm';
import { ContentScreen } from './components/contentScreen';
import { PostPage } from './components/postPage';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './components/ui/tooltip';

import { getAuth, signOut } from 'firebase/auth';

import { getUsersSubgeddits } from './modules/getUsersSubgeddits';

import { motion } from 'framer-motion';

function useLogin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [DisplayLogin, setDisplayLogin] = useState(false);
  //when not logged in maybe set localStorage user to something that will let app know its not logged in
  const [user, setUser] = useState(localStorage.getItem('user'));

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
  }, [user]);

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
    location.reload();
  }

  function displayLogInForm() {
    setDisplayLogin(true);
  }

  const [createSubgeddit, setCreateSubgeddit] = useState(false);

  //all forms could use protocol and animation for if there is an incorrect input
  const [displayOptions, setDisplayOptions] = useState(false);

  const toggleDisplayOptions = useCallback(() => {
    setDisplayOptions((prevDisplayOptions) => !prevDisplayOptions);
  }, []);

  const onLinkClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      const target = event.target as HTMLAnchorElement;

      setDisplayOptions(false);

      localStorage.setItem('last-subgeddit', target.textContent || '');
    },
    []
  );

  const imageUploaderRef = useRef<HTMLInputElement>(null);
  const [currentImage, setCurrentImage] = useState('');

  function saveProfilePic(): void {
    if (imageUploaderRef.current?.files) {
      const file = imageUploaderRef.current.files[0];
      const reader = new FileReader();
      console.log('done');
      reader.onload = (e) => {
        setCurrentImage(`${e.target?.result}`);
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <BrowserRouter>
      <nav className="h-10vh z-6 flex w-full items-center bg-gray-800 bg-opacity-95">
        <Link to="/">
          <div className="logo mr-6"></div>
        </Link>
        <div className="z-999 absolute left-52 top-3">
          <div
            onClick={toggleDisplayOptions}
            className="primary-foreground w-[14vw] cursor-pointer select-none rounded-sm bg-gray-800 p-1 text-center text-lg hover:border hover:border-white"
          >
            {/*use localStorage to get current page */}
            {localStorage.getItem('last-subgeddit')
              ? localStorage.getItem('last-subgeddit')
              : 'Home'}
          </div>
          {displayOptions && (
            <motion.div
              animate={{ y: 15 }}
              transition={{ delay: 0 }}
              className="primary-foreground z-10 flex flex-col rounded-sm bg-gray-800 "
            >
              <Link
                onClick={onLinkClick}
                className="z-10 text-center text-lg hover:bg-gray-500 hover:text-gray-900"
                to="/"
              >
                Home
              </Link>
              <Link
                onClick={onLinkClick}
                className="z-10 text-center text-lg hover:bg-gray-500 hover:text-gray-900"
                to="/popular"
              >
                Popular
              </Link>
              <Link
                onClick={onLinkClick}
                className="z-10 text-center text-lg hover:bg-gray-500 hover:text-gray-900"
                to="/create-post"
              >
                Create Post
              </Link>
              {followedSubgeddits &&
                followedSubgeddits.map((subgeddit) => {
                  return (
                    <Link
                      onClick={onLinkClick}
                      className="z-10 text-center text-lg hover:bg-gray-500 hover:text-gray-900"
                      key={subgeddit}
                      to={`/subgeddits/${subgeddit}`}
                    >
                      {subgeddit}
                    </Link>
                  );
                })}
            </motion.div>
          )}
        </div>
        <SearchBar />
        <div className="ml-10 flex gap-5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger
                rel="preload"
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
                rel="preload"
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
                rel="preload"
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
                rel="preload"
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
            <Button size={'lg'} variant="default" onClick={displayLogInForm}>
              Log In
            </Button>
            <Avatar className="ml-8 h-[6vh] w-[4.5vw] bg-contain">
              <AvatarImage src="/images/stockAvatar.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </>
        ) : (
          <div className="primary-foreground absolute right-4 flex max-w-[19vw] items-start justify-center overflow-hidden rounded-md bg-gray-900">
            <Avatar
              onClick={() => {
                imageUploaderRef.current?.click();
              }}
              className="h-[6vh] w-[4.5vw] min-w-[4.5vw]  rounded-l-md hover:border hover:border-blue-300"
            >
              <AvatarImage src={'/images/stockAvatar.png'} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <input
              onChange={saveProfilePic}
              ref={imageUploaderRef}
              className="hidden"
              type="file"
              accept="image/*"
            />
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
      </nav>
      <Routes>
        <Route path="/" element={<ContentScreen user={user} />} />
        <Route path="/popular" element={<ContentScreen user={user} />} />
        <Route
          path="/create-post"
          element={
            <CreatePost loggedIn={loggedIn} setDisplayLogin={setDisplayLogin} />
          }
        />
        <Route path="/subgeddits/:subgeddit/posts/:id" element={<PostPage />} />
        <Route
          path="/subgeddits/:subgeddit"
          element={<ContentScreen user={user} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
