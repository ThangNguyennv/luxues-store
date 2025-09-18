import { StatusItem } from './filterStatus'

const filterOrderHelpers = (query: Record<string, unknown>): StatusItem[] => {
  const filterOrder: StatusItem[] = [
    {
      name: 'Tất cả',
      status: '',
      class: ''
    },
    {
      name: 'Đang xử lý',
      status: 'PENDING',
      class: ''
    },
    {
      name: 'Đang giao hàng',
      status: 'TRANSPORTING',
      class: ''
    },
    {
      name: 'Hoàn thành',
      status: 'CONFIRMED',
      class: ''
    },
    {
      name: 'Đã hủy',
      status: 'CANCELED',
      class: ''
    }
  ]
  const target = query.status ?? ''
  const index = filterOrder.findIndex((item) => item.status === target)
  if (index >= 0) {
    filterOrder[index].class = 'CONFIRMED'
  }
  return filterOrder
}

export default filterOrderHelpers
