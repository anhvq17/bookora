const Footer = () => {
    return (
        <footer className="bg-[#4f0f87] text-white py-8 px-16">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                <div className="flex flex-col justify-between">
                    <div className="font-bold text-xl">Bookora</div>
                    <div className="flex space-x-4 mt-4 mb-4">
                        <a href="#" className="text-white text-2xl"><i className="fab fa-facebook-f"></i></a>
                        <a href="#" className="text-white text-2xl"><i className="fab fa-instagram"></i></a>
                        <a href="#" className="text-white text-2xl"><i className="fab fa-twitter"></i></a>
                    </div>
                </div>

                <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div>
                        <h3 className="font-bold mb-4">Dịch vụ</h3>
                        <ul className="space-y-2">
                            <li><a className="text-white" href="#">Điều khoản sử dụng</a></li>
                            <li><a className="text-white" href="#">Chính sách bảo mật</a></li>
                            <li><a className="text-white" href="#">Giới thiệu Bookora</a></li>
                            <li><a className="text-white" href="#">Hệ thống nhà sách</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">Hỗ trợ</h3>
                        <ul className="space-y-2">
                            <li><a className="text-white" href="#">Chính sách đổi trả</a></li>
                            <li><a className="text-white" href="#">Chính sách bảo hành</a></li>
                            <li><a className="text-white" href="#">Chính sách vận chuyển</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">Tài khoản</h3>
                        <ul className=" text-white space-y-2">
                            <li><a className="text-white" href="#">Đăng nhập</a></li>
                            <li><a className="text-white" href="#">Đăng ký</a></li>
                            <li><a className="text-white" href="#">Chi tiết</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold mb-4">Liên hệ</h3>
                        <ul className="space-y-2 text-sm">
                            <li><i className="text-white fas fa-phone mr-2"></i>+84 338 538 663</li>
                            <li><i className="text-white fas fa-clock mr-2"></i>08:00 - 17:00</li>
                            <li><i className="text-white fas fa-envelope mr-2"></i>n8@cf.com</li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col gap-8">
                    <p className="text-white text-lg mb-4">
                        Nếu bạn có thắc mắc, <br />
                        bạn có thể liên hệ với chúng tôi
                        để được giải đáp!
                    </p>
                    <button className="text-[#4f0f87] bg-white px-4 py-1 rounded transition">
                        Liên hệ ngay
                    </button>

                    <div className="flex space-x-4 mt-4 mb-4">
                        <img src="https://www.paypalobjects.com/webstatic/icon/pp258.png" alt="PayPal" className="h-8" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" alt="MasterCard" className="h-8" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="h-8" />
                    </div>
                </div>
            </div>

            <div className="flex justify-center items-center border-t border-white pt-8">
                <div className="text-sm text-center w-full">
                    Copyright 2025 © by CFN8.
                </div>
            </div>
        </footer>

    );
};

export default Footer;