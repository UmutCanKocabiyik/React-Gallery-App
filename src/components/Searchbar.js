import { useTransition, useRef, useState, useContext } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import DataContext from "../DataContext";
import "./Searchbar.css";

function Searchbar() {
  const { changeInputAndFetch } = useContext(DataContext);
  const [searchInput, setSearchInput] = useState("");

  const [isSearching, startTransition] = useTransition();

  const handleChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (searchInput !== "") {
      await changeInputAndFetch(searchInput);
    }
    startTransition(() => {
      setSearchInput("");
    });
  };

  const inputRef = useRef();
  const focusInput = () => {
    inputRef.current.focus();
  };

  return (
    <>
      <div className="logo">GALLERY-APP</div>
      <form onSubmit={handleSubmit} className="searchbar_container">
        <input
          type="text"
          placeholder="Search..."
          name="searchInput"
          onChange={handleChange}
          value={isSearching ? "searching..." : searchInput}
          ref={inputRef}
        />
        <button type="button" onClick={focusInput}>
          <AiOutlineSearch />
        </button>
      </form>
    </>
  );
}
export default Searchbar;
