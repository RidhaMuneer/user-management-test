import axios from "axios"
import { axiosInstance } from "@/api/client"

export async function makeRequest<T = unknown, R = unknown>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  endpoint: string,
  data?: T,
  params?: Record<string, unknown>
): Promise<R> {
  try {
    const response = await axiosInstance.request<R>({
      method,
      url: endpoint,
      data,
      params,
    })
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "An API error occurred")
    } else {
      throw new Error("An unexpected error occurred")
    }
  }
}

export async function getRecords<R>(
  endpoint: string,
  page?: number,
  size?: number,
  filters?: Record<string, unknown>,
): Promise<R> {
  const params = {
    page,
    size,
    ...filters,
  };
  return makeRequest<undefined, R>("GET", endpoint, undefined, params)
}

export async function createRecord<T, R>(
  endpoint: string,
  data: T
): Promise<R> {
  return makeRequest<T, R>("POST", endpoint, data)
}

export async function patchRecord<T, R>(
  endpoint: string,
  data: T
): Promise<R> {
  return makeRequest<T, R>("PUT", endpoint, data)
}

export async function deleteRecord<R>(
  endpoint: string
): Promise<R> {
  return makeRequest<undefined, R>("DELETE", endpoint)
}
