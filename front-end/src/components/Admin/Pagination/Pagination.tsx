/* eslint-disable no-unused-vars */
import { PiGreaterThan } from 'react-icons/pi'
import { PiLessThan } from 'react-icons/pi'
import type { PaginationInterface } from '~/types/helper.type'

interface Props {
  pagination: PaginationInterface | null
  handlePagination: (page: string) => void
  handlePaginationPrevious: (page: number) => void
  handlePaginationNext: (page: number) => void
}

const Pagination = ({ pagination, handlePagination, handlePaginationPrevious, handlePaginationNext }: Props) => {
  return (
    <>
      {pagination && (
        <nav className='flex items-center justify-center p-[30px]'>
          <ul className='flex items-center justify-center gap-[10px]'>
            {pagination.currentPage > 1 && (
              <li>
                <button
                  onClick={() => handlePaginationPrevious(pagination.currentPage)}
                  className='cursor-pointer'
                >
                  <PiLessThan />
                </button>
              </li>
            )}
            {[...Array(pagination.totalPage)].map((_item, index) => {
              const isActive = pagination.currentPage === (index + 1)
              return (
                <li key={index}>
                  <button
                    onClick={() => handlePagination((index + 1).toString())}
                    className={`cursor-pointer p-[4px] border rounded-[4px] border-[#525FE1] hover:bg-[#525FE1] 
                    ${isActive ? 'bg-[#525FE1]' : 'bg-white'}`}
                  >
                    {index + 1}
                  </button>
                </li>
              )
            })}
            {pagination.currentPage < pagination.totalPage && (
              <li>
                <button
                  onClick={() => handlePaginationNext(pagination.currentPage)}
                  className='cursor-pointer'
                >
                  <PiGreaterThan />
                </button>
              </li>
            )}
          </ul>
        </nav>
      )}
    </>
  )
}

export default Pagination