import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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

const ProductCard = ({ product }: { product: Product }) => {
    const isOutOfStock = product.stock === 0 || product.status === "Hết";

    return (
        <Link to={`/productdetails/${product._id}`} className="block">
            <div className="bg-white border rounded-lg shadow-sm hover:shadow-md p-4 flex flex-col transition hover:-translate-y-1">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-60 w-full object-cover rounded mb-4"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://placehold.co/200x300?text=No+Image';
                    }}
                />
                <h3 className="font-semibold text-black mb-3">{product.name}</h3>

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
                            isOutOfStock
                                ? 'bg-[#551b8c] w-full'
                                : 'bg-[#551b8c]'
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

const BookCarousel: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('http://localhost:8888/api/products');
                const data = await res.json();

                if (Array.isArray(data.data)) {
                    setProducts(data.data);
                } else {
                    console.error('Dữ liệu không hợp lệ:', data);
                }
            } catch (err) {
                console.error('Lỗi khi fetch sản phẩm:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 space-y-16">
            <section className="bg-white py-12 px-4">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4 md:text-left">
                        <span className="inline-block border border-[#7644a4] text-[#7644a4] text-xs px-3 py-1 rounded-full">
                            Tác giả của tháng Tám
                        </span>

                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                            Eric-Emmanuel Schmitt
                        </h1>

                        <p className="text-gray-600">
                            Eric-Emmanuel Schmitt đã được trao hơn 20 giải thưởng và danh hiệu văn học. Vào năm 2001, ông được phong danh hiệu Chevalier des Arts et des Lettres - Hiệp sĩ Nghệ thuật và Văn học. Các cuốn sách của ông đã được dịch ra hơn 40 ngôn ngữ...
                        </p>

                        <button className="bg-[#4f0f87] hover:bg-[#51348f] text-white px-5 py-2 rounded transition md:ml-0 md:mr-auto block">
                            Xem ngay
                        </button>
                    </div>

                    <div className="text-center md:text-right relative">
                        <p className="text-xs uppercase text-gray-500 mb-2">
                            Sách có chữ ký + giảm giá 30%
                        </p>
                    </div>
                </div>
            </section>

            <section>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-left">Tủ sách nổi bật của chúng tôi</h2>
                    <Link
                        to={"/products"}
                        className="text-base text-black hover:text-[#551b8c] font-medium"
                    >
                        Xem thêm →
                    </Link>
                </div>

                {loading ? (
                    <p>Đang tải sản phẩm...</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
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
                            Chúng tôi là Bookora - chuyên về sách trực tuyến và mục tiêu của chúng tôi là
                            mang đến những cuốn sách có thể thay đổi cuộc sống của bạn hoặc đưa bạn thoát
                            khỏi thế giới thực để bước vào một thế giới tuyệt vời hơn. Bookora tự hào được
                            hợp tác với những nhà xuất bản nổi tiếng nhất để mang lại trải nghiệm tốt nhất
                            cho bạn.
                            <br /><br />
                            Nếu bạn yêu thích sách, hãy đăng ký nhận bản tin của chúng tôi!
                        </p>
                        <form className="space-y-4">
                            <input
                                type="email"
                                placeholder="Nhập email của bạn"
                                className="w-full bg-white border border-gray-400 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#51348f]"
                            />
                            <button
                                type="submit"
                                className="w-full bg-[#4f0f87] hover:bg-[#51348f] text-white py-2 rounded"
                            >
                                Đăng ký
                            </button>
                        </form>
                    </div>

                    <div>
                        <img
                            src="https://placehold.co/600x400/EEE6FA/5C2D91?text=Map"
                            alt="Map"
                            className="w-full h-auto rounded shadow"
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = "https://placehold.co/600x400?text=No+Map";
                            }}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BookCarousel;