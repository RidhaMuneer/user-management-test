"use client"

import { createRecord, patchRecord } from "@/api/requests"
import { useFetch } from "@/hooks/use-fetch"
import type { User, UserPaginated } from "@/types/user.types"
import { useCallback, useEffect, useMemo, useState } from "react"

const useUserData = (initialPage = 1) => {
  const [page, setPage] = useState<number>(initialPage)
  const [localUsers, setLocalUsers] = useState<User[]>([])

  const {
    data,
    isLoading,
    error
  } = useFetch<UserPaginated>(`/users?page=${page}`, {}, [page])

  useEffect(() => {
    if (data?.data.users) {
      setLocalUsers(data.data.users)
    }
  }, [data?.data.users])

  const handlePageChange = useCallback((e: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage)
  }, [])

  const addUser = async (userData: { email: string; name: string; password: string; role_id: string }) => {
    const response = await createRecord<User, { data: User }>("/user", userData)

    setLocalUsers(prev => [...prev, response.data])

    return response
  }

  const updateUser = async (
    id: number,
    userData: { email: string; name: string; password: string; role_id: string; status?: string }
  ) => {
    const response = await patchRecord<User, { data: User }>(`/user/${id}`, userData)
    
    setLocalUsers(prev => 
      prev.map(user => user.id === id ? response.data : user)
    )

    return response
  }

  return {
    users: localUsers,
    isLoading,
    error,
    pageCount: data?.data.page_count || 0,
    currentPage: data?.data.current_page || 1,
    handlePageChange,
    addUser,
    updateUser
  }
}

export default useUserData;