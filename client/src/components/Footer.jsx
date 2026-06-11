function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-200 mt-auto border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* Thông tin thư viện */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold mb-4 flex items-center text-white">
                            <span className="bg-blue-600/20 p-2 rounded-lg mr-3">📚</span> Thư Viện
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Hệ thống quản lý thư viện hiện đại, cung cấp dịch vụ mượn sách trực tuyến 
                            và quản lý tài liệu hiệu quả. Giúp bạn tiếp cận với kho tàng tri thức một cách dễ dàng.
                        </p>
                    </div>

                    {/* Liên kết nhanh */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6 text-white relative inline-block">
                            Liên kết nhanh
                            <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-blue-500 rounded-full"></span>
                        </h3>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <a href="#" className="text-slate-400 hover:text-blue-400 hover:translate-x-1 inline-block transition-all duration-300">
                                    → Trang chủ
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-slate-400 hover:text-blue-400 hover:translate-x-1 inline-block transition-all duration-300">
                                    → Danh mục sách
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-slate-400 hover:text-blue-400 hover:translate-x-1 inline-block transition-all duration-300">
                                    → Quy định mượn sách
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-slate-400 hover:text-blue-400 hover:translate-x-1 inline-block transition-all duration-300">
                                    → Liên hệ
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Thông tin liên hệ */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6 text-white relative inline-block">
                            Liên hệ
                            <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-blue-500 rounded-full"></span>
                        </h3>
                        <div className="space-y-4 text-sm text-slate-400">
                            <p className="flex items-start">
                                <span className="mr-3 mt-0.5">📍</span>
                                <span>K50/11 Bùi Tá Hán, Khuê Mỹ, Ngũ Hành Sơn, Tp Đà Nẵng</span>
                            </p>
                            <p className="flex items-center">
                                <span className="mr-3">📞</span>
                                <span>0353788379</span>
                            </p>
                            <p className="flex items-center">
                                <span className="mr-3">✉️</span>
                                <span>longtran13112004@gmail.com</span>
                            </p>
                            <p className="flex items-center">
                                <span className="mr-3">🕒</span>
                                <span>Thứ 2 - Thứ 7: 8:00 - 19:00</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-slate-800 mt-12 pt-8 text-center flex flex-col md:flex-row justify-between items-center">
                    <p className="text-slate-500 text-sm mb-4 md:mb-0">
                        © 2024 Hệ thống Quản lý Thư viện. Tất cả quyền được bảo lưu.
                    </p>
                    <div className="flex space-x-4">
                        <span className="text-slate-500 hover:text-white cursor-pointer transition-colors">Facebook</span>
                        <span className="text-slate-500 hover:text-white cursor-pointer transition-colors">Twitter</span>
                        <span className="text-slate-500 hover:text-white cursor-pointer transition-colors">Instagram</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
