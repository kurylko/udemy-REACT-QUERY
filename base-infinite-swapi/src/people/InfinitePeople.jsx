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
  const {data, fetchNextPage, hasNextPage} = useInfiniteQuery({
    queryKey: ['people'], // unique key for the query
    queryFn: ({ pageParam = initialUrl }) => fetchUrl(pageParam), // fetch function with pageParam
    getNextPageParam: (lastPage) => {
      return lastPage.next || undefined; // function to get the next page URL
    },
  });

  return <InfiniteScroll />;
}
