import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../configs/axios.customize';
import { ShoppingCart, Heart, Share2, Star, Minus, Plus, CheckCircle2, Truck, Shield, RotateCcw } from 'lucide-react';
import { useWishlist } from '../../hooks/useWishlist';
import { message } from 'antd';

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
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setIsFavorite(isInWishlist(product._id));
  }, [product._id, isInWishlist]);

  useEffect(() => {
    const handleUpdate = () => {
      setIsFavorite(isInWishlist(product._id));
    };
    window.addEventListener('wishlistUpdated', handleUpdate);
    return () => window.removeEventListener('wishlistUpdated', handleUpdate);
  }, [product._id, isInWishlist]);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFavorite) {
      removeFromWishlist(product._id);
      message.success('Đã xóa khỏi danh sách yêu thích');
    } else {
      const success = addToWishlist({
        _id: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        category: product.category,
        description: product.description,
        stock: product.stock,
        status: product.status,
      });
      if (success) {
        message.success('Đã thêm vào danh sách yêu thích');
      }
    }
  };

  return (
    <Link to={`/productdetails/${product._id}`} className="block group">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-xl p-4 flex flex-col justify-between h-full transition-all duration-300 hover:-translate-y-2 overflow-hidden">
        <div className="relative overflow-hidden rounded-lg mb-4">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-60 w-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://placehold.co/200x300?text=No+Image';
            }}
          />
          <button
            onClick={handleToggleWishlist}
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors z-10"
            title={isFavorite ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
              }`}
            />
          </button>
          {isOutOfStock && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              Hết hàng
            </div>
          )}
        </div>
        <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 min-h-[3rem] group-hover:text-[#551b8c] transition-colors">
          {product.name}
        </h3>
        <div className="flex justify-between items-center text-sm mb-3">
          <span className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs px-3 py-1 rounded-full font-medium">
            {product.category || 'Không rõ thể loại'}
          </span>
          <span className="font-bold text-red-500 text-lg">
            {product.price.toLocaleString()}₫
          </span>
        </div>
        {!isOutOfStock && (
          <div className="relative h-6 rounded-full overflow-hidden bg-gray-200">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
              style={{
                width: `${Math.min((product.stock || 100) / 100 * 100, 100)}%`,
              }}
            ></div>
            <span className="relative z-10 leading-6 text-xs text-center block text-white font-medium">
              Còn {product.stock} sản phẩm
            </span>
          </div>
        )}
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
  const [selectedImage, setSelectedImage] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      api
        .get(`api/products/${id}`)
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
      api
        .get(`api/products?category=${encodeURIComponent(product.category)}`)
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
      
      // Check if product is in wishlist
      setIsFavorite(isInWishlist(product._id));
    }
  }, [product, isInWishlist]);

  useEffect(() => {
    const handleUpdate = () => {
      if (product) {
        setIsFavorite(isInWishlist(product._id));
      }
    };
    window.addEventListener('wishlistUpdated', handleUpdate);
    return () => window.removeEventListener('wishlistUpdated', handleUpdate);
  }, [product, isInWishlist]);

  const handleToggleWishlist = () => {
    if (!product) return;

    if (isFavorite) {
      removeFromWishlist(product._id);
      message.success('Đã xóa khỏi danh sách yêu thích');
    } else {
      const success = addToWishlist({
        _id: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        category: product.category,
        description: product.description,
        stock: product.stock,
        status: product.status,
      });
      if (success) {
        message.success('Đã thêm vào danh sách yêu thích');
      }
    }
  };

  const handleAddToCart = () => {
    const stored = localStorage.getItem('cart');
    let cart: any[] = stored ? JSON.parse(stored) : [];

    const existingIndex = cart.findIndex(item => item._id === product?._id);
    if (existingIndex >= 0) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        _id: product?._id,
        name: product?.name,
        price: product?.price,
        description: product?.description,
        image: product?.imageUrl,
        quantity: quantity,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-xl mb-4">Không tìm thấy sản phẩm!</p>
          <Link to="/products" className="text-purple-600 hover:text-purple-700 font-medium">
            Quay lại danh sách sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0 || product.status === 'Hết';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center space-x-2 text-gray-600">
            <li><Link to="/" className="hover:text-purple-600 transition-colors">Trang chủ</Link></li>
            <li>/</li>
            <li><Link to="/products" className="hover:text-purple-600 transition-colors">Sản phẩm</Link></li>
            <li>/</li>
            <li className="text-gray-900 font-medium">{product.name}</li>
          </ol>
        </nav>

        {/* Main Product Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://placehold.co/600x600?text=No+Image';
                  }}
                />
                {isOutOfStock && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Hết hàng
                  </div>
                )}
                <button
                  onClick={handleToggleWishlist}
                  className="absolute top-4 left-4 p-3 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors z-10"
                  title={isFavorite ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
                >
                  <Heart className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                </button>
              </div>
              
              {/* Thumbnail Images */}
              <div className="flex gap-3 overflow-x-auto pb-2">
                {[0, 1, 2, 3].map((i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === i ? 'border-purple-500 ring-2 ring-purple-200 scale-105' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={product.imageUrl}
                      alt={`${product.name} ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Title and Rating */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs px-3 py-1 rounded-full font-semibold">
                    {product.category || 'Sách'}
                  </span>
                  {!isOutOfStock && (
                    <span className="flex items-center gap-1 text-green-600 text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Còn hàng</span>
                    </span>
                  )}
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {product.name}
                </h1>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${star <= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600 text-sm">(4.0) - 128 đánh giá</span>
                </div>
              </div>

              {/* Price */}
              <div className="border-t border-b border-gray-200 py-6">
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-bold text-red-500">
                    {product.price.toLocaleString()}₫
                  </span>
                  <span className="text-xl text-gray-400 line-through">
                    {(product.price * 1.2).toLocaleString()}₫
                  </span>
                  <span className="bg-red-100 text-red-600 text-sm font-semibold px-2 py-1 rounded">
                    -17%
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Mô tả sản phẩm</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {product.description || 'Chưa có mô tả cho sản phẩm này.'}
                </p>
              </div>

              {/* Quantity Selector */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Số lượng</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus className="w-5 h-5 text-gray-600" />
                    </button>
                    <span className="px-6 py-3 text-lg font-semibold text-gray-900 min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      disabled={quantity >= (product.stock || 99)}
                      className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.stock || 0} sản phẩm có sẵn
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
                  </button>
                  <Link
                    to="/checkout"
                    className="flex-1 bg-white border-2 border-purple-600 text-purple-600 font-semibold py-4 px-6 rounded-xl hover:bg-purple-50 transition-all flex items-center justify-center gap-2"
                  >
                    Mua ngay
                  </Link>
                </div>
                <button className="w-full border-2 border-gray-300 text-gray-700 font-medium py-3 px-6 rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Chia sẻ
                </button>
              </div>

              {/* Success Message */}
              {showSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-fade-in">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Đã thêm vào giỏ hàng thành công!</span>
                </div>
              )}

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Truck className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Miễn phí vận chuyển</p>
                    <p className="text-xs text-gray-600">Đơn hàng trên 500k</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Bảo hành chính hãng</p>
                    <p className="text-xs text-gray-600">1 năm đổi trả</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <RotateCcw className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Đổi trả dễ dàng</p>
                    <p className="text-xs text-gray-600">Trong 7 ngày</p>
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Thông tin chi tiết</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 mb-1"><span className="font-semibold text-gray-900">Nhà xuất bản:</span> Bookora</p>
                    <p className="text-gray-600 mb-1"><span className="font-semibold text-gray-900">Ngôn ngữ:</span> Tiếng Việt</p>
                    <p className="text-gray-600"><span className="font-semibold text-gray-900">Số trang:</span> 250</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1"><span className="font-semibold text-gray-900">Ngày phát hành:</span> 2025</p>
                    <p className="text-gray-600 mb-1"><span className="font-semibold text-gray-900">Độ tuổi:</span> 14+</p>
                    <p className="text-gray-600"><span className="font-semibold text-gray-900">Kích thước:</span> 14 × 20 cm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Đánh giá từ người dùng</h3>
            <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
              Xem tất cả đánh giá →
            </button>
          </div>
          
          {/* Rating Summary */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="text-5xl font-bold text-gray-900 mb-2">4.0</div>
                <div className="flex items-center justify-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${star <= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600">128 đánh giá</p>
              </div>
              <div className="flex-1 max-w-md space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 w-8">{rating} sao</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500"
                        style={{ width: `${rating === 5 ? 60 : rating === 4 ? 25 : rating === 3 ? 10 : rating === 2 ? 3 : 2}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">
                      {rating === 5 ? 60 : rating === 4 ? 25 : rating === 3 ? 10 : rating === 2 ? 3 : 2}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {[
              { name: 'Bác Quýnh', avatar: 'https://i.pravatar.cc/40?img=1', time: '2 giờ trước', rating: 4, comment: 'Tuyệt vời! Nội dung ý nghĩa và rất cuốn. Sách rất hay và bổ ích cho người đọc.' },
              { name: 'Anh Minh', avatar: 'https://i.pravatar.cc/40?img=2', time: '1 ngày trước', rating: 5, comment: 'Sản phẩm chất lượng tốt, giao hàng nhanh. Rất hài lòng với dịch vụ!' },
              { name: 'Chị Lan', avatar: 'https://i.pravatar.cc/40?img=3', time: '3 ngày trước', rating: 4, comment: 'Đóng gói cẩn thận, sách mới tinh. Nội dung hay, đáng đọc!' },
            ].map((review, idx) => (
              <div key={idx} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <p className="font-semibold text-gray-900">{review.name}</p>
                      <p className="text-sm text-gray-500">{review.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>

          <button className="w-full mt-6 border-2 border-purple-600 text-purple-600 font-semibold py-3 px-6 rounded-xl hover:bg-purple-50 transition-all">
            Xem thêm đánh giá
          </button>
        </div>

        {/* Related Products */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Sản phẩm liên quan</h3>
            <Link to="/products" className="text-purple-600 hover:text-purple-700 font-medium text-sm">
              Xem tất cả →
            </Link>
          </div>
          {relatedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-12 text-center">
              <p className="text-gray-600">Không tìm thấy sản phẩm liên quan.</p>
            </div>
          )}
        </div>

        {/* Recently Viewed */}
        {recentProducts.length > 1 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Đã xem gần đây</h3>
              <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                Xóa lịch sử
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {recentProducts
                .filter(p => p._id !== product._id)
                .map((p) => (
                  <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;