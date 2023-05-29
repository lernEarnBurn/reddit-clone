import '../App.css'
import { useState, useRef } from 'react';
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

  const imageUploaderRef = useRef<HTMLInputElement>(null)
  const [currentImage, setCurrentImage] = useState("")

  function displaySelectedImage(): void{
    if(imageUploaderRef.current?.files){
        const file = imageUploaderRef.current.files[0]
        const reader = new FileReader();
        console.log('done')
        reader.onload = (e) => {
          setCurrentImage(`url(${e.target?.result})`)
        }
        reader.readAsDataURL(file);
      
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
                  <Input className="mt-6 text-gray-200  border-gray-900 focus:border-gray-200 text-md h-[7vh]" placeholder='Title'/>
                  <Textarea className=' text-gray-200 border-gray-900 focus:border-gray-200 max-h-[58vh] min-h-[58vh] text-md' placeholder='Text(Optional)'/>
                  <Button className='mt-4 w-[42vw] h-[6vh] text-xl ml-6'>Post</Button>
                </>
              ) : (
                <>
                  <Input className="mt-6 text-gray-200  border-gray-900 focus:border-gray-200 h-[7vh] text-md" placeholder='Title'/>
                  <button style={{backgroundImage: currentImage}} onClick={() => {imageUploaderRef.current?.click();}} className={`w-full h-[58vh] border border-gray-900 focus:border-gray-200 rounded-sm text-lg text-gray-500 bg-center bg-no-repeat bg-cover ${currentImage === "" ? "text-opacity-100" : "text-opacity-0"}`}>Click To Upload Image</button>
                  <input onChange={displaySelectedImage} ref={imageUploaderRef} className='hidden' type="file" accept="image/*" />
                  <Button className='mt-4 w-[42vw] h-[6vh] text-xl ml-6'>Post</Button>

                </>
              )}
            </div>
         </>;
}
