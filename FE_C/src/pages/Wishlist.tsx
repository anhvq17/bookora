import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useWishlist } from '../hooks/useWishlist';
import type { WishlistProduct } from '../types/wishlist';
import { message } from 'antd';

const Wishlist = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const [wishlistItems, setWishlistItems] = useState<WishlistProduct[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('wishlist');
    if (stored) {
      try {
        setWishlistItems(JSON.parse(stored));
      } catch (error) {
        console.error('Error parsing wishlist:', error);
      }
    }

    const handleUpdate = () => {
      const stored = localStorage.getItem('wishlist');
      if (stored) {
        try {
          setWishlistItems(JSON.parse(stored));
        } catch (error) {
          console.error('Error parsing wishlist:', error);
        }
      }
    };

    window.addEventListener('wishlistUpdated', handleUpdate);
    return () => window.removeEventListener('wishlistUpdated', handleUpdate);
  }, []);

  const handleRemove = (productId: string, productName: string) => {
    removeFromWishlist(productId);
    message.success(`Đã xóa "${productName}" khỏi danh sách yêu thích`);
  };

  const handleAddToCart = (product: WishlistProduct) => {
    const stored = localStorage.getItem('cart');
    let cart: any[] = stored ? JSON.parse(stored) : [];

    const existingIndex = cart.findIndex(item => item._id === product._id);
    if (existingIndex >= 0) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        _id: product._id,
        name: product.name,
        price: product.price,
        description: product.description,
        image: product.imageUrl,
        quantity: 1,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    message.success('Đã thêm vào giỏ hàng!');
    window.dispatchEvent(new Event('cartUpdated'));
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <Heart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Danh sách yêu thích trống</h2>
            <p className="text-gray-600 mb-8">Bạn chưa có sản phẩm nào trong danh sách yêu thích</p>
            <Link
              to="/products"
              className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-8 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
            >
              Khám phá sản phẩm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Danh sách yêu thích</h1>
            <p className="text-gray-600">{wishlistItems.length} sản phẩm</p>
          </div>
          {wishlistItems.length > 0 && (
            <button
              onClick={() => {
                if (confirm('Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi danh sách yêu thích?')) {
                  clearWishlist();
                  message.success('Đã xóa tất cả sản phẩm khỏi danh sách yêu thích');
                }
              }}
              className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              Xóa tất cả
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <div
              key={product._id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-xl p-4 flex flex-col transition-all duration-300 hover:-translate-y-2"
            >
              <Link to={`/productdetails/${product._id}`} className="block mb-4">
                <div className="relative overflow-hidden rounded-lg aspect-[3/4] mb-4">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://placehold.co/200x300?text=No+Image';
                    }}
                  />
                </div>
              </Link>

              <div className="flex-1 flex flex-col">
                <Link to={`/productdetails/${product._id}`}>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-purple-600 transition-colors">
                    {product.name}
                  </h3>
                </Link>

                <div className="flex items-center justify-between mb-3">
                  <span className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs px-3 py-1 rounded-full font-medium">
                    {product.category || 'Sách'}
                  </span>
                  <span className="font-bold text-red-500 text-lg">
                    {product.price.toLocaleString()}₫
                  </span>
                </div>

                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium py-2 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Thêm vào giỏ
                  </button>
                  <button
                    onClick={() => handleRemove(product._id, product.name)}
                    className="p-2 border-2 border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    title="Xóa khỏi danh sách yêu thích"
                  >
                    <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;

