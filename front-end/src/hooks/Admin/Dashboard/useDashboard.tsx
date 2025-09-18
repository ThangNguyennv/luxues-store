import { useEffect, useState } from 'react'
import { fetchDashboardAPI } from '~/apis/admin/dashboard.api'
import type { DashboardInterface } from '~/types/dashboard.type'

export const useDashboard = () => {
  const [statistic, setStatistic] = useState({
    user: {
      total: 0
    },
    product: {
      total: 0
    },
    order: {
      total: 0
    },
    revenue: {
      total: 0
    }
  })

  useEffect(() => {
    fetchDashboardAPI().then((data: DashboardInterface) => {
      setStatistic(data.statistic)
    })
  }, [])

  return {
    statistic,
    setStatistic
  }
}