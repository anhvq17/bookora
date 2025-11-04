import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Plus, Minus, X, ShoppingBag, Truck } from "lucide-react"
import axios from "axios"

interface CartItem {
  _id: string
  name: string
  price: number
  quantity: number
  selectedVolume?: string
  selectedScent?: string
  image: string
}

interface ShippingInfo {
  address: {
    detail: string
    district: string
    city: string
  }
  note: string
}

const Cart = () => {
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [token, setToken] = useState<string | null>(null)
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    address: {
      detail: "",
      district: "",
      city: "",
    },
    note: "",
  })

  const navigate = useNavigate()

  useEffect(() => {
    const storedCart = localStorage.getItem("cart")
    const storedToken = localStorage.getItem("accessToken")?.trim() || null
    const shippingRaw = localStorage.getItem("shippingInfo")

    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart)
        setCart(parsedCart)
        setSelectedIds([])
      } catch (err) {
        console.error("Lỗi parse localStorage:", err)
      }
    }

    if (shippingRaw) {
      try {
        setShippingInfo(JSON.parse(shippingRaw))
      } catch (err) {
        console.error("Lỗi parse shipping info:", err)
      }
    }

    setToken(storedToken)
  }, [])

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart)
    localStorage.setItem("cart", JSON.stringify(newCart))
    setSelectedIds((prev) => prev.filter((id) => newCart.some((item) => item._id === id)))
  }

  const updateQuantity = (id: string, value: number) => {
    if (value < 1) return
    const newCart = cart.map((item) => (item._id === id ? { ...item, quantity: Math.min(50, value) } : item))
    updateCart(newCart)
  }

  const removeItem = (id: string) => {
    const newCart = cart.filter((item) => item._id !== id)
    updateCart(newCart)
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]))
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === cart.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(cart.map((item) => item._id))
    }
  }

  const selectedItems = cart.filter((item) => selectedIds.includes(item._id))
  const subtotal = selectedItems.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0,
  )

  const formatFullAddress = (address?: ShippingInfo["address"]): string => {
    if (!address) return "Chưa có địa chỉ"
    const { detail, district, city } = address
    return [detail, district, city].filter(Boolean).join(", ")
  }

  const handleCheckout = async () => {
    if (selectedItems.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để đặt hàng.")
      return
    }

    if (!token) {
      alert("Bạn cần đăng nhập để đặt hàng.")
      navigate("/login")
      return
    }

    try {
      await axios.post(
        "http://localhost:8888/api/orders",
        {
          items: selectedItems.map((item) => ({
            product_id: item._id,
            quantity: item.quantity,
            price: item.price,
            selectedVolume: item.selectedVolume,
            selectedScent: item.selectedScent,
          })),
          totalAmount: subtotal,
          address: shippingInfo.address,
          note: shippingInfo.note,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      alert("Đặt hàng thành công!")
      const remaining = cart.filter((item) => !selectedIds.includes(item._id))
      localStorage.setItem("cart", JSON.stringify(remaining))
      navigate("/order")
    } catch (error: any) {
      console.error("Lỗi đặt hàng:", error)
      alert(error?.response?.data?.message || "Đặt hàng thất bại. Vui lòng thử lại.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-2">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-[#75479e] to-[#4f0f87] rounded-lg">
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Giỏ hàng của bạn</h1>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            {cart.length === 0 ? (
              <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 py-16 px-6 text-center">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-lg text-gray-500 font-medium">Giỏ hàng của bạn trống.</p>
                <p className="text-gray-400 mt-1">Hãy thêm sản phẩm để tiếp tục mua sắm</p>
              </div>
            ) : (
              <>
                <div className="bg-white rounded-xl p-4 mb-6 border border-gray-200 shadow-sm flex items-center hover:shadow-md transition-shadow">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === cart.length && cart.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <label className="font-semibold text-gray-700 ml-3 cursor-pointer flex-1">
                    Chọn tất cả ({cart.length} sản phẩm)
                  </label>
                </div>

                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item._id}
                      className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex gap-4"
                    >
                      <div className="flex items-start gap-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(item._id)}
                          onChange={() => toggleSelect(item._id)}
                          className="w-4 h-4 mt-2 cursor-pointer"
                        />

                        <div className="w-28 h-28 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.onerror = null
                              e.currentTarget.src = "https://placehold.co/112x112?text=No+Image"
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">SKU: {item._id.slice(0, 8)}</p>
                          </div>
                          <button
                            onClick={() => removeItem(item._id)}
                            className="text-red-500 bg-white border-red-500 hover:text-white hover:border-red-600 transition-colors p-2 hover:bg-red-600 rounded-lg"
                            title="Xóa sản phẩm"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="flex justify-between items-end">
                          <div className="flex items-center rounded-xl">
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              className="text-black bg-white border-gray-500 hover:text-white hover:border-black transition-colors p-2 hover:bg-black rounded-lg"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-2 h-2" />
                            </button>
                            <div className="px-3 py-2 text-center text-gray-900 min-w-12">
                              {item.quantity}
                            </div>
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              className="text-black bg-white border-gray-500 hover:text-white hover:border-black transition-colors p-2 hover:bg-black rounded-lg"
                              disabled={item.quantity >= 50}
                            >
                              <Plus className="w-2 h-2" />
                            </button>
                          </div>

                          <div className="text-right">
                            <p className="text-xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                              {(item.price * item.quantity).toLocaleString("vi-VN")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg sticky top-6">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-gradient-to-br from-[#75479e] to-[#4f0f87] rounded-lg">
                  <Truck className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Tóm tắt đơn hàng</h2>
              </div>

              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="text-gray-900 mb-3 flex items-center gap-2">
                  Địa chỉ giao hàng
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-lg mb-2">
                  {formatFullAddress(shippingInfo.address)}
                </p>
                {shippingInfo.note && (
                  <p className="text-xs text-gray-500 italic bg-blue-50 p-2 rounded-lg">
                    📝 Ghi chú: {shippingInfo.note}
                  </p>
                )}
                {!shippingInfo.address?.detail && (
                  <Link
                    to="/checkout"
                    className="inline-block mt-3 text-sm font-semibold text-[#4f0f87] hover:text-[#693299] transition-colors"
                  >
                    ➜ Cập nhật địa chỉ
                  </Link>
                )}
              </div>

              <div className="mb-6 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Tạm tính</span>
                  <span className="font-semibold text-gray-900">{subtotal.toLocaleString("vi-VN")}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Số lượng</span>
                  <span className="font-semibold text-gray-900">{selectedItems.length} sản phẩm</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 mb-6 border border-purple-200">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#4f0f87]">Thành tiền</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-[#693299] to-[#4f0f87] bg-clip-text text-transparent">
                    {subtotal.toLocaleString("vi-VN")}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className={`w-full px-6 py-4 rounded-xl font-bold text-base transition-all duration-300 mb-3 flex items-center justify-center gap-2 ${
                  selectedItems.length > 0
                    ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:shadow-lg hover:shadow-purple-200 hover:-translate-y-0.5"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
                disabled={selectedItems.length === 0}
              >
                <span>Tiến hành Thanh toán</span>
              </button>

              <Link
                to="/"
                className="w-full block text-center px-6 py-3 text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300"
              >
                ← Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart