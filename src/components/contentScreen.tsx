import { Post } from "./post";

export function ContentScreen() {
  return (
    <>
      <div className="bg-gray-700 h-auto min-h-[91vh] w-screen absolute flex justify-center">
        <div>
          <div className="w-[40vw] h-[8vh] bg-gray-800 flex items-center justify-evenly mt-2 rounded-sm ">
            <div className="flex primary-foreground">
              <img src="/images/add.svg"></img>
              <div>Top</div>
            </div>
            <div className="flex primary-foreground">
              <img src="/images/add.svg"></img>
              <div>New</div>
            </div>
          </div>
          <Post 
            content="https://lh3.googleusercontent.com/a/AGNmyxasMJkHoX7NA_RAoSZa-sKgDkPgYl0HP6xscDqn=s96-c" 
            title="making props to work for posts" 
            user="lerner1737@gmail.com" 
            subgeddit="AmITheAsshole" 
            timeStamp="3 days ago" 
            upvotes={88}
            />
        </div>
        <div className="bg-gray-800 w-[20vw] h-[55vh] rounded-sm mt-2 ml-2"></div>
      </div>
    </>
  );
}
