import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faUser, faCalendar, faLanguage, faBoxes, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

import ModalBuyBook from '../components/ModalBuyBook';
import { useState } from 'react';

function CardBody({ data }) {
    const [visible, setVisible] = useState(false);
    const [bookData, setBookData] = useState({});

    const showModal = async (data) => {
        setBookData(data);
        setVisible(true);
    };

    const onCancel = () => {
        setVisible(false);
    };

    return (
        <div className="h-full bg-white rounded-2xl shadow-md border border-slate-100 hover:shadow-2xl hover:border-indigo-200 transition-all duration-500 overflow-hidden group relative flex flex-col hover:-translate-y-2">
            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-transparent to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"></div>
            
            {/* Ảnh sách */}
            <Link to={`/product/${data.id}`}>
                <div className="relative overflow-hidden aspect-[4/5] bg-gradient-to-b from-slate-50 to-slate-100 border-b border-slate-100 p-4 flex items-center justify-center">
                    <img
                        src={`${import.meta.env.VITE_API_URL_IMAGE}/${data.image}`}
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700 drop-shadow-md"
                        alt={data.nameProduct}
                    />
                </div>
            </Link>

            <div className="p-5 flex flex-col flex-grow relative z-10">
                {/* Tên sách */}
                <Link to={`/product/${data.id}`}>
                    <h6 className="text-slate-800 font-extrabold mb-3 text-lg leading-tight group-hover:text-indigo-600 transition-colors duration-300 line-clamp-2">
                        {data.nameProduct}
                    </h6>
                </Link>

                {/* Thông tin chi tiết */}
                <div className="space-y-2.5 mb-5 flex-grow">
                    {/* Nhà xuất bản */}
                    <div className="flex items-center text-xs text-slate-600 bg-white p-2 rounded-lg border border-slate-100 shadow-sm group-hover:border-blue-100 transition-colors">
                        <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center mr-2.5">
                            <FontAwesomeIcon icon={faUser} className="w-3 text-blue-500" />
                        </div>
                        <span className="truncate font-medium">{data.publisher}</span>
                    </div>

                    {/* Công ty phát hành */}
                    {data.publishingCompany && (
                        <div className="flex items-center text-xs text-slate-600 bg-white p-2 rounded-lg border border-slate-100 shadow-sm group-hover:border-purple-100 transition-colors">
                            <div className="w-6 h-6 rounded-full bg-purple-50 flex items-center justify-center mr-2.5">
                                <FontAwesomeIcon icon={faBuilding} className="w-3 text-purple-500" />
                            </div>
                            <span className="truncate font-medium">{data.publishingCompany}</span>
                        </div>
                    )}

                    {/* Số trang và năm xuất bản */}
                    <div className="flex items-center justify-between gap-2 text-xs">
                        <div className="flex-1 flex items-center bg-white p-2 rounded-lg border border-slate-100 shadow-sm">
                            <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center mr-2">
                                <FontAwesomeIcon icon={faBookOpen} className="w-3 text-emerald-500" />
                            </div>
                            <span className="text-slate-600 font-medium">{data.pages} trang</span>
                        </div>
                        <div className="flex-1 flex items-center bg-white p-2 rounded-lg border border-slate-100 shadow-sm">
                            <div className="w-6 h-6 rounded-full bg-amber-50 flex items-center justify-center mr-2">
                                <FontAwesomeIcon icon={faCalendar} className="w-3 text-amber-500" />
                            </div>
                            <span className="text-slate-600 font-medium">{data.publishYear}</span>
                        </div>
                    </div>

                    {/* Ngôn ngữ */}
                    {data.language && (
                        <div className="flex items-center text-xs text-slate-600 bg-white p-2 rounded-lg border border-slate-100 shadow-sm group-hover:border-teal-100 transition-colors">
                            <div className="w-6 h-6 rounded-full bg-teal-50 flex items-center justify-center mr-2.5">
                                <FontAwesomeIcon icon={faLanguage} className="w-3 text-teal-500" />
                            </div>
                            <span className="font-medium">{data.language}</span>
                        </div>
                    )}
                    
                    {/* Divider */}
                    <div className="w-full h-px bg-slate-100 my-3"></div>

                    {/* Loại bìa và Số lượng */}
                    <div className="flex items-center justify-between gap-2 text-xs mt-2">
                        <div className={`flex-1 flex items-center justify-center p-2 rounded-lg border shadow-sm ${
                            data.covertType === 'hard'
                                ? 'bg-indigo-50/50 border-indigo-100 text-indigo-700'
                                : 'bg-orange-50/50 border-orange-100 text-orange-700'
                        }`}>
                            <span className="font-bold">{data.covertType === 'hard' ? '📘 Bìa cứng' : '📙 Bìa mềm'}</span>
                        </div>
                        
                        <div className={`flex-1 flex items-center justify-center p-2 rounded-lg border shadow-sm ${
                            data.stock > 0
                                ? 'bg-emerald-50/50 border-emerald-100 text-emerald-700'
                                : 'bg-rose-50/50 border-rose-100 text-rose-700'
                        }`}>
                            <FontAwesomeIcon icon={faBoxes} className={`mr-1.5 w-3 ${data.stock > 0 ? 'text-emerald-500' : 'text-rose-500'}`} />
                            <span className="font-bold">{data.stock > 0 ? `Còn ${data.stock} quyển` : 'Hết hàng'}</span>
                        </div>
                    </div>
                </div>

                {/* Nút hành động */}
                <div className="mt-auto pt-2">
                    <button
                        onClick={() => showModal(data)}
                        disabled={data.stock <= 0}
                        className={`w-full py-3.5 px-4 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 ${
                            data.stock > 0
                                ? 'bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white shadow-lg hover:shadow-indigo-500/30'
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                        }`}
                    >
                        {data.stock > 0 ? (
                            <>
                                <span>Mượn sách ngay</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </>
                        ) : 'Hết hàng'}
                    </button>
                </div>
            </div>
            <ModalBuyBook visible={visible} onCancel={onCancel} bookData={bookData} />
        </div>
    );
}

export default CardBody;
