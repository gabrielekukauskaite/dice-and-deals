import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
const PAGE_SIZE = 10

const useGetAutoInfiniteBoardgames = () => {
  const query = useInfiniteQuery({
    queryKey: ['hotBoardgames'],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetch(
        `/api/hot-boardgames?page=${pageParam}&pageSize=${PAGE_SIZE}`,
      )
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
      return res.json()
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.total > PAGE_SIZE * lastPage.page) {
        return allPages.length + 1
      }
      return undefined
    },
    initialPageParam: 1,
    retry: 1,
  })

  // Automatically fetch next page after each successful page load
  useEffect(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage()
    }
  }, [query.hasNextPage, query.isFetchingNextPage, query.fetchNextPage])

  return query
}

export default useGetAutoInfiniteBoardgames
