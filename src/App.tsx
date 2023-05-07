import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home } from './components/home'
import { Popular } from './components/popular';
import { SearchBar } from './components/ui/searchBar'
import { useState } from 'react'
import { Button } from './components/ui/button';
import { Avatar, AvatarFallback, AvatarImage  } from '@radix-ui/react-avatar';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select"



function App() {
  /*possibly set local storage to save loggin info */
  const [loggedIn, setLoggedIn] = useState(false)

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
            {/*A map function that makes an item for each subreddit */}
          </SelectContent>
        </Select>
        <SearchBar className='w-[32vw] ml-10 primary-foreground font-medium' placeholder='Search Geddit' />
        <div className='flex gap-5 ml-20'>
          <div style={{backgroundImage: "url('/images/notification.svg')"}} className='icon'></div>
          <div style={{backgroundImage: "url('/images/message.svg')"}} className='icon'></div>
          <div style={{backgroundImage: "url('/images/advertise.svg')"}} className='icon'></div>
          <div style={{backgroundImage: "url('/images/add.svg')"}} className='icon mr-16'></div>
        </div>
      {loggedIn ? (
          <div>logged in</div>
        ) : (
          <>
            <Button size={"lg"} variant="default">Log In</Button>
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
