export type User = {
  id?: number;
  name: string;
  email: string;
  role_id: string;
  status?: string;
}

export type UserPaginated = {
  data: {
    users: User[]
    current_page: number
    page_count: number
    total: number
  }
}