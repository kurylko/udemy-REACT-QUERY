import InfiniteScroll from "react-infinite-scroller";
import { useInfiniteQuery } from "@tanstack/react-query"; 
import { Person } from "./Person";

const initialUrl = "https://swapi.py4e.com/api/people/";

const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfinitePeople() {
  // getting data for InfiniteScroll via React Query
  const {data, fetchNextPage, hasNextPage, isFetching, isLoading, isError, error} = useInfiniteQuery({
    queryKey: ['people'], // unique key for the query
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
    {isFetching && <div className="loading">Loading...</div>}
  <InfiniteScroll 
  hasMore={hasNextPage} 
  loadMore={() => {
     if (!isFetching) fetchNextPage();
    }}
    > 
    {data?.pages.map((page, pageIndex) => (
      <ul key={pageIndex}>
        {page.results.map((person) => ( 
          <Person 
            key={person.name} 
            name={person.name}  
            hairColor={person.hair_color} 
            eyeColor={person.eye_color} 
          />    
        ))}
      </ul>
    ))} 
    </InfiniteScroll>
    </>
  );
}
