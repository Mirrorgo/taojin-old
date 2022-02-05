function SearchContent({url}) {
  return (
    <>
      <div className="bg-gray-400 h-6" style={{width: "36rem"}}></div>
      <iframe className="z-50 h-screen resize" src={url} frameborder="0" style={{height:`calc(100vh - 1.5rem)`, width: "36rem"}}></iframe>
    </>
  )
}
export default SearchContent;
