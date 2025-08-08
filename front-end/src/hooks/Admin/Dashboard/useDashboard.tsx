import { useEffect, useState } from 'react'
import { fetchDashboardAPI } from '~/apis/admin/dashboard.api'
import type { DashboardInterface } from '~/types'

export const useDashboard = () => {
  const [statistic, setStatistic] = useState({
    categoryProduct: {
      total: 0, active: 0, inactive: 0
    },
    product: {
      total: 0, active: 0, inactive: 0
    },
    account: {
      total: 0, active: 0, inactive: 0
    },
    user: {
      total: 0, active: 0, inactive: 0
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