import { useEffect, useState } from 'react'
import { fetchDashboardAPI } from '~/apis'

const Dashboard = () => {
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
      total: 0,
      active: 0,
      inactive: 0
    }
  })
  useEffect(() => {
    fetchDashboardAPI().then((data) => {
      setStatistic(data.statistic)
    })
  }, [])
  return (
    <>
      <h1 className="text-[30px] font-[700] text-[#BC3433] m-[20px]">Tổng quan</h1>

      <div className='grid grid-cols-2 gap-[10px] border rounded-[5px] p-[5px]'>
        <div className='border p-[5px]'>
          <div>
            <b>Danh mục sản phẩm</b>
          </div>
          <p>Số lượng: <b>{statistic.categoryProduct.total}</b></p>
          <p>Hoạt động: <b>{statistic.categoryProduct.active}</b></p>
          <p>Dừng hoạt động: <b>{statistic.categoryProduct.inactive}</b></p>
        </div>
        <div className='border p-[5px]'>
          <div>
            <b>Danh sách sản phẩm</b>
          </div>
          <p>Số lượng: <b>{statistic.product.total}</b></p>
          <p>Hoạt động: <b>{statistic.product.active}</b></p>
          <p>Dừng hoạt động: <b>{statistic.product.inactive}</b></p>
        </div>
        <div className='border p-[5px]'>
          <div>
            <b>Tài khoản admin</b>
          </div>
          <p>Số lượng: <b>{statistic.account.total}</b></p>
          <p>Hoạt động: <b>{statistic.account.active}</b></p>
          <p>Dừng hoạt động: <b>{statistic.account.inactive}</b></p>
        </div>
        <div className='border p-[5px]'>
          <div>
            <b>Tài khoản User</b>
          </div>
          <p>Số lượng: <b>{statistic.user.total}</b></p>
          <p>Hoạt động: <b>{statistic.user.active}</b></p>
          <p>Dừng hoạt động: <b>{statistic.user.inactive}</b></p>
        </div>
      </div>
    </>
  )
}

export default Dashboard