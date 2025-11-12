import { useState } from "react"

interface UserProfile {
  name: string
  email: string
  phone: string
  birthDate: string
  gender: string
}

interface Address {
  id: number
  name: string
  phone: string
  address: string
  isDefault: boolean
}

interface Order {
  id: string
  date: string
  status: string
  total: number
  items: number
}

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState<UserProfile>({
    name: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    phone: "0123456789",
    birthDate: "1990-01-01",
    gender: "Nam",
  })

  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 1,
      name: "Nguyễn Văn A",
      phone: "0123456789",
      address: "123 Đường ABC, Phường XYZ, Quận 1, TP.HCM",
      isDefault: true,
    },
    {
      id: 2,
      name: "Nguyễn Văn A",
      phone: "0123456789",
      address: "456 Đường DEF, Phường GHI, Quận 3, TP.HCM",
      isDefault: false,
    },
  ])

  const [orders] = useState<Order[]>([
    { id: "ORD001", date: "2024-01-15", status: "Đã giao", total: 299000, items: 2 },
    { id: "ORD002", date: "2024-01-10", status: "Đang giao", total: 450000, items: 1 },
    { id: "ORD003", date: "2024-01-05", status: "Đã hủy", total: 150000, items: 3 },
  ])

  const handleSaveProfile = () => {
    setIsEditing(false)
  }

  const handleSetDefaultAddress = (id: number) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      })),
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Đã giao":
        return "bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium"
      case "Đang giao":
        return "bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium"
      case "Đã hủy":
        return "bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium"
      default:
        return "bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium"
    }
  }

  const UserIcon = () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  )

  const MapPinIcon = () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )

  const PackageIcon = () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />
    </svg>
  )

  const LockIcon = () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  )

  const SettingsIcon = () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )

  const EditIcon = () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  )

  const SaveIcon = () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
      />
    </svg>
  )

  const XIcon = () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )

  const PlusIcon = () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  )

  const TrashIcon = () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  )

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border sticky top-4">
                <div className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="h-12 w-12 bg-[#4f0f87] text-white rounded-full flex items-center justify-center font-semibold">
                      {profile.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{profile.name}</h3>
                      <p className="text-sm text-gray-500">{profile.email}</p>
                    </div>
                  </div>

                  <nav className="space-y-2">
                    <button
                      onClick={() => setActiveTab("profile")}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === "profile" ? "bg-[#4f0f87] text-white" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <UserIcon />
                      <span>Hồ sơ</span>
                    </button>

                    <button
                      onClick={() => setActiveTab("addresses")}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === "addresses" ? "bg-[#4f0f87] text-white" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <MapPinIcon />
                      <span>Địa chỉ</span>
                    </button>

                    <button
                      onClick={() => setActiveTab("orders")}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === "orders" ? "bg-[#4f0f87] text-white" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <PackageIcon />
                      <span>Đơn hàng</span>
                    </button>

                    <button
                      onClick={() => setActiveTab("password")}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === "password" ? "bg-[#4f0f87] text-white" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <LockIcon />
                      <span>Đổi mật khẩu</span>
                    </button>

                    <button
                      onClick={() => setActiveTab("settings")}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === "settings" ? "bg-[#4f0f87] text-white" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <SettingsIcon />
                      <span>Cài đặt</span>
                    </button>
                  </nav>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="p-6 border-b flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Hồ sơ của tôi</h2>
                    <button
                      onClick={() => (isEditing ? setIsEditing(false) : setIsEditing(true))}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        isEditing
                          ? "border border-gray-300 text-gray-700 hover:bg-gray-50"
                          : "bg-[#4f0f87] text-white hover:bg-[#3d0c6b]"
                      }`}
                    >
                      {isEditing ? <XIcon /> : <EditIcon />}
                      <span>{isEditing ? "Hủy" : "Chỉnh sửa"}</span>
                    </button>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                        <input
                          type="text"
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          disabled={!isEditing}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4f0f87] ${
                            !isEditing ? "bg-gray-50" : ""
                          }`}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          disabled={!isEditing}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4f0f87] ${
                            !isEditing ? "bg-gray-50" : ""
                          }`}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                        <input
                          type="text"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          disabled={!isEditing}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4f0f87] ${
                            !isEditing ? "bg-gray-50" : ""
                          }`}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Ngày sinh</label>
                        <input
                          type="date"
                          value={profile.birthDate}
                          onChange={(e) => setProfile({ ...profile, birthDate: e.target.value })}
                          disabled={!isEditing}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4f0f87] ${
                            !isEditing ? "bg-gray-50" : ""
                          }`}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Giới tính</label>
                        <select
                          value={profile.gender}
                          onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                          disabled={!isEditing}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4f0f87] ${
                            !isEditing ? "bg-gray-50" : ""
                          }`}
                        >
                          <option value="Nam">Nam</option>
                          <option value="Nữ">Nữ</option>
                          <option value="Khác">Khác</option>
                        </select>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex justify-end">
                        <button
                          onClick={handleSaveProfile}
                          className="flex items-center space-x-2 bg-[#4f0f87] text-white px-4 py-2 rounded-lg hover:bg-[#3d0c6b] transition-colors"
                        >
                          <SaveIcon />
                          <span>Lưu thay đổi</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === "addresses" && (
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="p-6 border-b flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Địa chỉ của tôi</h2>
                    <button className="flex items-center space-x-2 bg-[#4f0f87] text-white px-4 py-2 rounded-lg hover:bg-[#3d0c6b] transition-colors">
                      <PlusIcon />
                      <span>Thêm địa chỉ mới</span>
                    </button>
                  </div>
                  <div className="p-6 space-y-4">
                    {addresses.map((address) => (
                      <div key={address.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold">{address.name}</span>
                              {address.isDefault && (
                                <span className="bg-[#4f0f87] text-white px-2 py-1 rounded-full text-xs font-medium">
                                  Mặc định
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600">{address.phone}</p>
                            <p className="text-gray-700">{address.address}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                              <EditIcon />
                            </button>
                            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                              <TrashIcon />
                            </button>
                          </div>
                        </div>

                        {!address.isDefault && (
                          <button
                            onClick={() => handleSetDefaultAddress(address.id)}
                            className="border border-[#4f0f87] text-[#4f0f87] px-4 py-2 rounded-lg hover:bg-[#4f0f87] hover:text-white transition-colors"
                          >
                            Đặt làm mặc định
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === "orders" && (
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="p-6 border-b">
                    <h2 className="text-lg font-semibold">Đơn hàng của tôi</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-4">
                              <span className="font-semibold">#{order.id}</span>
                              <span className={getStatusColor(order.status)}>{order.status}</span>
                            </div>
                            <span className="text-sm text-gray-500">{order.date}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">{order.items} sản phẩm</span>
                            <div className="flex items-center space-x-4">
                              <span className="font-semibold text-[#4f0f87]">
                                {order.total.toLocaleString("vi-VN")}
                              </span>
                              <button className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                                Xem chi tiết
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Password Tab */}
              {activeTab === "password" && (
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="p-6 border-b">
                    <h2 className="text-lg font-semibold">Đổi mật khẩu</h2>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Mật khẩu hiện tại</label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4f0f87]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Mật khẩu mới</label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4f0f87]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu mới</label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4f0f87]"
                      />
                    </div>

                    <button className="bg-[#4f0f87] text-white px-6 py-2 rounded-lg hover:bg-[#3d0c6b] transition-colors">
                      Cập nhật mật khẩu
                    </button>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="p-6 border-b">
                    <h2 className="text-lg font-semibold">Cài đặt tài khoản</h2>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Nhận thông báo email</h4>
                        <p className="text-sm text-gray-500">Nhận email về đơn hàng và khuyến mãi</p>
                      </div>
                      <input type="checkbox" className="w-4 h-4 text-[#4f0f87] rounded" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Nhận thông báo SMS</h4>
                        <p className="text-sm text-gray-500">Nhận SMS về trạng thái đơn hàng</p>
                      </div>
                      <input type="checkbox" className="w-4 h-4 text-[#4f0f87] rounded" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Hiển thị thông tin công khai</h4>
                        <p className="text-sm text-gray-500">Cho phép người khác xem hồ sơ của bạn</p>
                      </div>
                      <input type="checkbox" className="w-4 h-4 text-[#4f0f87] rounded" />
                    </div>

                    <div className="pt-4 border-t">
                      <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors">
                        Xóa tài khoản
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}