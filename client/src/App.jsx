import { useEffect } from 'react';
import CardBody from './components/Cardbody';
import Footer from './components/Footer';
import Header from './components/Header';
import TopBorrowedBooks from './components/TopBorrowedBooks';
import { requestGetAllProduct, requestGetTopBorrowedProduct } from './config/request';
import { useState } from 'react';
import { Carousel } from 'antd';
import 'antd/dist/reset.css';

function App() {
    const [dataProduct, setDataProduct] = useState([]);
    const [topBorrowedBooks, setTopBorrowedBooks] = useState([]);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Số sản phẩm mỗi trang

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resProducts, resTopBooks] = await Promise.all([
                    requestGetAllProduct(),
                    requestGetTopBorrowedProduct()
                ]);
                setDataProduct(resProducts?.metadata || []);
                setTopBorrowedBooks(resTopBooks?.metadata || []);
            } catch (error) {
                console.error("Failed to fetch products. Backend might be offline.", error);
                setDataProduct([]);
                setTopBorrowedBooks([]);
            }
        };
        fetchData();
    }, []);

    // Tính toán sản phẩm hiển thị theo trang hiện tại
    const totalPages = Math.ceil(dataProduct.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProducts = dataProduct.slice(startIndex, endIndex);

    // Hàm chuyển trang
    const goToPage = (page) => {
        setCurrentPage(page);
        // Scroll lên đầu danh sách sách
        const element = document.getElementById('danh-sach-sach');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const slides = [
        {
            id: 1,
            image: "https://kenh14cdn.com/203336854389633024/2023/7/20/photo-38-1689911855181560754579.jpg",
            title: "Thư viện Trường Đại học",
            subtitle: "Kiến Trúc Đà Nẵng",
            description: "Nơi khởi nguồn sáng tạo, kết nối tri thức và kiến tạo tương lai cho cộng đồng sinh viên Kiến trúc.",
            buttonText: "Bắt đầu tra cứu sách",
            buttonLink: "#danh-sach-sach"
        },
        {
            id: 2,
            image: "https://mir-s3-cdn-cf.behance.net/projects/max_808/bcd0f9182148135.Y3JvcCwyNTI1LDE5NzUsMCw2Mg.jpg",
            title: "Hơn 10.000 đầu sách",
            subtitle: "Đa dạng thể loại",
            description: "Từ kiến trúc, nghệ thuật, thiết kế đến khoa học kỹ thuật và nhân văn.",
            buttonText: "Khám phá kho sách",
            buttonLink: "#danh-sach-sach"
        },
        {
            id: 3,
            image: "https://tse4.mm.bing.net/th/id/OIP.N4SiI1RgoHXXv-NmoP8ewwHaEK?rs=1&pid=ImgDetMain&o=7&rm=3",
            title: "Không gian đọc lý tưởng",
            subtitle: "Yên tĩnh - Thoáng đãng",
            description: "Phòng đọc hiện đại với ánh sáng tự nhiên, không gian xanh mát, tạo cảm hứng học tập.",
            buttonText: "Tìm hiểu thêm",
            buttonLink: "#lien-he"
        },
        {
            id: 4,
            image: "https://peco.vn/wp-content/uploads/2022/09/Cong-nghe-thong-tin-Viettel-%E2%80%93-Khach-hang-la-doanh-nghiep.jpg",
            title: "Mượn sách trực tuyến",
            subtitle: "Tiện lợi - Nhanh chóng",
            description: "Đặt giữ sách online, nhận tại thư viện. Quản lý mượn trả dễ dàng qua tài khoản cá nhân.",
            buttonText: "Đăng ký ngay",
            buttonLink: "#danh-sach-sach"
        }
    ];

    return (
        <div className="bg-slate-50 min-h-screen flex flex-col font-sans">
            <header className="sticky top-0 z-50">
                <Header />
            </header>

            {/* Carousel Slider */}
            <section className="relative w-full overflow-hidden">
                <Carousel 
                    autoplay={true}
                    autoplaySpeed={3000}
                    effect="scrollx"
                    pauseOnHover={false}
                    dots={true}
                    infinite={true}
                    speed={500}
                    className="h-[85vh] min-h-[550px]"
                >
                    {slides.map((slide) => (
                        <div key={slide.id}>
                            <div className="relative h-[85vh] min-h-[550px] w-full overflow-hidden">
                                <div 
                                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                                    style={{ backgroundImage: `url(${slide.image})` }}
                                ></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                                
                                <div className="relative h-full flex items-center justify-start max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                    <div className="max-w-2xl text-white animate-fade-in-up">
                                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full mb-6 border border-white/30">
                                            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></div>
                                            <span className="text-xs tracking-wider uppercase font-medium">
                                                {slide.subtitle}
                                            </span>
                                        </div>
                                        
                                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-4 leading-tight">
                                            {slide.title}
                                        </h1>
                                        
                                        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-xl leading-relaxed">
                                            {slide.description}
                                        </p>
                                        
                                        <button
                                            onClick={() => {
                                                const element = document.querySelector(slide.buttonLink);
                                                if (element) {
                                                    element.scrollIntoView({ behavior: 'smooth' });
                                                }
                                            }}
                                            className="group relative px-8 py-3.5 bg-gradient-to-r from-[#b87333] to-[#9a5e2a] hover:from-[#9a5e2a] hover:to-[#b87333] text-white rounded-lg font-semibold shadow-lg hover:shadow-amber-500/30 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
                                        >
                                            <span className="relative z-10 flex items-center gap-2">
                                                {slide.buttonText}
                                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                                                </svg>
                                            </span>
                                            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/30 to-transparent"></div>
                            </div>
                        </div>
                    ))}
                </Carousel>
            </section>

            {/* Phần chuyển tiếp - Wave Decoration + Giới thiệu */}
            <div className="relative bg-slate-50">
                {/* Wave SVG */}
                <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] -translate-y-[1px]">
                    <svg className="relative block w-full h-[60px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
                              fill="#f8fafc" opacity="1"></path>
                    </svg>
                </div>
                
                {/* Section giới thiệu nhỏ */}
                <div className="pt-16 pb-8 text-center">
                    <div className="max-w-3xl mx-auto px-4">
                        <div className="inline-flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-full mb-4">
                            <span className="text-amber-600 text-sm">📚</span>
                            <span className="text-xs uppercase tracking-wider text-amber-700 font-medium">Kho sách phong phú</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-serif font-bold text-stone-800 mb-3">
                            Khám phá ngay những đầu sách <span className="text-[#b87333]">nổi bật</span>
                        </h2>
                        <p className="text-stone-500 text-sm md:text-base max-w-xl mx-auto">
                            Hàng ngàn cuốn sách đang chờ bạn khám phá. Từ kiến trúc, nghệ thuật đến khoa học kỹ thuật
                        </p>
                        
                        {/* Decorative line */}
                        <div className="flex justify-center gap-2 mt-6">
                            <div className="w-8 h-0.5 bg-amber-300 rounded-full"></div>
                            <div className="w-2 h-0.5 bg-[#b87333] rounded-full"></div>
                            <div className="w-8 h-0.5 bg-amber-300 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main - Danh sách sách với phân trang */}
            <main id="danh-sach-sach" className="max-w-7xl mx-auto px-4 py-8 mb-12 flex-grow">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {currentProducts?.map((item) => (
                        <CardBody key={item.id} data={item} />
                    ))}
                </div>

                {/* Pagination Component */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-12">
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                                currentPage === 1
                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    : 'bg-white text-slate-700 hover:bg-[#b87333] hover:text-white border border-slate-200 hover:border-[#b87333]'
                            }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        
                        {[...Array(totalPages)].map((_, index) => {
                            const page = index + 1;
                            // Hiển thị tối đa 5 trang, có dấu ...
                            if (
                                page === 1 ||
                                page === totalPages ||
                                (page >= currentPage - 1 && page <= currentPage + 1)
                            ) {
                                return (
                                    <button
                                        key={page}
                                        onClick={() => goToPage(page)}
                                        className={`w-10 h-10 rounded-lg font-semibold transition-all duration-300 ${
                                            currentPage === page
                                                ? 'bg-[#b87333] text-white shadow-md'
                                                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                );
                            } else if (
                                page === currentPage - 2 ||
                                page === currentPage + 2
                            ) {
                                return (
                                    <span key={page} className="text-slate-400">
                                        ...
                                    </span>
                                );
                            }
                            return null;
                        })}
                        
                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                                currentPage === totalPages
                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    : 'bg-white text-slate-700 hover:bg-[#b87333] hover:text-white border border-slate-200 hover:border-[#b87333]'
                            }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Hiển thị số lượng sách */}
                <div className="text-center mt-6 text-sm text-slate-500">
                    Hiển thị {startIndex + 1} - {Math.min(endIndex, dataProduct.length)} trên tổng số {dataProduct.length} sách
                </div>
            </main>

            {/* Top Borrowed Books Section */}
            <TopBorrowedBooks books={topBorrowedBooks} />

            <footer id="lien-he">
                <Footer />
            </footer>

            <style jsx>{`
                :global(.slick-dots) {
                    bottom: 20px !important;
                }
                :global(.slick-dots li button) {
                    background: rgba(255,255,255,0.5) !important;
                    width: 8px !important;
                    height: 8px !important;
                    border-radius: 50% !important;
                }
                :global(.slick-dots li.slick-active button) {
                    background: #b87333 !important;
                    width: 10px !important;
                    height: 10px !important;
                }
                :global(.slick-dots li) {
                    margin: 0 3px !important;
                }
                
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease-out forwards;
                }
            `}</style>
        </div>
    );
}

export default App;