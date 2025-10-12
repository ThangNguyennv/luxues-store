import { useEffect, useState } from 'react'
import { IoChatbox } from 'react-icons/io5'

const Contact = () => {
  const [isAnimating, setIsAnimating] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 1500)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {/* Nút chat */}
      <button
        className={`
          fixed bottom-6 right-6
          w-[60px] h-[60px]
          rounded-full
          bg-blue-500 text-white
          flex items-center justify-center
          shadow-2xl
          z-50
          overflow-visible
          ${isAnimating ? 'animate-bounce-ring' : ''}
        `}
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Vòng sáng lan rộng */}
        <div className="absolute inset-0 rounded-full bg-blue-400 opacity-70 animate-pulse-ring"></div>

        {/* Icon chat */}
        <IoChatbox className="text-3xl z-10 animate-pulse-strong" />
      </button>

      {/* Khung chat */}
      {isOpen && (
        <div
          className="
            fixed bottom-24 right-6
            w-[320px] h-[400px]
            bg-white border border-gray-300 rounded-2xl shadow-2xl
            animate-slide-up
            p-3 flex flex-col
            z-50
          "
        >
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="font-semibold text-gray-700">Chat với shop 💬</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 mt-3 overflow-y-auto text-gray-600 text-sm">
            <p>Xin chào 👋, shop có thể giúp gì cho bạn?</p>
          </div>

          <input
            className="mt-3 w-full border rounded-lg p-2 text-sm outline-none focus:ring focus:ring-blue-200"
            placeholder="Nhập tin nhắn..."
          />
        </div>
      )}
    </>
  )
}

export default Contact
