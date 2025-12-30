import { toast } from "@/components/app/toast";
import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";

function createTitle(
  errorMsg: string | undefined,
  actionType: 'query' | 'mutation'
): string {
  const action = actionType === 'query' ? 'fetch' : 'mutate';

  return `Could not ${action} data: ${errorMsg ?? 'unknown error'}`;
};

function errorHandler(title: string) {
//   https://chakra-ui.com/docs/components/toast#preventing-duplicate-toast
//   one message per page load, not one message per query
//   the user doesn't care that there were three failed queries on the staff page
//      (staff, treatments, user)
  const id = "react-query-toast";

  if (!toast.isActive(id)) {
    toast({ id, title, status: "error", variant: "subtle", isClosable: true });
  }
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2, // number of retry attempts if query fails  
      retryDelay: 1000, // delay between retry attempts in milliseconds
      staleTime: 300000, // 5 minutes - refreshing data after this time (data remains fresh for this time)
      gcTime: 600000,   // 10 minutes - removing data from cache after this time (garbage collection time)
      refetchOnWindowFocus: false, // do not refetch data when window regains focus (user goes to new tab)
    },
  },
    queryCache: new QueryCache({
    onError: (error: unknown) => {
      const title = createTitle(error instanceof Error ? error.message : undefined, 'query');
     errorHandler(title);
    }
    }),

    mutationCache: new MutationCache({
    onError: (error: unknown) => {
      const title = createTitle(error instanceof Error ? error.message : undefined, 'mutation');
     errorHandler(title);
    }
    }),
});
