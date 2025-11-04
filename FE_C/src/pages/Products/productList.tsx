import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../configs/axios.customize';
import { Heart } from 'lucide-react';
import { useWishlist } from '../../hooks/useWishlist';
import { message } from 'antd';

type Product = {
  _id: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  imageUrl: string;
  stock: number;
  status?: string;
};

const categories = ['Tiểu thuyết', 'Ngôn tình', 'Trinh thám', 'Huyền Bí', 'Light Novel', 'Truyện tranh', 'Tác phẩm kinh điển', 'Du ký', 'Phóng sự', 'Hài hước'];

const ProductCard = ({ product }: { product: Product }) => {
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
      <div className="bg-white border rounded-lg shadow-sm hover:shadow-md p-4 flex flex-col justify-between h-full transition hover:-translate-y-1 relative">
        <div className="relative">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-60 w-full object-cover rounded mb-4"
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
        </div>
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
              width: isOutOfStock ? '100%' : `${Math.min(product.stock, 100)}%`,
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

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 16;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('api/products');
        console.log('Products response:', res.data);
        if (res.data && res.data.data && Array.isArray(res.data.data)) {
          setProducts(res.data.data);
        } else if (Array.isArray(res.data)) {
          setProducts(res.data);
        } else {
          console.error('Dữ liệu không hợp lệ:', res.data);
          setProducts([]);
        }
      } catch (err: any) {
        console.error('Lỗi khi fetch sản phẩm:', err);
        if (err.response) {
          console.error('Response error:', err.response.data);
        }
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, selectedPriceRange]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);

  const filteredProducts = products.filter((product) => {
    const matchCategory = selectedCategory ? product.category === selectedCategory : true;

    const matchPrice = (() => {
      if (!selectedPriceRange) return true;
      const price = product.price;
      switch (selectedPriceRange) {
        case '0-100':
          return price < 100000;
        case '100-300':
          return price >= 100000 && price <= 300000;
        case '300+':
          return price > 300000;
        default:
          return true;
      }
    })();

    return matchCategory && matchPrice;
  });

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
            <div className="relative w-48">
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="appearance-none w-full border border-gray-300 rounded px-4 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#551b8c]">
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((cat) => (
                    <option key={cat} value={cat}>
                        {cat}
                    </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                    <svg className="w-4 h-4"  fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            <div className="relative w-48">
                <select value={selectedPriceRange} onChange={(e) => setSelectedPriceRange(e.target.value)} className="appearance-none w-full border border-gray-300 rounded px-4 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#551b8c]">
                    <option value="">-- Chọn mức giá --</option>
                    <option value="0-100">Dưới 100K</option>
                    <option value="100-300">100K - 300K</option>
                    <option value="300+">Trên 300K</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            {(selectedCategory || selectedPriceRange) && (
                <button onClick={() => { setSelectedCategory(''); setSelectedPriceRange('') }} className="text-sm text-white bg-red-500 hover:bg-red-600 px-3 py-2 rounded transition">
                    Xóa bộ lọc ✕
                </button>
            )}
        </div>

        <div className="relative w-44">
            <select onChange={(e) => { const value = e.target.value; const sorted = [...filteredProducts].sort((a, b) => value === 'asc' ? a.price - b.price : b.price - a.price);
                setProducts(sorted);
            }}
            className="appearance-none w-full border border-gray-300 rounded px-4 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#551b8c]">
                <option value="">-- Sắp xếp theo --</option>
                <option value="asc">Giá thấp đến cao</option>
                <option value="desc">Giá cao đến thấp</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    </div>

    {currentProducts.length === 0 ? (
        <p>Không có sản phẩm phù hợp.</p>
    ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {currentProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
            ))}
        </div>
    )}

      <div className="flex justify-center mt-10">
        <ul className="flex space-x-2 text-sm">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <li key={page}>
              <button
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 border rounded ${
                  page === currentPage
                    ? 'bg-[#551b8c] text-white'
                    : 'bg-white border-gray-300 text-gray-800'
                }`}>
                {page}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductList;