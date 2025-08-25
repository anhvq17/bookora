import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Search, ShoppingCart, Heart, User, Phone } from "lucide-react"

type Props = {}

const Header = (_props: Props) => {
  const [openUserMenu, setOpenUserMenu] = useState(false)
  const [user, setUser] = useState<any>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const nav = useNavigate()

  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      } else {
        setUser(null)
      }
    }
    loadUser()
    window.addEventListener("userLogin", loadUser)
    return () => window.removeEventListener("userLogin", loadUser)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenUserMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("user")
    setUser(null)
    nav("/login")
  }

  return (
    <div className="text-sm font-sans shadow-sm">
      <div className="flex items-center justify-between px-8 py-4 border-b bg-gradient-to-r from-white to-gray-50">
        <div className="flex items-center space-x-4">
          <Link
            to={"/"}
            className="font-bold text-2xl text-gray-800 hover:text-gray-700 transition-colors duration-200"
          >
            Book<span className="text-[#9966cb]">ora</span>
          </Link>
          <div className="hidden md:block w-px h-6 bg-gray-300"></div>
          <span className="hidden md:block text-gray-500 font-medium">We love books</span>
        </div>

        <div className="flex items-center space-x-4">
          <form
            className="relative w-80"
            onSubmit={(e) => {
              e.preventDefault()
            }}
          >
            <input
              type="text"
              placeholder="Tìm kiếm sách..."
              className="rounded-full text-sm w-full outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent pr-12 bg-white border border-gray-200 py-3 px-5 shadow-sm hover:shadow-md transition-shadow duration-200"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 bg-[#4f0f87] rounded-full text-white hover:bg-[#51348f] transition-all duration-200 hover:scale-105"
            >
              <Search size={16} />
            </button>
          </form>
        </div>

        <div className="flex items-center space-x-8 text-gray-600 relative">
          <div className="hidden lg:flex items-center space-x-6">
            <a href="#" className="text-[#51348f] hover:text-[#9966cb] transition-colors duration-200 font-medium">
              Chính sách bảo mật
            </a>
            <a href="#" className="text-[#51348f] hover:text-[#9966cb] transition-colors duration-200 font-medium">
              Bảo hành
            </a>
            <a href="#" className="text-[#51348f] hover:text-[#9966cb] transition-colors duration-200 font-medium">
              Vận chuyển
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to={"/cart"}
              className="hover:text-[#51348f] text-[#4f0f87] transition-all duration-200 hover:scale-110 p-2 rounded-full hover:bg-purple-50"
            >
              <ShoppingCart size={20} />
            </Link>
            <div className="w-px h-6 bg-gray-300"></div>
            <a
              href="#"
              className="hover:text-[#51348f] text-[#4f0f87] transition-all duration-200 hover:scale-110 p-2 rounded-full hover:bg-purple-50"
            >
              <Heart size={20} />
            </a>
            <div className="w-px h-6 bg-gray-300"></div>

            <div className="relative" ref={menuRef}>
              <div
                onClick={() => setOpenUserMenu((prev) => !prev)}
                className="hover:text-[#51348f] text-[#4f0f87] transition-all duration-200 hover:scale-110 cursor-pointer p-2 rounded-full hover:bg-purple-50"
              >
                <User size={20} />
              </div>
              {openUserMenu && (
                <div className="absolute top-full right-0 mt-3 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                  {user ? (
                    <>
                      <div className="px-5 py-4 bg-gradient-to-r from-[#51348f] to-[#9966cb] text-white font-semibold">
                        <div className="text-sm opacity-90">Xin chào,</div>
                        <div className="truncate">{user.fullname || user.email}</div>
                      </div>
                      <Link
                        to="/order"
                        className="block px-5 py-3 text-gray-700 hover:bg-purple-50 hover:text-[#51348f] transition-colors duration-200 border-b border-gray-100"
                      >
                        Đơn hàng của tôi
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-5 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                      >
                        Đăng xuất
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block px-5 py-3 text-gray-700 hover:bg-purple-50 hover:text-[#51348f] transition-colors duration-200 border-b border-gray-100"
                      >
                        Đăng nhập
                      </Link>
                      <Link
                        to="/register"
                        className="block px-5 py-3 text-gray-700 hover:bg-purple-50 hover:text-[#51348f] transition-colors duration-200"
                      >
                        Đăng ký
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-8 py-4 border-b border-purple-100 bg-white">
        <div className="flex items-center space-x-8 text-gray-700">
          <a
            href="#"
            className="text-[#51348f] hover:text-[#9966cb] transition-colors duration-200 font-medium relative group"
          >
            Nổi bật
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#9966cb] transition-all duration-200 group-hover:w-full"></span>
          </a>
          <a
            href="#"
            className="text-[#51348f] hover:text-[#9966cb] transition-colors duration-200 font-medium relative group"
          >
            Tin tức
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#9966cb] transition-all duration-200 group-hover:w-full"></span>
          </a>
          <a
            href="#"
            className="text-[#51348f] hover:text-[#9966cb] transition-colors duration-200 font-medium relative group"
          >
            Hướng dẫn
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#9966cb] transition-all duration-200 group-hover:w-full"></span>
          </a>
          <a
            href="#"
            className="text-[#51348f] hover:text-[#9966cb] transition-colors duration-200 font-medium relative group"
          >
            Nhà xuất bản
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#9966cb] transition-all duration-200 group-hover:w-full"></span>
          </a>
          <a
            href="#"
            className="text-[#51348f] hover:text-[#9966cb] transition-colors duration-200 font-medium relative group"
          >
            Đăng ký nhận thông tin
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#9966cb] transition-all duration-200 group-hover:w-full"></span>
          </a>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-[#7644a4] font-medium">
            <Phone size={16} className="transform scale-x-[-1]" />
            <span>+84 338 538 663</span>
          </div>
          <button className="border-2 border-[#51348f] text-[#7644a4] bg-white px-6 py-2 rounded-full hover:bg-[#51348f] hover:text-white transition-all duration-200 font-medium hover:shadow-md">
            Liên hệ ngay
          </button>
        </div>
      </div>
    </div>
  )
}

export default Header