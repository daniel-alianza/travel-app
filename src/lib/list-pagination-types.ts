export interface ListaPaginadaMeta {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface ListaPaginada<T> {
  items: T[]
  meta: ListaPaginadaMeta
}
