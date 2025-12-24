import InfiniteScroll from "react-infinite-scroller";
import { Species } from "./Species";
import { useInfiniteQuery } from "@tanstack/react-query"; 

const initialUrl = "https://swapi.py4e.com/api/species/";

const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfiniteSpecies() {
  // getting data for InfiniteScroll via React Query
  const {data, fetchNextPage, hasNextPage, isFetching, isLoading, isError, error} = useInfiniteQuery({
    queryKey: ['species'], // unique key for the query
    queryFn: ({ pageParam = initialUrl }) => {
      console.log('fetching url:', pageParam);
      return fetchUrl(pageParam);
    }, // fetch function with pageParam
    getNextPageParam: (lastPage) => {
      return lastPage.next || undefined; // function to get the next page URL
    },
  });

  if(isLoading) return <div className="loading">Loading...</div>;
  if(isError) return <div className="error">Error occurred while fetching data. {error.message}</div>;


  return (
    <>
  <InfiniteScroll 
  hasMore={hasNextPage} 
  loadMore={() => {
     if (!isFetching) fetchNextPage();  
    }}
    > 
    {data?.pages.map((page, pageIndex) => (
      <ul key={pageIndex}>
        {page.results.map((species) => ( 
          <Species  
            key={species.name} 
            name={species.name}  
            classification={species.classification} 
            language={species.language} 
          />    
        ))}
      </ul>
    ))} 
    </InfiniteScroll>  
  </>
 );
}
