"use client"

import LoadingSpinner from "@/components/loading";
import useUserData from "@/hooks/user/use-user-data";
import { Column } from "@/types/table.types";
import { User } from "@/types/user.types";
import { useMemo } from "react";
import useUserForm from "@/hooks/user/use-user-form";
import Table from "@/components/table";
import Popup from "@/components/pop-up";
import UserForm from "@/components/forms/user";
import ErrorDisplay from "@/components/error";
import { ToastContainer, toast } from "react-toastify";

export default function Home() {
  const {
    users,
    isLoading,
    error,
    pageCount,
    currentPage,
    handlePageChange,
    addUser,
    updateUser
  } = useUserData()

  const {
    isFormOpen,
    formMode,
    formError,
    userToBeUpdated,
    openAddForm,
    openUpdateForm,
    closeForm,
    setError
  } = useUserForm()

  const handleSubmit = async (data: { email: string; name: string; password: string; role_id: string }) => {
    try {
      if (formMode === "add") {
        await addUser(data)
        toast.success("User added")
      } else if (userToBeUpdated) {
        await updateUser(userToBeUpdated.id!, {
          ...data,
          status: userToBeUpdated.status
        })
        toast.success("User updated")
      }
      closeForm()
    } catch (error) {
      setError(error as Error)
    }
  }

  const columns: Column[] = useMemo(() => [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role_id",
      key: "role_id",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "action",
      render: (id: number, user: User) => (
        <button
          className="update-button"
          onClick={() => openUpdateForm(user)}
        >
          <span className="update-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
            </svg>
          </span>
          Edit
        </button>
      ),
    },
  ], [openUpdateForm])

  if (isLoading) return <LoadingSpinner fullPage />

  if (error) return <ErrorDisplay message={error.message} />

  return (
    <main className="page-container">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">User Management</h1>
        </div>
        <button
          className="button button-primary add-button"
          onClick={openAddForm}
        >
          <span className="button-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </span>
          Add User
        </button>
      </div>

      <div className="table-section">
        <Table
          data={users}
          columns={columns}
          number_of_pages={pageCount}
          page={currentPage}
          onChangePage={handlePageChange}
        />
      </div>

      <Popup isOpen={isFormOpen}>
        <UserForm
          mode={formMode}
          onSubmit={handleSubmit}
          onCancel={closeForm}
          requestError={formError}
          initialData={userToBeUpdated}
        />
      </Popup>
      <ToastContainer/>
    </main>
  )
}