/* eslint-disable no-unused-vars */
import type { FilterStatus } from '~/pages/Admin/Product/Product'

interface Props {
  filterStatus: FilterStatus[]
  currentStatus: string
  handleFilterStatus: (status: string) => void
}

const FilterStatusProps = ({ filterStatus, currentStatus, handleFilterStatus }: Props) => {
  return (
    <>
      {filterStatus && (
        <div className='flex gap-[15px] items-center'>
          {filterStatus.map((item, index) => {
            const isActive = currentStatus === item.status
            return (
              <button
                key={index}
                onClick={() => handleFilterStatus(item.status)}
                className={`cursor-pointer p-[15px] border rounded-[5px] border-[#525FE1] hover:bg-[#525FE1] ${isActive ? 'bg-[#525FE1] border-[#525FE1]' : 'bg-white'}`}
              >
                {item.name}
              </button>
            )
          })}
        </div>
      )}
    </>
  )
}

export default FilterStatusProps