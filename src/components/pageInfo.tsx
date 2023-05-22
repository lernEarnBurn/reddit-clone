interface PageInfoProps {
  subgeddit: string;
}

export function PageInfo(props: PageInfoProps) {
  return (
    <div className="ml-2 mt-2 h-[55vh] w-[20vw] flex-col rounded-sm bg-gray-800">
      <div
        className=" primary-foreground align-center mt-6 flex h-[7vh] w-[20vw] justify-center bg-cover text-2xl font-bold"
        style={{ backgroundImage: 'url(/images/subgedditBackground.png)' }}
      >
        <p>g/{props.subgeddit}</p>
      </div>
      <div className="primary-foreground px-6 py-4">This is the description and it is goi to be long as hell.</div>
      <div className="bg-red-600 h-[20vh] w-[20vw] align-bottom mt-20"></div>
    </div>
  );
}
