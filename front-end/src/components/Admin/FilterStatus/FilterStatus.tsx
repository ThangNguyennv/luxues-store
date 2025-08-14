/* eslint-disable no-unused-vars */
import type { FilterStatusInterface } from '~/types/helper.type'

interface Props {
  filterStatus: FilterStatusInterface[]
  currentStatus: string
  handleFilterStatus: (status: string) => void
}

const FilterStatus = ({ filterStatus, currentStatus, handleFilterStatus }: Props) => {
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
                className={`cursor-pointer p-[10px] border rounded-[5px] border-[#525FE1] hover:bg-[#525FE1] ${isActive ? 'bg-[#525FE1] border-[#525FE1]' : 'bg-white'}`}
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

export default FilterStatus