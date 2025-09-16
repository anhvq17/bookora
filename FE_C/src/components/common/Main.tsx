import type React from "react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

type Product = {
  _id: string
  name: string
  price: number
  description?: string
  category?: string
  imageUrl: string
  stock: number
  status?: string
}

const ProductCard = ({ product }: { product: Product }) => {
  const isOutOfStock = product.stock === 0 || product.status === "Hết"
  const discountPercent = Math.floor(Math.random() * 30) + 10

  return (
    <Link to={`/productdetails/${product._id}`} className="block group">
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1">
        <div className="relative overflow-hidden bg-gray-50">
          <img
            src={product.imageUrl || "/placeholder.svg"}
            alt={product.name}
            className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.onerror = null
              e.currentTarget.src = "https://placehold.co/300x300?text=No+Image"
            }}
          />

          <div className="absolute top-3 left-3">
            <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">
              -{discountPercent}%
            </span>
          </div>

          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white text-gray-900 text-sm font-semibold px-4 py-2 rounded-full">Hết hàng</span>
            </div>
          )}

          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex flex-col space-y-2">
              <button className="bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-md transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <button className="bg-white/90 hover:bg-white text-gray-700 p-2 rounded-full shadow-md transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm leading-5 group-hover:text-[#4f0f87] transition-colors duration-200">
            {product.name}
          </h3>

          <div className="flex items-center mb-3">
            <div className="flex text-yellow-400 text-sm">{"★".repeat(5)}</div>
            <span className="text-xs text-gray-500 ml-1">(4.8)</span>
            <span className="text-xs text-gray-400 ml-2">Đã bán 1.2k</span>
          </div>

          <div className="mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-red-500">
                {((product.price * (100 - discountPercent)) / 100).toLocaleString()}
              </span>
              <span className="text-sm text-gray-400 line-through">{product.price.toLocaleString()}</span>
            </div>
          </div>

          <div className="mb-4">
            {!isOutOfStock && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Kho: {product.stock}</span>
                <span className="text-green-600 font-medium">Còn hàng</span>
              </div>
            )}
          </div>

          <button
            className={`w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
              isOutOfStock
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-[#4f0f87] hover:bg-[#581b8d] hover:border-[#581b8d] text-white shadow-sm hover:shadow-md transform hover:scale-[1.02]"
            }`}
            disabled={isOutOfStock}
          >
            {isOutOfStock ? "Hết hàng" : "Thêm vào giỏ hàng"}
          </button>
        </div>
      </div>
    </Link>
  )
}

const BookCarousel: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:8888/api/products")
        const data = await res.json()

        if (Array.isArray(data.data)) {
          setProducts(data.data)
        } else {
          console.error("Dữ liệu không hợp lệ:", data)
        }
      } catch (err) {
        console.error("Lỗi khi fetch sản phẩm:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  return (
    <div className="max-w-7xl mx-auto py-4 px-4 space-y-16">
      <section className="bg-white py-12 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 md:text-left">
            <span className="inline-block border border-[#7644a4] text-[#7644a4] text-xs px-3 py-1 rounded-full">
              Tác giả của tháng
            </span>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Eric-Emmanuel Schmitt</h1>

            <p className="text-gray-600">
              Eric-Emmanuel Schmitt được trao hơn 20 giải thưởng và danh hiệu văn học. Ông được phong danh hiệu
              Chevalier des Arts et des Lettres - Hiệp sĩ Nghệ thuật và Văn học. Các cuốn sách của ông đã được dịch ra
              hơn 40 ngôn ngữ...
            </p>

            <button className="bg-[#4f0f87] hover:bg-[#51348f] text-white px-5 py-2 rounded-xl transition md:ml-0 md:mr-auto block">
              Xem ngay
            </button>
          </div>

          <div className="text-center md:text-right relative">
            <p className="text-xs uppercase text-gray-500 mb-2">Sách có chữ ký + giảm giá 30%</p>
          </div>
        </div>
      </section>

      <section className="px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Tủ sách nổi bật của chúng tôi</h2>
            <p className="text-gray-600">Khám phá những cuốn sách được yêu thích nhất</p>
          </div>
          <Link
            to={"/products"}
            className="inline-flex items-center space-x-2 bg-[#4f0f87] hover:bg-[#51348f] text-white hover:text-white font-medium px-6 py-3 rounded-full border border-purple-200 hover:border-purple-300 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <span>Xem tất cả</span>
            <svg className="w-4 h-4 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            <p className="text-gray-600 font-medium">Đang tải sản phẩm...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-4">Bạn có biết về chúng tôi không?</h2>
            <p className="text-gray-600 mb-4">
              Chúng tôi là Bookora - chuyên về sách trực tuyến và mục tiêu của chúng tôi là mang đến những cuốn sách có
              thể thay đổi cuộc sống của bạn hoặc đưa bạn thoát khỏi thế giới thực để bước vào một thế giới tuyệt vời
              hơn. Bookora tự hào được hợp tác với những nhà xuất bản nổi tiếng nhất để mang lại trải nghiệm tốt nhất
              cho bạn.
              <br />
              <br />
              Nếu bạn yêu thích sách, hãy đăng ký nhận bản tin của chúng tôi!
            </p>
            <form className="space-y-4">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="w-full bg-white border border-gray-400 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#51348f]"
              />
              <button type="submit" className="w-full bg-[#4f0f87] hover:bg-[#51348f] text-white py-2 rounded">
                Đăng ký
              </button>
            </form>
          </div>

          <div>
            <img
              src="map.png"
              alt="Map"
              className="w-full h-auto rounded shadow"
              onError={(e) => {
                e.currentTarget.onerror = null
                e.currentTarget.src = "https://placehold.co/600x400?text=No+Map"
              }}
            />
          </div>
        </div>
      </section>
    </div>
  )
}

export default BookCarousel