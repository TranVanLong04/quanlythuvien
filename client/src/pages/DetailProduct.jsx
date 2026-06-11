import { useEffect } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { Link, useParams } from 'react-router-dom';
import { requestGetOneProduct } from '../config/request';
import { useState } from 'react';
import ModalBorrowBook from '../components/ModalBuyBook';
import { useStore } from '../hooks/useStore';

function DetailProduct() {
    const { id } = useParams();
    const [dataProduct, setDataProduct] = useState(null); // start with null for loading state
    const [visible, setVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const { dataUser } = useStore();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const res = await requestGetOneProduct(id);
                setDataProduct(res?.metadata || null);
            } catch (error) {
                console.error('Lỗi khi tải thông tin sách:', error);
                // Dữ liệu giả (Mock data) để hiển thị giao diện khi API backend chưa chạy
                setDataProduct({
                    id: id,
                    nameProduct: "Thiết Kế Web Hiện Đại Với React",
                    author: "Antigravity",
                    publisher: "NXB Công Nghệ Mới",
                    publishingCompany: "TechBooks VN",
                    coverType: "hard",
                    pages: 350,
                    language: "Tiếng Việt",
                    publishYear: 2025,
                    stock: 12,
                    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400", // Tham khảo hình ảnh
                    description: "Cuốn sách cung cấp kiến thức toàn diện về việc xây dựng giao diện front-end với React và Tailwind CSS. \n\nBạn sẽ học cách kiến trúc ứng dụng quy mô lớn, tạo các hook tùy chỉnh cũng như sử dụng các mô hình UI phổ biến như Glassmorphism. Sách phù hợp cho cả người mới bắt đầu lẫn lập trình viên trung cấp muốn nâng cao kỹ năng thiết kế và tối ưu trải nghiệm người dùng."
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const showModal = async () => {
        setVisible(true);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!dataProduct) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
                <header className="sticky top-0 z-50">
                    <Header />
                </header>
                <div className="flex-grow flex items-center justify-center p-4 z-10">
                    <div className="text-center p-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl w-full max-w-md border border-white/60">
                        <div className="text-6xl mb-6">📚</div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-3">Không tìm thấy sách</h2>
                        <p className="text-slate-500 mb-8">Cuốn sách bạn tìm kiếm không tồn tại hoặc hệ thống đang bảo trì.</p>
                        <Link to="/" className="inline-flex items-center justify-center w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-base shadow-lg transition-transform hover:-translate-y-0.5">
                            Về trang chủ
                        </Link>
                    </div>
                </div>
                <footer>
                    <Footer />
                </footer>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
            {/* Decorative background blobs */}
            <div className="absolute top-[0%] left-[10%] w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>
            <div className="absolute top-[20%] right-[5%] w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none animate-blob"></div>

            <header className="sticky top-0 z-50">
                <Header />
            </header>

            {/* Breadcrumb */}
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 relative z-10 animate-fade-in-up">
                <nav className="flex items-center space-x-2 text-sm text-slate-500 font-medium bg-white/50 px-4 py-2 rounded-xl inline-flex backdrop-blur-md border border-white/60 shadow-sm">
                    <Link to={'/'} className="hover:text-blue-600 transition-colors">Trang chủ</Link>
                    <span>/</span>
                    <Link to={'/'} onClick={() => {
                        setTimeout(() => {
                            document.getElementById('danh-sach-sach')?.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                    }} className="hover:text-blue-600 transition-colors">Kho sách</Link>
                    <span>/</span>
                    <span className="text-blue-700 font-semibold">{dataProduct.nameProduct || 'Chi tiết'}</span>
                </nav>
            </div>

            <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 relative z-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 p-8 lg:p-12">
                        {/* Book Image */}
                        <div className="lg:col-span-4 flex justify-center lg:justify-start items-start">
                            <div className="w-full max-w-sm relative group overflow-hidden rounded-2xl shadow-xl">
                                <img
                                    src={dataProduct.image?.includes('http') ? dataProduct.image : `${import.meta.env.VITE_API_URL_IMAGE}/${dataProduct.image}`}
                                    alt={dataProduct.nameProduct}
                                    className="w-full h-auto aspect-[3/4] object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                        </div>

                        {/* Book Details */}
                        <div className="lg:col-span-8 flex flex-col">
                            {/* Title & Author */}
                            <div className="mb-6">
                                <div className="inline-block px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-indigo-100 shadow-sm">
                                    Sách nổi bật
                                </div>
                                <h1 className="text-3xl sm:text-4xl md:text-4xl font-extrabold text-slate-800 leading-tight mb-3">
                                    {dataProduct.nameProduct}
                                </h1>
                                <p className="text-lg text-slate-500 font-medium">
                                    Tác giả: <span className="text-indigo-600 font-semibold">{dataProduct.author || 'Chưa cập nhật'}</span>
                                </p>
                            </div>

                            {/* Info Grid */}
                            <div className="bg-slate-50/80 p-6 rounded-2xl border border-slate-100 shadow-inner mb-8">
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 text-sm sm:text-base">
                                    <div className="flex flex-col">
                                        <span className="text-slate-400 font-medium text-xs uppercase tracking-wider mb-1">Nhà xuất bản</span>
                                        <span className="font-bold text-slate-700">{dataProduct.publisher || '---'}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-slate-400 font-medium text-xs uppercase tracking-wider mb-1">Công ty phát hành</span>
                                        <span className="font-bold text-slate-700">{dataProduct.publishingCompany || '---'}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-slate-400 font-medium text-xs uppercase tracking-wider mb-1">Ngôn ngữ</span>
                                        <span className="font-bold text-slate-700">{dataProduct.language || '---'}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-slate-400 font-medium text-xs uppercase tracking-wider mb-1">Năm xuất bản</span>
                                        <span className="font-bold text-slate-700">{dataProduct.publishYear || '---'}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-slate-400 font-medium text-xs uppercase tracking-wider mb-1">Loại bìa</span>
                                        <span className="font-bold text-slate-700">{dataProduct.coverType === 'hard' ? 'Bìa cứng' : (dataProduct.coverType === 'paperback' ? 'Bìa mềm' : '---')}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-slate-400 font-medium text-xs uppercase tracking-wider mb-1">Số trang</span>
                                        <span className="font-bold text-slate-700">{dataProduct.pages ? `${dataProduct.pages} trang` : '---'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Spacer */}
                            <div className="flex-grow"></div>

                            {/* Actions & Status */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-6 border-t border-slate-100">
                                <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                                    <span className="text-slate-500 font-medium text-sm">Kho:</span>
                                    <span className={`flex items-center text-sm font-bold ${dataProduct.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                        <span className={`w-2 h-2 rounded-full mr-2 ${dataProduct.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                        {dataProduct.stock > 0 ? `${dataProduct.stock} quyển sẵn sàng` : 'Hết sách'}
                                    </span>
                                </div>

                                <button
                                    onClick={showModal}
                                    disabled={dataProduct.stock <= 0}
                                    className={`px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 transform w-full sm:w-auto flex items-center justify-center ${
                                        dataProduct.stock > 0 
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white hover:shadow-xl hover:-translate-y-1 border-0'
                                            : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none'
                                    }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Đăng ký mượn ngay
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Description Block */}
                    <div className="bg-slate-50/50 border-t border-slate-100 p-8 lg:p-12">
                        <div className="max-w-4xl">
                            <h2 className="text-2xl font-extrabold text-slate-800 mb-6 flex items-center">
                                <span className="w-2 h-8 bg-blue-600 rounded-full mr-3"></span> Nội dung quyển sách
                            </h2>
                            <p className="text-slate-600 leading-relaxed text-[15px] md:text-lg whitespace-pre-line">
                                {dataProduct.description || 'Chưa có thông tin giới thiệu cho cuốn sách này.'}
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="mt-8">
                <Footer />
            </footer>
            {dataProduct && (
                <ModalBorrowBook visible={visible} onCancel={() => setVisible(false)} bookData={dataProduct} />
            )}
        </div>
    );
}

export default DetailProduct;
