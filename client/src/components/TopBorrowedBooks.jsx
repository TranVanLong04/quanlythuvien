import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faUser, faCalendar, faLanguage, faBoxes, faBuilding, faStar } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import ModalBuyBook from './ModalBuyBook';

function TopBorrowedBooks({ books }) {
    // ✅ TẤT CẢ HOOK ĐẶT Ở ĐẦU, TRƯỚC return
    const [visible, setVisible] = useState(false);
    const [bookData, setBookData] = useState({});
    const [selectedBook, setSelectedBook] = useState(null);

    // Show modal function
    const showModal = (data) => {
        setBookData(data);
        setVisible(true);
    };

    const onCancel = () => {
        setVisible(false);
    };

    // Effect để cập nhật selectedBook khi books thay đổi
    useEffect(() => {
        if (books && books.length > 0) {
            setSelectedBook(books[0]);
        }
    }, [books]);

    // ✅ Kiểm tra điều kiện SAU KHI đã gọi hết Hook
    if (!books || books.length === 0 || !selectedBook) return null;

    const selectedIndex = books.findIndex(b => b.id === selectedBook.id);

    return (
        <>
            <section className="bg-slate-50 py-16 border-t border-slate-200">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center justify-center gap-3">
                            <FontAwesomeIcon icon={faStar} className="text-amber-400" />
                            SÁCH MƯỢN NỔI BẬT TRONG THÁNG
                            <FontAwesomeIcon icon={faStar} className="text-amber-400" />
                        </h2>
                        <div className="w-24 h-1.5 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto mt-4 rounded-full"></div>
                        <p className="mt-4 text-slate-600 max-w-2xl mx-auto font-medium">
                            Khám phá những tựa sách được độc giả yêu thích và mượn nhiều nhất trong tháng qua.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left: List of Books */}
                        <div className="lg:col-span-4 flex flex-col gap-3.5 relative">
                            {books.map((book, index) => {
                                const isSelected = selectedBook.id === book.id;
                                return (
                                    <div 
                                        key={book.id || index}
                                        className={`relative flex items-center gap-4 p-3 rounded-2xl border cursor-pointer transition-all duration-300 group ${
                                            isSelected 
                                                ? 'bg-white border-amber-200 shadow-lg transform scale-[1.02] z-10' 
                                                : 'bg-white border-slate-100 shadow-sm hover:border-slate-300 hover:shadow-md hover:bg-slate-50/80 z-0'
                                        }`}
                                        onMouseEnter={() => setSelectedBook(book)}
                                    >
                                        {/* Number Badge */}
                                        <div className={`absolute -left-3 -top-3 w-8 h-8 rounded-full text-white text-sm font-bold flex items-center justify-center shadow-md border-2 border-white z-20 transition-colors duration-300 ${
                                            index === 0 ? 'bg-gradient-to-br from-yellow-300 to-yellow-500' :
                                            index === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-400' :
                                            index === 2 ? 'bg-gradient-to-br from-amber-600 to-orange-700' :
                                            'bg-gradient-to-br from-indigo-400 to-blue-500'
                                        }`}>
                                            {index + 1}
                                        </div>

                                        {/* Active Indicator Line */}
                                        <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 rounded-r-full bg-amber-500 transition-all duration-300 ${
                                            isSelected ? 'h-1/2 opacity-100' : 'h-0 opacity-0'
                                        }`}></div>

                                        <div className="w-16 h-20 flex-shrink-0 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 ml-2">
                                            <img 
                                                src={`${import.meta.env.VITE_API_URL_IMAGE}/${book.image}`} 
                                                alt={book.nameProduct}
                                                className="w-full h-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0 pr-2">
                                            <h4 className={`font-bold text-sm line-clamp-2 leading-snug mb-1 transition-colors duration-300 ${
                                                isSelected ? 'text-amber-700' : 'text-slate-800 group-hover:text-indigo-600'
                                            }`}>
                                                {book.nameProduct}
                                            </h4>
                                            <p className="text-xs text-slate-500 truncate flex items-center gap-1.5 font-medium">
                                                <FontAwesomeIcon icon={faUser} className={isSelected ? "text-amber-400 w-3" : "text-slate-400 w-3"} />
                                                {book.author || book.publisher || 'Đang cập nhật'}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Right: Selected Book Details */}
                        <div className="lg:col-span-8">
                            <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 flex flex-col md:flex-row gap-8 shadow-xl shadow-slate-200/50 h-full relative overflow-hidden transition-all duration-500">
                                {/* Decorative Background Blob */}
                                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-amber-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob pointer-events-none"></div>
                                
                                {/* Large Cover */}
                                <div className="w-full md:w-1/3 flex-shrink-0 relative z-10 flex flex-col items-center">
                                    <Link to={`/product/${selectedBook.id}`} className="block w-full">
                                        <div className="aspect-[3/4] relative rounded-2xl overflow-hidden shadow-2xl shadow-indigo-100 border border-slate-100 bg-white group mt-2 transition-transform duration-500 hover:-translate-y-2">
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-end justify-center pb-6">
                                                <span className="text-white font-bold text-sm flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                                                    Xem chi tiết <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                                                </span>
                                            </div>
                                            <img 
                                                src={`${import.meta.env.VITE_API_URL_IMAGE}/${selectedBook.image}`} 
                                                alt={selectedBook.nameProduct}
                                                className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-700 relative z-0"
                                            />
                                        </div>
                                    </Link>
                                    
                                    {/* Status Tags underneath image */}
                                    <div className="flex gap-2 mt-6 w-full justify-center">
                                        <div className={`px-4 py-1.5 rounded-full text-xs font-bold border ${
                                            selectedBook.covertType === 'hard'
                                                ? 'bg-indigo-50 border-indigo-100 text-indigo-700'
                                                : 'bg-orange-50 border-orange-100 text-orange-700'
                                        }`}>
                                            {selectedBook.covertType === 'hard' ? '📘 Bìa cứng' : '📙 Bìa mềm'}
                                        </div>
                                        <div className={`px-4 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                                            selectedBook.stock > 0
                                                ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                                                : 'bg-rose-50 border-rose-100 text-rose-700'
                                        }`}>
                                            <FontAwesomeIcon icon={faBoxes} className={selectedBook.stock > 0 ? 'text-emerald-500 w-3' : 'text-rose-500 w-3'} />
                                            {selectedBook.stock > 0 ? `Còn ${selectedBook.stock} quyển` : 'Hết hàng'}
                                        </div>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="w-full md:w-2/3 flex flex-col relative z-10">
                                    <div className="mb-3">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200 text-amber-800 text-xs font-bold rounded-full uppercase tracking-wider shadow-sm">
                                            <FontAwesomeIcon icon={faStar} className="text-amber-500 w-3" />
                                            Sách Nổi Bật Số {selectedIndex + 1}
                                        </span>
                                        {selectedBook.borrowCount !== undefined && selectedBook.borrowCount > 0 && (
                                            <span className="ml-3 inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-full shadow-sm">
                                                🔥 {selectedBook.borrowCount} lượt mượn
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-black text-slate-800 mb-5 leading-tight line-clamp-3">
                                        {selectedBook.nameProduct}
                                    </h3>

                                    <div className="grid grid-cols-2 gap-y-5 gap-x-6 mb-8 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                                        <div className="flex items-start gap-3.5 group">
                                            <div className="w-9 h-9 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center flex-shrink-0 group-hover:border-blue-200 group-hover:bg-blue-50 transition-colors">
                                                <FontAwesomeIcon icon={faUser} className="text-blue-500 w-4 group-hover:scale-110 transition-transform" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">Tác giả / NXB</p>
                                                <p className="text-sm font-bold text-slate-700 truncate w-32 md:w-40">{selectedBook.author || selectedBook.publisher || 'Đang cập nhật'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3.5 group">
                                            <div className="w-9 h-9 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center flex-shrink-0 group-hover:border-emerald-200 group-hover:bg-emerald-50 transition-colors">
                                                <FontAwesomeIcon icon={faBookOpen} className="text-emerald-500 w-4 group-hover:scale-110 transition-transform" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">Số trang</p>
                                                <p className="text-sm font-bold text-slate-700">{selectedBook.pages || '?'} trang</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3.5 group">
                                            <div className="w-9 h-9 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center flex-shrink-0 group-hover:border-purple-200 group-hover:bg-purple-50 transition-colors">
                                                <FontAwesomeIcon icon={faBuilding} className="text-purple-500 w-4 group-hover:scale-110 transition-transform" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">Phát hành</p>
                                                <p className="text-sm font-bold text-slate-700 truncate w-32 md:w-40">{selectedBook.publishingCompany || 'Đang cập nhật'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3.5 group">
                                            <div className="w-9 h-9 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center flex-shrink-0 group-hover:border-amber-200 group-hover:bg-amber-50 transition-colors">
                                                <FontAwesomeIcon icon={faCalendar} className="text-amber-500 w-4 group-hover:scale-110 transition-transform" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">Năm XL</p>
                                                <p className="text-sm font-bold text-slate-700">{selectedBook.publishYear || 'Đang cập nhật'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-8 flex-grow">
                                        <h4 className="text-sm font-bold text-slate-800 mb-2.5 flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-slate-400"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                                            Mô tả tóm tắt:
                                        </h4>
                                        <p className="text-sm text-slate-600 leading-relaxed line-clamp-4 relative z-10 pl-4 border-l-2 border-slate-200">
                                            {selectedBook.description || 'Chưa có thông tin mô tả chi tiết cho cuốn sách này trên hệ thống. Bạn có thể xem thêm thông tin chi tiết bằng cách nhấn vào nút bên dưới.'}
                                        </p>
                                    </div>

                                    {/* Actions - Nút mượn sách */}
                                    <div className="mt-auto grid grid-cols-2 gap-4">
                                        <Link to={`/product/${selectedBook.id}`} className="w-full">
                                            <button className="w-full py-3.5 px-4 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 transform hover:-translate-y-1 shadow-sm bg-white border-2 border-slate-200 text-slate-700 hover:border-indigo-500 hover:text-indigo-600 focus:ring-4 focus:ring-indigo-100 flex items-center justify-center gap-2 relative overflow-hidden group">
                                                <span className="relative z-10">Xem chi tiết</span>
                                            </button>
                                        </Link>
                                        <button 
                                            onClick={() => showModal(selectedBook)}
                                            disabled={selectedBook.stock <= 0}
                                            className={`w-full py-3.5 px-4 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 transform flex items-center justify-center gap-2 relative overflow-hidden group ${
                                                selectedBook.stock > 0
                                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-indigo-500/30 hover:-translate-y-1 focus:ring-4 focus:ring-indigo-200'
                                                    : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                                            }`}
                                        >
                                            {selectedBook.stock > 0 ? (
                                                <>
                                                    <span className="relative z-10">Mượn sách ngay</span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </>
                                            ) : 'Hết hàng'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modal mượn sách */}
            <ModalBuyBook visible={visible} onCancel={onCancel} bookData={bookData} />
        </>
    );
}

export default TopBorrowedBooks;