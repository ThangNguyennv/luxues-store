interface Props {
    title: string
}

const BoxHead = ({ title }: Props) => {
  return (
    <div className="text-center font-[700] sm:text-[48px] text-[32px] text-primary sm:mb-[54px] mb-[32px] uppercase">{title}</div>
  )
}

export default BoxHead