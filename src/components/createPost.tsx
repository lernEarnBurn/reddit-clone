import '../App.css'
import { useState } from 'react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';

export function CreatePost() {
  const [onTextMode, changeMode] = useState(true)

  function changePostType(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void{
    if(onTextMode === true && event.currentTarget.textContent === "Image"){
      changeMode(false)
    }else if(onTextMode === false && event.currentTarget.textContent === "Text"){
      changeMode(true)
    }
    
  }

  return <>
            <div className="bg-gray-800 w-[45vw] h-[89vh] rounded-sm mx-auto flex-col mt-2">
              <div className="h-[10vh] w-full flex">
                <button onClick={changePostType} className={`primary-foreground w-[50%] text-2xl hover:opacity-90 flex justify-center items-center ${onTextMode && 'selected'}`}>Text</button>
                <button onClick={changePostType} className={`primary-foreground w-[50%] text-2xl hover:opacity-90 flex justify-center items-center ${!onTextMode && 'selected'}`}>Image</button>
              </div>
              {onTextMode ? (
                <>
                  <Input className="mt-6 text-gray-200  border-gray-900 focus:border-gray-200" placeholder='Title'/>
                  <Textarea className='mt-2 text-gray-200 border-gray-900 focus:border-gray-200 max-h-[59vh] min-h-[20vh]' placeholder='Text(Optional)'/>
                  <Button className='mt-4 w-[42vw] h-[6vh] text-xl ml-6'>Post</Button>
                </>
              ) : (
                <>
                  <Input className="mt-6 text-gray-200  border-gray-900 focus:border-gray-200" placeholder='Title'/>
                  <input type="file" accept="image/*" onChange={() => {console.log('image added')}} />
                </>
              )}
            </div>
         </>;
}
