import { Searchbar, Footer } from "./components";
import { useContext, useRef, useCallback, useEffect, useState } from "react";
import "./App.css";
import DataContext from "./DataContext";
import { AiOutlineArrowUp } from "react-icons/ai";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [showToTopButton, setShowToTopButton] = useState(false);
  const { errorShow, lastSearched, data, isPending, getRandom, fetchData } =
    useContext(DataContext);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    getRandom();
  }, []);

  const handleScroll = (e) => {
    const topPixel = e.target.documentElement.scrollTop;
    if (topPixel > 500) {
      setShowToTopButton(true);
    } else {
      setShowToTopButton(false);
    }
  };

  //OBSERVATION TO INFINITELY SCROLL
  const observer = useRef();
  const lastPhotoRef = useCallback(
    (node) => {
      if (isPending) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            if (lastSearched) {
              fetchData(lastSearched);
            } else {
              getRandom();
            }
          }
        },
        { threshold: 0.5 }
      );
      if (node) {
        observer.current.observe(node);
      }
    },
    [isPending]
  );

  return (
    <div className="App">
      <Searchbar />
      <div className="main_container">
        <hr className="main_hr" />
        <div className="main_photoContainer">
          {data.map((photo, i) => {
            if (data.length === i + 1) {
              return (
                <img
                  ref={lastPhotoRef}
                  key={uuidv4()}
                  alt=""
                  src={photo.urls.small}
                />
              );
            } else {
              return <img key={uuidv4()} alt="" src={photo.urls.small} />;
            }
          })}
          {isPending && (
            <div className="main_photoContainer_pending">loading...</div>
          )}
        </div>
        <hr className="main_hr" />
      </div>
      <div className="main_pageUpButtonContainer">
        <button
          className={!showToTopButton ? "hidden" : "main_pageUpButton"}
          onClick={() => {
            window.scrollTo(0, 0);
          }}
        >
          <AiOutlineArrowUp />
        </button>
      </div>
      <Footer />
      {<div className={errorShow ? "toastError" : "hidden"}> Can not found ! </div>}
    </div>
  );
}

export default App;
