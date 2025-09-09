import { useEffect, useState } from 'react'
import { fetchCartAPI } from '~/apis/client/cart.api'

const Cart = () => {
  const [data, setData] = useState()
  useEffect(() => {
    fetchCartAPI().then((res) => {
      setData(res)
    })
  }, [])
  return (
    <div>index</div>
  )
}

export default Cart