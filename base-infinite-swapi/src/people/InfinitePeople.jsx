import InfiniteScroll from "react-infinite-scroller";
import { Person } from "./Person";

const initialUrl = "https://swapi.py4e.com/api/people/";
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfinitePeople() {
  // TODO: get data for InfiniteScroll via React Query
  return <InfiniteScroll />;
}
