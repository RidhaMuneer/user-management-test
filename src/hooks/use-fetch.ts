import { useState, useEffect } from 'react';
import { getRecords } from '@/api/requests';
import { FetchOptions, FetchState } from '@/types/fetch.types';

export function useFetch<T>(
  endpoint: string, 
  options: FetchOptions = {}, 
  dependencies: any[] = []
): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    isLoading: true,
    error: null
  })

  const { page, size, filters } = options

  useEffect(() => {
    let isMounted = true
    
    const fetchData = async () => {
      setState(prev => ({ ...prev, isLoading: true }))
      
      try {
        const result = await getRecords<T>(
          endpoint,
          page,
          size,
          filters
        )
        
        if (isMounted) {
          setState({
            data: result,
            isLoading: false,
            error: null
          })
        }
      } catch (error) {
        if (isMounted) {
          setState({
            data: null,
            isLoading: false,
            error: error instanceof Error ? error : new Error('An unknown error occurred')
          })
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [...Object.values(options), ...dependencies])

  return state
}