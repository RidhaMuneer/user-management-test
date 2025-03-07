export type UserFormProps = {
  mode: "add" | "update"
  initialData?: {
    email: string
    name: string
    password?: string
  }
  requestError: Error | undefined
  onSubmit: (data: { email: string; name: string; password: string, role_id: string }) => void
  onCancel: () => void
}

export type ValidationErrors = {
  email?: string
  name?: string
  password?: string
  passwordConfirm?: string
}