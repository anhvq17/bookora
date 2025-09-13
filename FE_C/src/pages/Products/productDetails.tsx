import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

interface ProductType {
  _id: string;
  name: string;
  imageUrl: string;
  price: number;
  description?: string;
  category?: string;
  stock?: number;
  status?: string;
}

const ProductCard = ({ product }: { product: ProductType }) => {
  const isOutOfStock = product.stock === 0 || product.status === 'Hết';

  return (
    <Link to={`/productdetails/${product._id}`} className="block">
      <div className="bg-white border rounded-lg shadow-sm hover:shadow-md p-4 flex flex-col justify-between h-full transition hover:-translate-y-1">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-60 w-full object-cover rounded mb-4"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://placehold.co/200x300?text=No+Image';
          }}
        />
        <h3 className="font-semibold text-black mb-3 line-clamp-2">{product.name}</h3>
        <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
          <span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full">
            {product.category || 'Không rõ thể loại'}
          </span>
          <span className="font-bold text-red-500 text-base">
            {product.price.toLocaleString()}
          </span>
        </div>
        <div className="relative h-6 rounded-full overflow-hidden text-white text-sm text-center bg-[#9966cb]">
          <div
            className={`absolute top-0 left-0 h-full transition-all duration-500 ${
              isOutOfStock ? 'bg-[#9966cb] w-full' : 'bg-[#551b8c]'
            }`}
            style={{
              width: isOutOfStock ? '100%' : `${Math.min(product.stock || 100, 100)}%`,
            }}
          ></div>
          <span className="relative z-10 leading-6">
            {isOutOfStock ? 'Hết hàng' : `Còn ${product.stock} sản phẩm`}
          </span>
        </div>
      </div>
    </Link>
  );
};

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [recentProducts, setRecentProducts] = useState<ProductType[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<ProductType[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      axios
        .get(`http://localhost:8888/api/products/${id}`)
        .then((res) => {
          setProduct(res.data.data);
        })
        .catch(() => {
          setProduct(null);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (product?.category) {
      axios
        .get(`http://localhost:8888/api/products?category=${encodeURIComponent(product.category)}`)
        .then((res) => {
          const related = res.data.data.filter((p: ProductType) => p._id !== product._id);
          setRelatedProducts(related.slice(0, 4));
        })
        .catch((err) => {
          console.error('Lỗi lấy sản phẩm liên quan:', err);
          setRelatedProducts([]);
        });
    }
  }, [product]);

  useEffect(() => {
    if (product) {
      const stored = localStorage.getItem('recentProducts');
      let recent: ProductType[] = stored ? JSON.parse(stored) : [];

      recent = recent.filter((p) => p._id !== product._id);
      recent.unshift(product);
      if (recent.length > 5) recent = recent.slice(0, 5);
      localStorage.setItem('recentProducts', JSON.stringify(recent));
      setRecentProducts(recent);
    }
  }, [product]);

  if (loading) return <div className="text-center py-10">Đang tải...</div>;
  if (!product) return <div className="text-center py-10">Không tìm thấy sản phẩm!</div>;

  return (
    <div className="mx-auto px-4 py-4 max-w-[1000px]">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          <div className="flex md:flex-col gap-2 w-full md:w-auto items-center md:items-start">
            {[0, 1, 2, 3].map((i) => (
              <img
                key={i}
                src={product.imageUrl}
                className="w-[70px] h-[105px] object-cover border rounded"
              />
            ))}
          </div>
          <div className="flex-1 max-w-[300px] h-[444px]">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover rounded border"
            />
          </div>
        </div>

        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-2">{product.name}</h2>
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400 text-xl mr-2">★★★★☆</div>
          </div>
          <div className="text-2xl font-bold text-red-500 mb-4">{product.price.toLocaleString()}</div>
          <p className="text-gray-700 mb-6 whitespace-pre-line">
            {product.description || 'Chưa có mô tả cho sản phẩm này.'}
          </p>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border rounded-full px-3 py-1 gap-4">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-6 h-6 flex items-center justify-center rounded-full text-sm bg-[#f9fafb]"
              >−</button>
              <span className="text-base">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="w-6 h-6 flex items-center justify-center rounded-full text-sm bg-[#f9fafb]"
              >+</button>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => {
                const stored = localStorage.getItem('cart');
                let cart: any[] = stored ? JSON.parse(stored) : [];

                const existingIndex = cart.findIndex(item => item._id === product._id);
                if (existingIndex >= 0) {
                  cart[existingIndex].quantity += quantity;
                } else {
                  cart.push({
                    _id: product._id,
                    name: product.name,
                    price: product.price,
                    description: product.description,
                    image: product.imageUrl,
                    quantity: quantity,
                  });
                }

                localStorage.setItem('cart', JSON.stringify(cart));
                alert('Đã thêm vào giỏ hàng!');
              }}
              className="bg-[#551b8c] text-white font-medium py-2 px-6 rounded hover:bg-[#51348f] transition-all"
            >
              Thêm vào giỏ hàng
            </button>
            <Link to="/checkout" className="bg-[#551b8c] text-white font-medium py-2 px-6 rounded hover:bg-[#51348f] hover:text-white transition-all">
              Mua ngay
            </Link>
          </div>

          <hr className="my-4 border-t-2 border-gray-300" />
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <p><span className="font-semibold">Nhà xuất bản:</span> Bookora</p>
              <p><span className="font-semibold">Ngôn ngữ:</span> Tiếng Việt</p>
              <p><span className="font-semibold">Số trang:</span> 250</p>
            </div>
            <div>
              <p><span className="font-semibold">Ngày phát hành:</span> 2025</p>
              <p><span className="font-semibold">Độ tuổi:</span> 14 +</p>
              <p><span className="font-semibold">Kích thước:</span> 14 × 20 cm</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-4">Đánh giá từ người dùng</h3>
        <div className="border p-4 rounded mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <img src="https://i.pravatar.cc/40" className="w-10 h-10 rounded-full" />
              <div>
                <p className="font-medium">Bác Quýnh</p>
                <p className="text-xs text-gray-500">2 giờ trước</p>
              </div>
            </div>
            <div className="text-yellow-400 text-lg">★★★★☆</div>
          </div>
          <p className="text-gray-700">Tuyệt vời! Nội dung ý nghĩa và rất cuốn.</p>
        </div>
      </div>

      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-4">Sản phẩm liên quan</h3>
        {relatedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        ) : (
          <p>Không tìm thấy sản phẩm liên quan.</p>
        )}
      </div>

      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-4">Đã xem gần đây</h3>
        {recentProducts.length > 1 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recentProducts
              .filter(p => p._id !== product._id)
              .map((p) => (
                <ProductCard key={p._id} product={p} />
            ))}
          </div>
        ) : (
          <p>Chưa có sản phẩm nào được xem gần đây.</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;