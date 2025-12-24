import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { fetchPosts, deletePost, updatePost } from "./api";
import { PostDetail } from "./PostDetail";
const maxPostPage = 10;

export function Posts() {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);

  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["posts"], //key is always an array
    queryFn: fetchPosts, // function that returns a promise to fetch a data
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
        <button disabled onClick={() => {}}>
          Previous page
        </button>
        <span>Page {currentPage + 1}</span>
        <button disabled onClick={() => {}}>
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}
