import { Link } from 'react-router-dom'

interface Child {
  _id: string,
  title: string,
  slug: string
}

interface Sub {
  _id: string,
  title: string,
  slug: string,
  children?: Child[],
}

interface Parent {
  _id: string,
  title: string,
  slug: string,
  children?: Sub[]
}

interface SubMenuProps {
  dataDropdown: Parent[]
}

const SubMenu = ({ dataDropdown }: SubMenuProps) => {
  return (
    <div className="grid grid-cols-3 gap-[10px] p-[24px] bg-white shadow-lg w-full divide-x divide-black">
      {dataDropdown.map((parent) => (
        <div key={parent._id}>
          <Link
            to={`/products/${parent.slug}`}
            className="font-[600] uppercase mb-[12px] border-b-[2px] border-black inline-block"
          >
            {parent.title}
          </Link>
          <div className="mt-[8px] space-y-[10px]">
            {parent.children?.map((sub) => (
              <div key={sub._id}>
                <Link
                  to={`/products/${sub.slug}`}
                  className="font-semibold text-gray-800 hover:text-[#FFAB19]"
                >
                  {sub.title}
                </Link>
                {sub.children && (
                  <ul className="ml-[12px] mt-[10px] text-[16px] text-gray-600 grid grid-cols-2 gap-[15px]">
                    {sub.children.map((child) => (
                      <Link
                        key={child._id}
                        to={`/products/${child.slug}`}
                        className="hover:text-[#FFAB19]"
                      >
                        {child.title}
                      </Link>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default SubMenu