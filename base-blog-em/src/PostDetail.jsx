import { fetchComments } from "./api";
import "./PostDetail.css";
import { useQuery } from "@tanstack/react-query";

export function PostDetail({ post, deleteMutation, updateTitleMutation }) {
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
      <div style={{display: 'flex', gap: '8px'}}>
        <div>   
         <button 
         style={{ color: "red" }} 
         onClick={() => deleteMutation.mutate(post.id)}>
          Delete
          </button> 
          {deleteMutation.isPending && <span className="loading"> Deleting...</span>}
           {deleteMutation.isError 
           && <span className="error"> Error Deleting Post: {deleteMutation.error.message}</span>
           }
           {deleteMutation.isSuccess 
           && <span className="success"> Post (Deleted) Successfully!</span>
           }
        </div>
        <div> 
          <button 
          style={{ color: "blue" }}
          onClick={() => updateTitleMutation.mutate(post.id)}>
          Update title</button>
          {updateTitleMutation.isPending && <span className="loading"> Updating...</span>}
          {updateTitleMutation.isError 
           && <span className="error"> Error Updating Post: {updateTitleMutation.error.message}</span>
           }
           {updateTitleMutation.isSuccess 
           && <span className="success"> Post (Updated) Successfully!</span>
           }
          </div>
      </div>
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
