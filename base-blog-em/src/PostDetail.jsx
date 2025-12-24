import { fetchComments } from "./api";
import "./PostDetail.css";
import { useQuery } from "@tanstack/react-query";

export function PostDetail({ post }) {
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["comments", post.id], //key is always an array, arg: post.id
    queryFn: () => fetchComments(post.id), // function that returns a promise to fetch a data, 
    // React Query will call it later, when it decides to run the query
    // Needs post.id → must wrap in a callback to pass the arg
    staleTime: 2000, // data considered fresh for 2 seconds - then needs to be refetched
  });

// early return for loading state
  if(isLoading) {
    return <h2>Loading comments...</h2>;
  }
// early return for error state
  if(isError) {
    return <h2>{error.message}</h2>;
  }

  if (!data || data.length === 0) {
    return <p>No comments yet.</p>;
  }

  return (
    <>
      <h3 style={{ color: "magenta" }}>{post.title}</h3>
      <button>Delete</button> <button>Update title</button>
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map((comment) => (
        <li key={comment.id} className="comment">
          <span className="commenter">{comment.email}:</span>
          <span>{comment.body}</span>
        </li>
      ))}
    </>
  );
}
