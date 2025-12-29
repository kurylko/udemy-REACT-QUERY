import { toast } from "@/components/app/toast";
import { QueryCache, QueryClient } from "@tanstack/react-query";

function errorHandler(errorMsg: string) {
//   https://chakra-ui.com/docs/components/toast#preventing-duplicate-toast
//   one message per page load, not one message per query
//   the user doesn't care that there were three failed queries on the staff page
//      (staff, treatments, user)
  const id = "react-query-toast";

  if (!toast.isActive(id)) {
    const action = "fetch";
    const title = `could not ${action} data: ${
      errorMsg ?? "error connecting to server"
    }`;
    toast({ id, title, status: "error", variant: "subtle", isClosable: true });
  }
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2, // number of retry attempts if query fails  
      retryDelay: 1000, // delay between retry attempts in milliseconds
      staleTime: 300000, // 5 minutes - for refreshing data after this time (data remains fresh for this time)
      gcTime: 600000,   // 10 minutes - for removing data from cache after this time (garbage collection time)
      refetchOnWindowFocus: false, // do not refetch data when window regains focus (new tab)
    },
  },
    queryCache: new QueryCache({
    onError: (error: unknown) => {
     errorHandler((error as Error).message);
    }
    }),
});
