export interface StatusItem {
  name: string;
  status: string;
  class: string;
}

const filterStatusHelpers = (query: Record<string, unknown>): StatusItem[] => {
  const statuses: StatusItem[] = [
    { name: 'Tất cả', status: '', class: '' },
    { name: 'Hoạt động', status: 'active', class: '' },
    { name: 'Dừng hoạt động', status: 'inactive', class: '' }
  ]

  const target = query.status ?? ''
  const index = statuses.findIndex((item) => item.status === target)

  if (index >= 0) {
    statuses[index].class = 'active'
  }

  return statuses
}

export default filterStatusHelpers
