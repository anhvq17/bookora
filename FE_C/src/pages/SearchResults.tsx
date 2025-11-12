import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import api from "../configs/axios.customize"

type Product = {
  _id: string
  name: string
  price: number
  imageUrl: string
  category?: string
  description?: string
  stock?: number
  status?: string
}

const useQuery = () => {
  const { search } = useLocation()
  return new URLSearchParams(search)
}

const SearchResults = () => {
  const q = useQuery().get("q")?.trim() || ""
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let isMounted = true
    const fetchData = async () => {
      if (!q) {
        setProducts([])
        return
      }
      setLoading(true)
      try {
        const res = await api.get("api/products", { params: { search: q } })
        let items: Product[] = []
        if (res.data && res.data.data && Array.isArray(res.data.data)) {
          items = res.data.data
        } else if (Array.isArray(res.data)) {
          items = res.data as Product[]
        }
        if (items.length === 0) {
          const fallback = await api.get("api/products")
          const all: Product[] = fallback.data?.data && Array.isArray(fallback.data.data) ? fallback.data.data : Array.isArray(fallback.data) ? fallback.data : []
          items = all.filter((p) => (p.name || "").toLowerCase().includes(q.toLowerCase()))
        }
        if (isMounted) setProducts(items)
      } catch (_e) {
        if (isMounted) setProducts([])
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchData()
    return () => { isMounted = false }
  }, [q])

  return (
    <div className="max-w-7xl mx-auto py-6 px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Kết quả tìm kiếm cho “{q}”
        </h1>
        <p className="text-gray-500 text-sm mt-1">{products.length} sản phẩm</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-gray-600">
          Không tìm thấy sản phẩm phù hợp.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p) => (
            <Link key={p._id} to={`/productdetails/${p._id}`} className="group border rounded-xl overflow-hidden bg-white hover:shadow-lg transition-shadow">
              <div className="aspect-[4/5] bg-gray-50 overflow-hidden">
                <img
                  src={p.imageUrl || "/placeholder.svg"}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "https://placehold.co/300x300?text=No+Image"
                  }}
                />
              </div>
              <div className="p-4">
                <div className="text-gray-900 font-medium text-sm line-clamp-2">{p.name}</div>
                <div className="mt-2 text-red-500 font-semibold">{(p.price || 0).toLocaleString()}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchResults

