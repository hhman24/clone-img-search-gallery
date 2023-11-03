import { useEffect, useRef, useState } from "react";
import { BsSearch } from "react-icons/bs";
import './App.css'



export default function App() {
  // set trang thai lay cau query
  const [searchInfo, setSearchInfo] = useState('');
  // danh sach anh
  const [imgs, setImgs] = useState([]);
  // so trang
  const [pageNumber, setPageNumber] = useState(0);
  // trang thai tai anh
  const [isLoading, setIsLoading] = useState(false);
  // trang thai tim anh
  const [isSearch, setIsSearch] = useState(false);

  // trang thai neu la phan tu cuoi
  const [lastElement, setLastElement] = useState(null);
  
  const ACESS_KEY = 'xPJ_3LrTQlGpg-EVPlw3JGCaO2hitgw_GVpd-_hAKag';

  const observer = useRef(
    new IntersectionObserver(
        (entries) => {
            const first = entries[0];
            if (first.isIntersecting) {
              setPageNumber((no) => no + 1);
            }
        })
  );


  function handleSearch () {
    if(searchInfo !== '') setIsSearch(true);
    else setIsSearch(false);
  }

  const searchImage = async (url) => {
    try{
      const respond = await fetch(url);
      const results = await respond.json();

      console.log(results)
      const newImgs = (pageNumber > 1 && !isSearch) ? ([...imgs, ...results.results]) : ([...results.results])
      return newImgs
    }
    catch(err){
      console.log({err});
    }
    finally{
      setIsLoading(false);
    }
  }

  // use effect de tim anh
  useEffect(() => {

    if(searchInfo !== '' && isSearch){
      // dat lai page number
      setPageNumber(1);
      
      let params = {client_id: ACESS_KEY, query: searchInfo, page: pageNumber, per_page: 10};
      const url = 'https://api.unsplash.com/search/photos/?'+ new URLSearchParams(params);

      setIsLoading(true);

      // lay du lieu neu thanh cong
      searchImage(url).then(imgs => {
        setImgs(imgs);
        setIsLoading(false);
      });

      setIsSearch(false);
    }
  }, [isSearch])


  // use effect de load them anh
  useEffect(() => {
    if(pageNumber > 1){
      
      let params = {client_id: ACESS_KEY, query: searchInfo, page: pageNumber, per_page: 10};
      let url = 'https://api.unsplash.com/search/photos/?'+ new URLSearchParams(params);
  
      setIsLoading(true);

      setTimeout(() => {
        searchImage(url).then(imgs => {
          setImgs(imgs);
          setIsLoading(false);
        });
      }, 1000)

    }
  }, [pageNumber])

  // use effect
  useEffect(() => {
    const currentElement = lastElement;
    const currentObserver = observer.current;

    if (currentElement) {
        currentObserver.observe(currentElement);
    }

    return () => {
        if (currentElement) {
            currentObserver.unobserve(currentElement);
        }
    };
  }, [lastElement]);

  return (
    <div className="App">
      <div
        className="app-background"
      >
        <div className="app-background-image" style={{
          backgroundImage: `url(https://th.bing.com/th/id/R.e3ebb7715cee7a0b66c355dd09c10828?rik=2FwnCB0gzLPKCw&riu=http%3a%2f%2fkarenhutton.com%2fwp-content%2fuploads%2f2013%2f02%2fEntryToTheMountains.jpg&ehk=KDBQX2HV5psrQNrYkEzEYqo%2bFHVlUKeP4GkJCc4D%2fK8%3d&risl=&pid=ImgRaw&r=0)`}}/>
        <div className="app-background-image-filter"/>
      </div>

      <div className="search" >
        <div className="search-gallery">
          <div className="search-bar">
            {/* <div className="search-bar-clicker" /> */}
            <input className="search-bar-input" type="text" name="search"
            value={searchInfo} placeholder="Search Here!" onChange={e => setSearchInfo(e.target.value)}/>
            <i className="search-bar-logo"
               onClick={handleSearch}>
              <BsSearch />
            </i>
          </div>
          
        </div>
      </div>

      <div className="gallery">
        <div className="img-list">
          {imgs.map((img, id) => {
            return(
              <>
                <div className="item" key={id}>
                  <img className="img-result" src={img.urls.small}/>
                  <div className="title"> {img.user.username} </div>
                </div>
              </>
            );
          })}
        </div>
      </div>

      <div className="last element" ref={setLastElement} ></div>
      
      {isLoading &&       
        <div className="box" >
          <div className="loading"></div>
        </div> 
      }
    </div>
  );
}
