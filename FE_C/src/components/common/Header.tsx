import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ShoppingCart, Heart, User, Phone, Search } from "lucide-react"
import api from "../../configs/axios.customize"

type Props = {}

const Header = (_props: Props) => {
  const [openUserMenu, setOpenUserMenu] = useState(false)
  const [user, setUser] = useState<any>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const nav = useNavigate()
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [isSuggestOpen, setIsSuggestOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const searchDebounceRef = useRef<number | null>(null)
  const searchBoxRef = useRef<HTMLDivElement>(null)

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
      const target = event.target as Node
      const clickedOutsideMenu = menuRef.current && !menuRef.current.contains(target)
      const clickedOutsideSearch = searchBoxRef.current && !searchBoxRef.current.contains(target)
      if (clickedOutsideMenu) {
        setOpenUserMenu(false)
      }
      if (clickedOutsideSearch) {
        setIsSuggestOpen(false)
      }
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  useEffect(() => {
    if (searchDebounceRef.current) {
      window.clearTimeout(searchDebounceRef.current)
    }
    if (!query.trim()) {
      setSuggestions([])
      setIsSuggestOpen(false)
      return
    }
    setIsSearching(true)
    searchDebounceRef.current = window.setTimeout(async () => {
      try {
        const res = await api.get("api/products", { params: { search: query.trim() } })
        let items: any[] = []
        if (res.data && res.data.data && Array.isArray(res.data.data)) {
          items = res.data.data
        } else if (Array.isArray(res.data)) {
          items = res.data
        }
        if (items.length === 0) {
          const fallback = await api.get("api/products")
          const all = fallback.data?.data && Array.isArray(fallback.data.data) ? fallback.data.data : Array.isArray(fallback.data) ? fallback.data : []
          items = all.filter((p: any) => (p.name || "").toLowerCase().includes(query.trim().toLowerCase()))
        }
        setSuggestions(items.slice(0, 6))
        setIsSuggestOpen(true)
      } catch (_e) {
        setSuggestions([])
        setIsSuggestOpen(false)
      } finally {
        setIsSearching(false)
      }
    }, 300)
    return () => {
      if (searchDebounceRef.current) {
        window.clearTimeout(searchDebounceRef.current)
      }
    }
  }, [query])

  const handleSubmitSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const q = query.trim()
    if (!q) return
    setIsSuggestOpen(false)
    nav(`/search?q=${encodeURIComponent(q)}`)
  }

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("user")
    setUser(null)
    setOpenUserMenu(false)
    nav("/login")
  }

  return (
    <div className="text-sm font-sans shadow-sm">
      <div className="mx-auto max-w-7xl w-full flex items-center justify-between px-8 py-4 border-b bg-gradient-to-r from-white to-gray-50">
        <div className="flex items-center space-x-4">
          <Link
            to={"/"}
            className="font-allura text-5xl text-black hover:text-black transition-colors duration-200"
          >
            Book<span className="text-[#4f0f87]">ora</span>
          </Link>
        </div>

        <div className="flex items-center space-x-24">
          <div className="relative w-[600px]" ref={searchBoxRef}>
            <form
              onSubmit={handleSubmitSearch}
            >
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => suggestions.length && setIsSuggestOpen(true)}
                type="text"
                placeholder="Tìm kiếm sách"
                className="rounded-full text-sm w-full outline-none focus:ring-1 focus:ring-purple-100 focus:border-transparent pr-12 bg-white border border-gray-200 py-3 px-5 shadow-sm hover:shadow-md transition-shadow duration-200"
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white text-[#4f0f87] hover:text-[#51348f] hover:border-white transition-all duration-200 hover:scale-110 p-1 rounded-full"
                aria-label="Tìm kiếm"
              >
                <Search size={20} />
              </button>
            </form>
            {isSuggestOpen && (
              <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                {isSearching && (
                  <div className="px-4 py-3 text-sm text-gray-500">Đang tìm kiếm...</div>
                )}
                {!isSearching && suggestions.length === 0 && (
                  <div className="px-4 py-3 text-sm text-gray-500">Không có kết quả</div>
                )}
                {!isSearching && suggestions.length > 0 && (
                  <ul className="max-h-80 overflow-auto">
                    {suggestions.map((item) => (
                      <li key={item._id}>
                        <Link
                          to={`/productdetails/${item._id}`}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-purple-50 transition-colors text-sm"
                          onClick={() => setIsSuggestOpen(false)}
                        >
                          <img
                            src={item.imageUrl || "/placeholder.svg"}
                            onError={(e) => { (e.currentTarget as HTMLImageElement).src = "https://placehold.co/40x40?text=No" }}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded-md border border-gray-100"
                          />
                          <div className="min-w-0">
                            <div className="text-gray-900 truncate">{item.name}</div>
                            <div className="text-gray-500 text-xs">{(item.price || 0).toLocaleString()}</div>
                          </div>
                        </Link>
                      </li>
                    ))}
                    <li className="border-t border-gray-100">
                      <button
                        onClick={() => handleSubmitSearch()}
                        className="w-full text-left px-4 py-3 text-[#4f0f87] hover:bg-purple-50 text-sm font-medium"
                      >
                        Xem tất cả kết quả cho “{query}”
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            )}
          </div>
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
            <Link
              to="/wishlist"
              className="hover:text-[#51348f] text-[#4f0f87] transition-all duration-200 hover:scale-110 p-2 rounded-full"
            >
              <Heart size={20} />
            </Link>
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

      <div className="mx-auto max-w-7xl w-full flex items-center justify-between px-8 py-4 border-b border-purple-100 bg-white">
        <div className="flex items-center space-x-8 text-gray-700">
          <a
            href="#"
            className="text-[#4f0f87] hover:text-[#4f0f87] transition-colors duration-200 font-medium relative group"
          >
            Nổi bật
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#4f0f87] transition-all duration-200 group-hover:w-full"></span>
          </a>
          <a
            href="#"
            className="text-[#4f0f87] hover:text-[#4f0f87] transition-colors duration-200 font-medium relative group"
          >
            Tin tức
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#4f0f87] transition-all duration-200 group-hover:w-full"></span>
          </a>
          <a
            href="#"
            className="text-[#4f0f87] hover:text-[#4f0f87] transition-colors duration-200 font-medium relative group"
          >
            Hướng dẫn
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#4f0f87] transition-all duration-200 group-hover:w-full"></span>
          </a>
          <a
            href="#"
            className="text-[#4f0f87] hover:text-[#4f0f87] transition-colors duration-200 font-medium relative group"
          >
            Nhà xuất bản
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#4f0f87] transition-all duration-200 group-hover:w-full"></span>
          </a>
          <a
            href="#"
            className="text-[#4f0f87] hover:text-[#4f0f87] transition-colors duration-200 font-medium relative group"
          >
            Đăng ký nhận thông tin
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#4f0f87] transition-all duration-200 group-hover:w-full"></span>
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