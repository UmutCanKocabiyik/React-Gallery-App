import React, { useTransition, createContext, useState } from "react";
const DataContext = createContext();

export function DataProvider({ children }) {
  const [lastSearched, setLastSearched] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [isPending, startTransition] = useTransition();
  const [errorShow, setErrorShow] = useState(false);

  const changeInputAndFetch = async (searchInput) => {
    if (searchInput !== "") {
      setLastSearched(searchInput);
      setData([]);
      setPage(1);
      startTransition(async () => {
        await fetchData(searchInput);
      });
    }
  };

  const fetchData = async (query) => {
    const response = await fetch(
      `https://api.unsplash.com/search/photos/?query=${query}&per_page=24&page=${page}&client_id=${process.env.REACT_APP_CLIENT_ID}`
    );
    const { results, total_pages } = await response.json();
    if (!results && page !== total_pages) {
      setPage((prevPage) => prevPage + 1);
    }
    if (results.length == 0) {
      setLastSearched("");
      setErrorShow(true);
      getRandom();
      setTimeout(() => {
        setErrorShow(false);
      }, 3000);
    }
    startTransition(() => {
      setData((prevData) => [...prevData, ...results]);
    });
  };

  const getRandom = async () => {
    const response = await fetch(
      `https://api.unsplash.com/photos/random?count=24&client_id=${process.env.REACT_APP_CLIENT_ID}`
    );
    const randomData = await response.json();
    const shuffledArray = randomData.sort((a, b) => 0.5 - Math.random());
    startTransition(() => {
      setData((prevData) => [...prevData, ...shuffledArray]);
    });
  };

  return (
    <DataContext.Provider
      value={{
        changeInputAndFetch,
        fetchData,
        data,
        lastSearched,
        getRandom,
        isPending,
        errorShow,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export default DataContext;
