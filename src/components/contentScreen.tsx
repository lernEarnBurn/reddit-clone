import { PageInfo } from './pageInfo';
import { Post } from './post';

export function ContentScreen() {
  return (
    <div className="flex justify-center">
      <div className="flex-col">
        <div className="mt-2 flex h-[8vh] w-[40vw] items-center justify-evenly rounded-sm bg-gray-800 ">
          <div className="primary-foreground flex">
            <img src="/images/add.svg"></img>
            <div>Top</div>
          </div>
          <div className="primary-foreground flex">
            <img src="/images/add.svg"></img>
            <div>New</div>
          </div>
        </div>
        <Post
          content="https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=449&q=80"
          title="making props to work for posts"
          user="lerner1737@gmail.com"
          subgeddit="AmITheAsshole"
          timeStamp="3 days ago"
          upvotes={88}
        />
        <Post
          content="https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=449&q=80"
          title="making props to work for posts"
          user="lerner1737@gmail.com"
          subgeddit="AmITheAsshole"
          timeStamp="3 days ago"
          upvotes={88}
        />
        <Post
          content="://images.unsplash.com/photo-1517423440428-a5a00ad4 93e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by 1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=449&q=80"
          title="making props to work for posts"
          user="lerner1737@gmail.com"
          subgeddit="AmITheAsshole"
          timeStamp="3 days ago"
          upvotes={88}
        />
      </div>
      <PageInfo subgeddit="AmITheAssholes" />
    </div>
  );
}
