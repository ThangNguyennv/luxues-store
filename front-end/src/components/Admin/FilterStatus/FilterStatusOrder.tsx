/* eslint-disable no-unused-vars */
import Skeleton from '@mui/material/Skeleton'
import type { FilterStatusInterface } from '~/types/helper.type'

interface Props {
  filterOrder: FilterStatusInterface[]
  currentStatus: string
  handleFilterStatus: (status: string) => void
}

const FilterStatusOrder = ({ filterOrder, currentStatus, handleFilterStatus }: Props) => {
  return (
    <>
      {filterOrder && filterOrder.length > 0 ? (
        <div className='flex gap-[15px] items-center'>
          {filterOrder.map((item, index) => {
            const isActive = currentStatus === item.status
            return (
              <button
                key={index}
                onClick={() => handleFilterStatus(item.status)}
                className={`p-[5px] border rounded-[5px] border-[#525FE1] hover:bg-[#525FE1] 
                  ${isActive ? 'bg-[#525FE1] border-[#525FE1]' : 'bg-white'}`}
              >
                {item.name}
              </button>
            )
          })}
        </div>
      ) : (
        <div className='flex gap-[15px] items-center'>
          <Skeleton variant="rectangular" width={55} height={35} sx={{ bgcolor: 'grey.400', borderRadius: 2 }}/>
          <Skeleton variant="rectangular" width={74} height={35} sx={{ bgcolor: 'grey.400', borderRadius: 2 }}/>
          <Skeleton variant="rectangular" width={122} height={35} sx={{ bgcolor: 'grey.400', borderRadius: 2 }}/>
          <Skeleton variant="rectangular" width={55} height={35} sx={{ bgcolor: 'grey.400', borderRadius: 2 }}/>
        </div>
      )}
    </>
  )
}

export default FilterStatusOrder