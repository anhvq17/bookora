import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface ShippingInfo {
  name: string;
  phone: string;
  address: {
    detail: string;
    district: string;
    city: string;
  };
  note: string;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [shipping, setShipping] = useState<ShippingInfo>({
    name: "",
    phone: "",
    address: {
      detail: "",
      district: "",
      city: "",
    },
    note: "",
  });

  useEffect(() => {
    const cartRaw = localStorage.getItem("cart");
    if (cartRaw) {
      try {
        setCart(JSON.parse(cartRaw));
      } catch (err) {
        console.error("Lỗi parse cart:", err);
      }
    }

    const userRaw = localStorage.getItem("user");
    if (userRaw) {
      try {
        const user = JSON.parse(userRaw);
        setShipping((prev) => ({
          ...prev,
          name: user.fullname || "",
          phone: user.phoneNumber || "",
        }));
      } catch (err) {
        console.error("Lỗi parse user:", err);
      }
    }

    // ✅ Đọc shipping info đã lưu nếu có
    const shippingRaw = localStorage.getItem("shippingInfo");
    if (shippingRaw) {
      try {
        setShipping(JSON.parse(shippingRaw));
      } catch (err) {
        console.error("Lỗi parse shipping info:", err);
      }
    }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (["detail", "district", "city"].includes(name)) {
      setShipping((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value,
        },
      }));
    } else {
      setShipping((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Kiểm tra thông tin đầy đủ
    if (
      !shipping.name ||
      !shipping.phone ||
      !shipping.address.detail ||
      !shipping.address.district ||
      !shipping.address.city
    ) {
      alert("Vui lòng nhập đầy đủ thông tin giao hàng.");
      return;
    }

    // ✅ Lưu thông tin vào localStorage
    localStorage.setItem("shippingInfo", JSON.stringify(shipping));

    alert("Đã lưu thông tin giao hàng!");
    navigate("/cart");
  };

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const total = subtotal;

  return (
    <main className="container mx-auto px-4 py-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-[#4f0f87] mb-4 border-b-2 border-[#4f0f87] pb-2">
            THÔNG TIN GIAO HÀNG
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1 font-medium">Họ và tên</label>
              <input
                type="text"
                name="name"
                value={shipping.name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-4 py-2"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Số điện thoại</label>
              <input
                type="text"
                name="phone"
                value={shipping.phone}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-4 py-2"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Địa chỉ (chi tiết)</label>
              <input
                type="text"
                name="detail"
                value={shipping.address.detail}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-4 py-2"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Quận/Huyện</label>
              <input
                type="text"
                name="district"
                value={shipping.address.district}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-4 py-2"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Tỉnh/Thành phố</label>
              <input
                type="text"
                name="city"
                value={shipping.address.city}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-4 py-2"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Ghi chú</label>
              <textarea
                name="note"
                rows={3}
                value={shipping.note}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-4 py-2"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#4f0f87] text-white py-2 rounded hover:bg-[#51348f]"
            >
              Xác nhận đặt hàng
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-[#4f0f87] mb-4 border-b-2 border-[#4f0f87] pb-2">
            THÔNG TIN ĐẶT HÀNG
          </h2>
          {cart.map((item) => (
            <div key={item._id} className="flex justify-between items-center mb-4">
              <div className="flex gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-16 object-cover rounded"
                />
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-500">x{item.quantity}</div>
                </div>
              </div>
              <span className="font-semibold text-right">
                {(item.price * item.quantity).toLocaleString("vi-VN")}₫
              </span>
            </div>
          ))}

          <hr className="my-4" />
          <div className="flex justify-between font-semibold">
            <span>Thành tiền</span>
            <span>{subtotal.toLocaleString("vi-VN")}₫</span>
          </div>
          <div className="flex justify-between">
            <span>Phí vận chuyển</span>
            <span>Miễn phí</span>
          </div>
          <hr className="my-4" />
          <div className="flex justify-between text-xl text-red-500 font-bold">
            <span>Tổng tiền</span>
            <span>{total.toLocaleString("vi-VN")}₫</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Checkout;