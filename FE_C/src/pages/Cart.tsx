import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Minus, X } from "lucide-react";
import axios from "axios";

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  selectedVolume?: string;
  selectedScent?: string;
  image: string;
}

interface ShippingInfo {
  address: {
    detail: string;
    district: string;
    city: string;
  };
  note: string;
}

const Cart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    address: {
      detail: "",
      district: "",
      city: "",
    },
    note: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    const storedToken = localStorage.getItem("accessToken")?.trim() || null;
    const shippingRaw = localStorage.getItem("shippingInfo");

    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        setCart(parsedCart);
        setSelectedIds([]);
      } catch (err) {
        console.error("Lỗi parse localStorage:", err);
      }
    }

    if (shippingRaw) {
      try {
        setShippingInfo(JSON.parse(shippingRaw));
      } catch (err) {
        console.error("Lỗi parse shipping info:", err);
      }
    }

    setToken(storedToken);
  }, []);

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    setSelectedIds((prev) => prev.filter((id) => newCart.some((item) => item._id === id)));
  };

  const updateQuantity = (id: string, value: number) => {
    if (value < 1) return;
    const newCart = cart.map(item =>
      item._id === id ? { ...item, quantity: Math.min(50, value) } : item
    );
    updateCart(newCart);
  };

  const removeItem = (id: string) => {
    const newCart = cart.filter(item => item._id !== id);
    updateCart(newCart);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === cart.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(cart.map(item => item._id));
    }
  };

  const selectedItems = cart.filter(item => selectedIds.includes(item._id));
  const subtotal = selectedItems.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0
  );

  const formatFullAddress = (address?: ShippingInfo["address"]): string => {
    if (!address) return "Chưa có địa chỉ";
    const { detail, district, city } = address;
    return [detail, district, city].filter(Boolean).join(", ");
  };

  const handleCheckout = async () => {
    if (selectedItems.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để đặt hàng.");
      return;
    }

    if (!token) {
      alert("Bạn cần đăng nhập để đặt hàng.");
      navigate("/login");
      return;
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
        }
      );

      alert("Đặt hàng thành công!");
      const remaining = cart.filter((item) => !selectedIds.includes(item._id));
      localStorage.setItem("cart", JSON.stringify(remaining));
      navigate("/order");
    } catch (error: any) {
      console.error("Lỗi đặt hàng:", error);
      alert(
        error?.response?.data?.message || "Đặt hàng thất bại. Vui lòng thử lại."
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-medium mb-8 text-black">Giỏ hàng của bạn</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          {cart.length === 0 ? (
            <div className="text-center py-12 border rounded-lg">
              <p className="text-gray-500">Giỏ hàng của bạn trống.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  checked={selectedIds.length === cart.length}
                  onChange={toggleSelectAll}
                  className="mr-3"
                />
                <label className="font-medium text-black">Chọn tất cả</label>
              </div>

              <div className="space-y-6">
                {cart.map((item) => (
                  <div key={item._id} className="flex border rounded-lg p-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item._id)}
                        onChange={() => toggleSelect(item._id)}
                        className="mr-4"
                      />
                      <div className="w-24 h-24 bg-gray-100 rounded overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "https://placehold.co/100x150?text=No+Image";
                          }}
                        />
                      </div>
                    </div>
                    <div className="ml-4 flex-grow">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-lg text-black">{item.name}</h3>
                        <button
                          onClick={() => removeItem(item._id)}
                          className="bg-[#f9fafb] rounded-full"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center border rounded-full overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="px-3 py-1 text-black bg-[#f9fafb]"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <div className="px-4 py-1 text-black text-sm border-l border-r">
                            {item.quantity}
                          </div>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="px-3 py-1 text-black bg-[#f9fafb]"
                            disabled={item.quantity >= 50}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="font-bold text-red-600">
                          {(item.price * item.quantity).toLocaleString("vi-VN")}
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
          <div className="border rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-black">Tóm tắt đơn hàng</h2>

            <div className="mb-4">
              <h3 className="font-semibold text-black mb-1">Địa chỉ giao hàng</h3>
              <p className="text-sm text-gray-700">
                {formatFullAddress(shippingInfo.address)}
              </p>
              {shippingInfo.note && (
                <p className="text-sm text-gray-500 italic mt-1">
                  Ghi chú: {shippingInfo.note}
                </p>
              )}
              {!shippingInfo.address?.detail && (
                <Link
                  to="/checkout"
                  className="inline-block mt-2 text-sm text-blue-600 hover:underline"
                >
                  Cập nhật địa chỉ tại đây
                </Link>
              )}
            </div>

            <div className="space-y-4 mb-6">
              <div className="border-t pt-4 flex justify-between font-semibold">
                <span className="font-bold text-red-600">Thành tiền</span>
                <span className="font-bold text-red-600">
                  {subtotal.toLocaleString("vi-VN")}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className={`w-full block text-center px-6 py-3 rounded font-medium transition ${
                selectedItems.length > 0
                  ? "bg-[#4f0f87] text-white hover:bg-[#51348f]"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={selectedItems.length === 0}
            >
              Tiến hành Thanh toán
            </button>

            <Link
              to="/"
              className="w-full block text-center px-6 py-3 text-gray-900 hover:text-gray-900 font-medium mt-2"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;