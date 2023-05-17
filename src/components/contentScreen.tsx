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
          <div className="w-[40vw] h-auto min-h-[81vh] mt-2 bg-gray-800 rounded-sm"></div>
        </div>
        <div className="bg-gray-800 w-[20vw] h-[55vh] rounded-sm mt-2 ml-2"></div>
      </div>
    </>
  );
}
