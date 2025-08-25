import { Facebook, Instagram, Twitter, Phone, Clock, Mail, ArrowRight } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-[#4f0f87] text-white">
      <div className="px-6 md:px-16 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-3 space-y-6">
            <div>
              <h2 className="font-bold text-2xl mb-3">Bookora</h2>
              <p className="text-white/80 text-sm leading-relaxed">
                Nền tảng mua bán sách trực tuyến hàng đầu Việt Nam, tự hào mang <br/> đến trải nghiệm đọc tuyệt vời.
              </p>
            </div>

            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-300 group"
              >
                <Facebook className="text-white w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-300 group"
              >
                <Instagram className="text-white w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-300 group"
              >
                <Twitter className="text-white w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg mb-4 relative">
                Dịch vụ
                <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-white/60"></div>
              </h3>
              <ul className="space-y-3">
                <li>
                  <a className="text-white/80 hover:text-white transition-colors duration-300 text-sm" href="#">
                    Điều khoản sử dụng
                  </a>
                </li>
                <li>
                  <a className="text-white/80 hover:text-white transition-colors duration-300 text-sm" href="#">
                    Giới thiệu Bookora
                  </a>
                </li>
                <li>
                  <a className="text-white/80 hover:text-white transition-colors duration-300 text-sm" href="#">
                    Hệ thống nhà sách
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg mb-4 relative">
                Hỗ trợ
                <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-white/60"></div>
              </h3>
              <ul className="space-y-3">
                <li>
                  <a className="text-white/80 hover:text-white transition-colors duration-300 text-sm" href="#">
                    Chính sách đổi trả
                  </a>
                </li>
                <li>
                  <a className="text-white/80 hover:text-white transition-colors duration-300 text-sm" href="#">
                    Chính sách bảo hành
                  </a>
                </li>
                <li>
                  <a className="text-white/80 hover:text-white transition-colors duration-300 text-sm" href="#">
                    Chính sách vận chuyển
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg mb-4 relative">
                Tài khoản
                <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-white/60"></div>
              </h3>
              <ul className="space-y-3">
                <li>
                  <a className="text-white/80 hover:text-white transition-colors duration-300 text-sm" href="#">
                    Đăng nhập
                  </a>
                </li>
                <li>
                  <a className="text-white/80 hover:text-white transition-colors duration-300 text-sm" href="#">
                    Đăng ký
                  </a>
                </li>
                <li>
                  <a className="text-white/80 hover:text-white transition-colors duration-300 text-sm" href="#">
                    Chi tiết tài khoản
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white/5 rounded-2xl p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="text-sm">0977 907 877</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span className="text-sm">08:00 - 16:00</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-sm">bkr@gmail.com</span>
                </div>
                <div className="space-y-5">
                  <button className="w-full bg-white text-[#4f0f87] px-6 py-2 rounded-xl font-medium hover:bg-white/90 transition-all duration-300 flex items-center justify-center space-x-2 group">
                    <span>Liên hệ ngay</span>
                    <ArrowRight className="mt-1 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/20 px-6 md:px-16 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-white/60">Copyright 2025 © by wkkkuu. All rights reserved.</div>
          <div className="space-y-3">
            <div className="flex space-x-3">
            <div className="w-12 h-6 bg-white rounded-md flex items-center justify-center p-1">
                <img src="https://www.paypalobjects.com/webstatic/icon/pp258.png"
                    alt="PayPal"
                    className="h-full object-contain"
                />
            </div>
            <div className="w-12 h-6 bg-white rounded-md flex items-center justify-center p-1">
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png"
                    alt="MasterCard"
                    className="h-full object-contain"
                />
            </div>
            <div className="w-12 h-6 bg-white rounded-md flex items-center justify-center p-1">
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
                    alt="Visa"
                    className="h-full object-contain"
                />
            </div>
           </div>
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-white/60 hover:text-white transition-colors duration-300">
              Chính sách bảo mật
            </a>
            <a href="#" className="text-white/60 hover:text-white transition-colors duration-300">
              Điều khoản dịch vụ
            </a>
            <a href="#" className="text-white/60 hover:text-white transition-colors duration-300">
              Chính sách Cookie
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer