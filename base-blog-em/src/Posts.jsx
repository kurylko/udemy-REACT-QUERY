import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { fetchPosts, deletePost, updatePost } from "./api";
import { PostDetail } from "./PostDetail";
const maxPostPage = 10;

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  const queryClient = useQueryClient();
  
// Prefetching next page, data stored in cache
  useEffect(() => {
    if(currentPage < maxPostPage) {   
    const nextPage = currentPage + 1;
    // Pre-fetch the next page
    if (currentPage < maxPostPage) {    
      queryClient.prefetchQuery({
        queryKey: ["posts", nextPage],
        queryFn: () => fetchPosts(nextPage),
      });
    }
  }
  }, [currentPage, queryClient]);

  const { data, isError, error, isLoading, isFetching } = useQuery({
    queryKey: ["posts", currentPage], //key is always an array
    queryFn: () => fetchPosts(currentPage), // function that returns a promise to fetch a data
    // passing the function by reference, no args, no params
    staleTime: 2000, // data considered fresh for 2 seconds - then needs to be refetched
  });

 // isLoading = no cached data + Fetching in progress
// early return for loading state
  if(isLoading) {
    return <h2>Loading posts...</h2>;
  }
// early return for error state
  if(isError) {
    return <h2>{error.message}</h2>;
  }

  if(isFetching) {
    console.log("Background fetching posts...");
  }

  console.log("Posts data:", data);

  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button 
        disabled={currentPage <= 1} 
        onClick={() => setCurrentPage(currentPage - 1)}>
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button 
        disabled={currentPage >= maxPostPage} 
        onClick={() => setCurrentPage(currentPage + 1)}>
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
