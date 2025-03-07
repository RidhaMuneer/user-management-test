export type FetchState<T> = {
  data: T | null
  isLoading: boolean
  error: Error | null
}

export type FetchOptions = {
  page?: number
  size?: number
  filters?: Record<string, unknown>
}