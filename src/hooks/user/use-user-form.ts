"use client"

import { User } from "@/types/user.types"
import { useCallback, useState } from "react"

const useUserForm = () => {
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false)
  const [formMode, setFormMode] = useState<"add" | "update">("add")
  const [formError, setFormError] = useState<Error | undefined>()
  const [userToBeUpdated, setUserToBeUpdated] = useState<User | undefined>()
  
  const openAddForm = useCallback(() => {
    setFormMode("add")
    setUserToBeUpdated(undefined)
    setFormError(undefined)
    setIsFormOpen(true)
  }, [])
  
  const openUpdateForm = useCallback((user: User) => {
    setFormMode("update")
    setUserToBeUpdated(user)
    setFormError(undefined)
    setIsFormOpen(true)
  }, [])
  
  const closeForm = useCallback(() => {
    setIsFormOpen(false)
    setFormError(undefined)
  }, [])
  
  const setError = useCallback((error: Error) => {
    setFormError(error)
  }, [])
  
  return {
    isFormOpen,
    formMode,
    formError,
    userToBeUpdated,
    openAddForm,
    openUpdateForm,
    closeForm,
    setError
  }
}

export default useUserForm;