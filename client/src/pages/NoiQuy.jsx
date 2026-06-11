import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
    BookOutlined, 
    CalendarOutlined, 
    WarningOutlined, 
    SearchOutlined, 
    UserOutlined, 
    SafetyOutlined,
    RocketOutlined,
    HeartOutlined,
    ThunderboltOutlined,
    TrophyOutlined,
    GlobalOutlined,
    ClockCircleOutlined,
    FileTextOutlined
} from '@ant-design/icons';

function NoiQuy() {
    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-card-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.animate-card').forEach(el => {
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    const rules = [
        {
            id: 1,
            icon: <BookOutlined />,
            title: "Điều kiện mượn sách",
            description: "Đảm bảo quyền lợi cho độc giả",
            items: [
                "Người dùng phải có tài khoản đã đăng ký trên hệ thống",
                "Người dùng phải đăng kí thẻ sinh viên",
                "Sinh viên năm nhất cần có giấy giới thiệu từ khoa",
                "Giảng viên và nhân viên được ưu tiên mượn tối đa 10 cuốn/lần"
            ]
        },
        {
            id: 2,
            icon: <CalendarOutlined />,
            title: "Thời hạn mượn",
            description: "Tuân thủ để tránh phạt",
            items: [
                "Thời gian mượn: không quá 1 tháng (30 ngày)",
                "Gia hạn: 1 lần, thêm 7 ngày (thực hiện trên web hoặc tại quầy)",
                "Quá hạn: phạt 2.000 VNĐ/cuốn/ngày",
                "Quá hạn trên 30 ngày: tạm khóa quyền mượn 3 tháng"
            ]
        },
        {
            id: 3,
            icon: <WarningOutlined />,
            title: "Xử lý sách hư hỏng, mất",
            description: "Bảo vệ tài sản chung",
            items: [
                "Bồi thường 100% giá bìa hoặc thay thế bản mới cùng loại",
                "Hư hỏng nhẹ (rách trang, ghi chú): phí xử lý 20.000 VNĐ/cuốn",
                "Sách quý hiếm: xử lý theo giá trị thực tế"
            ]
        },
        {
            id: 4,
            icon: <SearchOutlined />,
            title: "Tra cứu và mượn sách",
            description: "Tiện lợi và nhanh chóng",
            items: [
                "Tra cứu sách trực tuyến qua thanh tìm kiếm trên trang web",
                "Đặt giữ sách trước khi đến thư viện nhận (giữ tối đa 3 ngày)",
                "Mượn trực tiếp tại quầy với thẻ sinh viên hoặc thẻ thư viện",
                "Sách tham khảo chỉ được mượn tại chỗ, không mang về nhà"
            ]
        },
        {
            id: 5,
            icon: <UserOutlined />,
            title: "Trách nhiệm người dùng",
            description: "Văn minh - Lịch sự",
            items: [
                "Kiểm tra tình trạng sách trước khi nhận và báo ngay nếu có hư hỏng",
                "Trả sách đúng hạn để tránh bị khóa quyền mượn tạm thời",
                "Không chia sẻ tài khoản cho người khác",
                "Giữ gìn vệ sinh chung, không mang đồ ăn uống vào khu vực đọc sách",
                "Tắt chuông điện thoại hoặc để chế độ rung khi ở trong thư viện"
            ]
        },
        {
            id: 6,
            icon: <SafetyOutlined />,
            title: "Xử lý vi phạm",
            description: "Công bằng - Nghiêm minh",
            items: [
                "Vi phạm quá hạn từ 3 lần trở lên: tạm khóa mượn sách 30 ngày",
                "Cố tình làm hỏng, mất sách: xử lý theo quy định và ghi nhận vào hệ thống",
                "Vi phạm nội quy thư viện (ồn ào, hút thuốc): nhắc nhở, nặng hơn sẽ bị khóa thẻ 1 tháng",
                "Các trường hợp vi phạm nghiêm trọng sẽ báo cáo lên Ban Giám hiệu"
            ]
        }
    ];

    return (
        <div className="min-h-screen flex flex-col font-sans bg-gradient-to-b from-stone-100 via-white to-stone-100">
            <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
                <Header />
            </header>

            {/* Hero Section - Lớp 1: Đậm nhất */}
            <section className="relative bg-gradient-to-br from-amber-100 via-amber-50 to-stone-100 py-20 md:py-28 overflow-hidden shadow-inner">
                {/* Decorative elements */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0" style={{ 
                        backgroundImage: `radial-gradient(circle at 20% 50%, #b87333 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}></div>
                </div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-stone-200/30 rounded-full blur-3xl"></div>
                
                <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
                    <div className="mb-6">
                        <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-5 py-2 rounded-full border border-amber-300 shadow-lg">
                            <ThunderboltOutlined className="text-amber-600 text-sm" />
                            <span className="text-xs md:text-sm tracking-wide text-stone-700 font-medium uppercase">
                                QUY ĐỊNH CHÍNH THỨC
                            </span>
                            <RocketOutlined className="text-amber-600 text-sm" />
                        </div>
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4">
                        <span className="bg-gradient-to-r from-stone-800 via-amber-700 to-stone-800 bg-clip-text text-transparent">
                            NỘI QUY THƯ VIỆN
                        </span>
                    </h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-stone-400 mx-auto rounded-full shadow-sm"></div>
                    
                    <p className="mt-6 text-stone-700 max-w-2xl mx-auto text-base md:text-lg flex items-center justify-center gap-2">
                        <FileTextOutlined className="text-amber-600" />
                        Khám phá những quy định giúp bạn trở thành độc giả mẫu mực
                        <HeartOutlined className="text-amber-600" />
                    </p>

                    {/* Stats với nền phân cấp */}
                    <div className="mt-10 flex justify-center gap-6 md:gap-10">
                        <div className="text-center bg-white/50 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm">
                            <div className="text-2xl md:text-3xl font-bold text-amber-700">6</div>
                            <div className="text-xs text-stone-600">Quy định chính</div>
                        </div>
                        <div className="text-center bg-white/50 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm">
                            <div className="text-2xl md:text-3xl font-bold text-amber-700">24/7</div>
                            <div className="text-xs text-stone-600">Hỗ trợ trực tuyến</div>
                        </div>
                        <div className="text-center bg-white/50 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm">
                            <div className="text-2xl md:text-3xl font-bold text-amber-700">100%</div>
                            <div className="text-xs text-stone-600">Minh bạch</div>
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce-slow hidden md:block">
                    <div className="w-5 h-8 border-2 border-amber-400/50 rounded-full flex justify-center">
                        <div className="w-0.5 h-1.5 bg-amber-500 rounded-full mt-1.5 animate-scroll-down"></div>
                    </div>
                </div>
            </section>

            {/* Rules Section - Lớp 2: Trung gian */}
            <section className="bg-white py-12 md:py-16 shadow-inner">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-2">
                            CHI TIẾT CÁC QUY ĐỊNH
                        </h2>
                        <p className="text-stone-500">Hãy đọc kỹ để trở thành độc giả thông thái</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {rules.map((rule, index) => (
                            <div
                                key={rule.id}
                                className="animate-card opacity-0 translate-y-8"
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                <div className="group h-full bg-gradient-to-br from-white to-stone-50 rounded-xl border border-stone-200 hover:border-amber-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                                    {/* Color bar phân cấp */}
                                    <div className={`h-1.5 bg-gradient-to-r from-amber-400 to-amber-600`}></div>
                                    
                                    <div className="p-5 h-full flex flex-col">
                                        {/* Icon với nền đậm */}
                                        <div className="relative mb-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-stone-100 rounded-xl flex items-center justify-center text-2xl text-amber-600 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                                {rule.icon}
                                            </div>
                                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm">
                                                {rule.id}
                                            </div>
                                        </div>
                                        
                                        <h3 className="text-lg font-bold text-stone-800 mb-1 flex items-center gap-1">
                                            {rule.title}
                                            <TrophyOutlined className="text-xs text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </h3>
                                        <p className="text-xs text-stone-400 mb-3 flex items-center gap-1">
                                            <ClockCircleOutlined className="text-[10px]" />
                                            {rule.description}
                                        </p>
                                        
                                        <ul className="space-y-2 flex-grow">
                                            {rule.items.map((item, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-stone-600 text-sm group/item">
                                                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-1.5 flex-shrink-0 group-hover/item:scale-150 transition-all"></div>
                                                    <span className="group-hover/item:translate-x-0.5 transition-transform">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        
                                        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                                            <span className="text-[10px] text-stone-400 flex items-center gap-1">
                                                <BookOutlined className="text-[10px]" />
                                                Điều {rule.id}
                                            </span>
                                            <HeartOutlined className="text-stone-300 text-xs group-hover:text-amber-500 transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer Note - Lớp 3: Nền tối hơn */}
            <section className="bg-gradient-to-br from-stone-100 to-stone-50 py-12 border-t border-stone-200">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-white rounded-xl p-6 shadow-md border border-stone-200">
                        <div className="text-center">
                            <div className="inline-flex items-center gap-2 bg-amber-50 rounded-full px-4 py-1.5 shadow-sm mb-4">
                                <GlobalOutlined className="text-amber-600 text-sm" />
                                <span className="text-xs font-medium text-stone-700">CẬP NHẬT MỚI NHẤT</span>
                            </div>
                            <p className="text-stone-700 mb-2">
                                <span className="font-bold text-amber-600">📌 Lưu ý quan trọng:</span> Nội quy có thể được cập nhật theo từng học kỳ
                            </p>
                            <p className="text-stone-500 text-sm">
                                Mọi thắc mắc vui lòng liên hệ phòng Thư viện - Tầng 2, Tòa nhà Trung tâm
                            </p>
                            <div className="mt-4 flex justify-center gap-2">
                                <div className="w-8 h-0.5 bg-amber-300 rounded-full"></div>
                                <div className="w-2 h-0.5 bg-amber-500 rounded-full"></div>
                                <div className="w-8 h-0.5 bg-amber-300 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer>
                <Footer />
            </footer>

            <style jsx>{`
                @keyframes fade-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes scroll-down {
                    0% { transform: translateY(0); opacity: 1; }
                    100% { transform: translateY(8px); opacity: 0; }
                }
                
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0) translateX(-50%); }
                    50% { transform: translateY(-8px) translateX(-50%); }
                }
                
                .animate-card {
                    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                .animate-card-visible {
                    animation: fade-up 0.6s ease-out forwards;
                    opacity: 1 !important;
                    transform: translateY(0) !important;
                }
                
                .animate-scroll-down {
                    animation: scroll-down 1.5s ease-in-out infinite;
                }
                
                .animate-bounce-slow {
                    animation: bounce-slow 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}

export default NoiQuy;