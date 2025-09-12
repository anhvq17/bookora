import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ShoppingCart, Heart, User, Phone, Search } from "lucide-react"

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
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("user")
    setUser(null)
    setOpenUserMenu(false)
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
        </div>

        <div className="flex items-center space-x-24">
          <form
            className="relative w-[600px]"
            onSubmit={(e) => {
              e.preventDefault()
            }}
          >
            <input
              type="text"
              placeholder="Tìm kiếm sách"
              className="rounded-full text-sm w-full outline-none focus:ring-1 focus:ring-purple-100 focus:border-transparent pr-12 bg-white border border-gray-200 py-3 px-5 shadow-sm hover:shadow-md transition-shadow duration-200"
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white text-[#4f0f87] hover:text-[#51348f] hover:border-white transition-all duration-200 hover:scale-110 p-1 rounded-full"
            >
              <Search size={20} />
            </button>
          </form>
        </div>

        <div className="flex items-center space-x-8 text-gray-600 relative">
          <div className="flex items-center space-x-4">
            <Link
              to={"/cart"}
              className="hover:text-[#51348f] text-[#4f0f87] transition-all duration-200 hover:scale-110 p-2 rounded-full"
            >
              <ShoppingCart size={20} />
            </Link>
            <div className="w-px h-6 bg-gray-300"></div>
            <a
              href="#"
              className="hover:text-[#51348f] text-[#4f0f87] transition-all duration-200 hover:scale-110 p-2 rounded-full"
            >
              <Heart size={20} />
            </a>
            <div className="w-px h-6 bg-gray-300"></div>

            <div className="relative" ref={menuRef}>
              <div
                onClick={() => setOpenUserMenu((prev) => !prev)}
                className="hover:text-[#51348f] text-[#4f0f87] transition-all duration-200 hover:scale-110 cursor-pointer p-2 rounded-full"
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
                        to="/account"
                        onClick={() => setOpenUserMenu(false)}
                        className="block px-5 py-3 text-gray-700 hover:bg-purple-50 hover:text-[#51348f] transition-colors duration-200 border-b border-gray-100"
                      >
                        Tài khoản
                      </Link>
                      <Link
                        to="/order"
                        onClick={() => setOpenUserMenu(false)}
                        className="block px-5 py-3 text-gray-700 hover:bg-purple-50 hover:text-[#51348f] transition-colors duration-200 border-b border-gray-100"
                      >
                        Đơn hàng của tôi
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-5 py-3 bg-white text-gray-700 hover:bg-purple-50 hover:text-[#51348f] border-b border-gray-100 hover:border-white transition-colors duration-200"
                      >
                        Đăng xuất
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setOpenUserMenu(false)}
                        className="block px-5 py-3 text-gray-700 hover:bg-purple-50 hover:text-[#51348f] transition-colors duration-200 border-b border-gray-100"
                      >
                        Đăng nhập
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setOpenUserMenu(false)}
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
          <div className="flex items-center space-x-2 text-[#4f0f87] font-medium">
            <Phone size={16} className="transform scale-x-[-1]" />
            <span>0977 907 877</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header