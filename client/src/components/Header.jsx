import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import { Dropdown, Avatar, Button, Badge, Popover, List } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined, HistoryOutlined, SendOutlined, BellOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import useDebounce from '../hooks/useDebounce';
import { requestLogout, requestSearchProduct, requestGetNotifications, requestMarkAsReadNotification } from '../config/request';
import logo from '../assets/images/logo.webp';

function Header() {
    const { dataUser } = useStore();
    const navigate = useNavigate();

    const [valueSearch, setValueSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isResultVisible, setIsResultVisible] = useState(false);

    const debounce = useDebounce(valueSearch, 500);

    const [notifications, setNotifications] = useState([]);
    const unreadCount = notifications.filter(n => !n.isRead).length;

    useEffect(() => {
        const fetchNotifications = async () => {
            if (dataUser && dataUser.id) {
                try {
                    const res = await requestGetNotifications();
                    if (res && res.metadata) {
                        setNotifications(res.metadata);
                    }
                } catch (error) {
                    console.error('Lỗi khi tải thông báo:', error);
                }
            }
        };
        fetchNotifications();
    }, [dataUser]);

    const handleNotificationClick = async (notification) => {
        if (!notification.isRead) {
            try {
                await requestMarkAsReadNotification(notification.id);
                setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n));
            } catch (error) {
                console.error('Lỗi khi đánh dấu thông báo đã đọc:', error);
            }
        }
        if (notification.link) {
            navigate(notification.link);
        }
    };

    const notificationContent = (
        <div className="w-80 max-h-96 overflow-y-auto -mx-3 -my-2">
            <List
                dataSource={notifications}
                locale={{ emptyText: 'Không có thông báo nào' }}
                renderItem={(item) => (
                    <List.Item
                        className={`cursor-pointer transition-colors px-4 py-3 border-b hover:bg-gray-100 ${item.isRead ? 'bg-white' : 'bg-blue-50'}`}
                        onClick={() => handleNotificationClick(item)}
                    >
                        <div className="flex flex-col w-full">
                            <span className={`text-sm ${item.isRead ? 'text-gray-600' : 'text-gray-900 font-semibold'}`}>
                                {item.message}
                            </span>
                            <span className="text-xs text-gray-400 mt-1">
                                {new Date(item.createdAt).toLocaleString('vi-VN')}
                            </span>
                        </div>
                    </List.Item>
                )}
            />
        </div>
    );

    const handleLogout = async () => {
        try {
            await requestLogout();
            navigate('/');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.error('Failed to logout:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!debounce.trim()) {
                setSearchResults([]);
                setIsResultVisible(false);
                return;
            }
            try {
                const res = await requestSearchProduct(debounce);
                setSearchResults(res.metadata);
                setIsResultVisible(res.metadata.length > 0);
            } catch (error) {
                console.error('Failed to search for products:', error);
                setSearchResults([]);
                setIsResultVisible(false);
            }
        };
        fetchData();
    }, [debounce]);

    // Hàm xử lý scroll cho các section trên trang chủ
    const handleScrollToSection = (sectionId) => {
        if (window.location.pathname === '/') {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            // Nếu không phải trang chủ, chuyển về trang chủ và scroll
            navigate('/');
            setTimeout(() => {
                const element = document.getElementById(sectionId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
    };

    return (
        <div className="bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200/50 w-full transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 sm:h-20">
                    {/* Logo */}
                    <Link to={'/'}>
                        <div className="flex items-center group">
                            <div className="flex-shrink-0 transition-transform group-hover:scale-105 duration-300">
                                <img src={logo} alt="Thư Viện Logo" className="h-10 sm:h-12 w-auto object-contain drop-shadow-sm" />
                            </div>
                        </div>
                    </Link>

                    {/* Navigation Menu - ĐÃ SỬA */}
                    <nav className="hidden lg:flex items-center gap-10 ml-10">
                        <button 
                            onClick={() => handleScrollToSection('danh-sach-sach')}
                            className="text-slate-600 hover:text-[#b87333] font-semibold transition-colors duration-300 text-base cursor-pointer"
                        >
                            Mượn sách
                        </button>
                        
                        <Link 
                            to="/noi-quy"
                            className="text-slate-600 hover:text-[#b87333] font-semibold transition-colors duration-300 text-base cursor-pointer"
                        >
                            Nội quy
                        </Link>
                        
                        <button 
                            onClick={() => handleScrollToSection('lien-he')}
                            className="text-slate-600 hover:text-[#b87333] font-semibold transition-colors duration-300 text-base cursor-pointer"
                        >
                            Liên hệ
                        </button>
                    </nav>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-md xl:max-w-lg mx-6 relative">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg
                                    className="h-5 w-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={valueSearch}
                                onChange={(e) => setValueSearch(e.target.value)}
                                onFocus={() => setIsResultVisible(true)}
                                onBlur={() => setTimeout(() => setIsResultVisible(false), 200)}
                                placeholder="Tìm kiếm sách, tác giả..."
                                className="block w-full pl-10 pr-3 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b87333]/50 focus:border-[#b87333] focus:bg-white transition-all duration-300 shadow-inner"
                            />
                        </div>
                        {isResultVisible && searchResults.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                                <ul className="max-h-80 overflow-y-auto">
                                    {searchResults.map((product) => (
                                        <li key={product.id}>
                                            <Link
                                                to={`/product/${product.id}`}
                                                className="flex items-center p-3 hover:bg-gray-100 transition-colors"
                                            >
                                                <img
                                                    src={`${import.meta.env.VITE_API_URL_IMAGE}/${product.image}`}
                                                    alt={product.nameProduct}
                                                    className="w-12 h-16 object-cover rounded-md mr-4"
                                                />
                                                <div>
                                                    <p className="font-semibold text-gray-800">{product.nameProduct}</p>
                                                    <p className="text-sm text-gray-500">{product.publisher}</p>
                                                </div>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Auth Buttons / User Info */}
                    <div className="flex items-center space-x-4">
                        {dataUser && dataUser.id ? (
                            <div className="flex items-center space-x-4">
                                {/* Thêm biểu tượng thông báo */}
                                <Popover 
                                    content={notificationContent} 
                                    title={<div className="font-bold text-gray-800 px-1 py-1">Thông báo</div>} 
                                    trigger="click"
                                    placement="bottomRight"
                                >
                                    <Badge count={unreadCount} overflowCount={99} className="cursor-pointer" offset={[-2, 2]}>
                                        <BellOutlined className="text-2xl text-gray-600 hover:text-[#b87333] transition-colors mt-1" />
                                    </Badge>
                                </Popover>

                                {/* User Info Dropdown */}
                                <Dropdown
                                menu={{
                                    items: [
                                        {
                                            key: 'profile',
                                            icon: <UserOutlined />,
                                            label: 'Thông tin cá nhân',
                                            onClick: () => navigate('/infoUser'),
                                        },
                                        {
                                            key: 'history',
                                            icon: <HistoryOutlined />,
                                            label: 'Lịch sử mượn sách',
                                            onClick: () => navigate('/infoUser'),
                                        },
                                        {
                                            key: 'request',
                                            icon: <SendOutlined />,
                                            label: 'Gửi yêu cầu cấp mã sinh viên',
                                            onClick: () => navigate('/infoUser'),
                                        },
                                        {
                                            type: 'divider',
                                        },
                                        {
                                            key: 'logout',
                                            icon: <LogoutOutlined />,
                                            label: 'Đăng xuất',
                                            danger: true,
                                            onClick: () => handleLogout(),
                                        },
                                    ],
                                }}
                                placement="bottomRight"
                                arrow
                            >
                                <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
                                    <Avatar
                                        size={36}
                                        icon={<UserOutlined />}
                                        src={dataUser.avatar ? `${import.meta.env.VITE_API_URL}/${dataUser.avatar}` : undefined}
                                        className="bg-[#b87333] flex-shrink-0 shadow-sm"
                                    />
                                    <div className="flex flex-col justify-center">
                                        <div className="text-[14px] font-semibold text-gray-900 leading-tight">
                                            {dataUser.fullName || 'Người dùng'}
                                        </div>
                                        <div className="text-[12px] text-gray-500 tracking-wide leading-tight mt-0.5">
                                            {dataUser.email}
                                        </div>
                                    </div>
                                </div>
                            </Dropdown>
                            </div>
                        ) : (
                            // Login/Register Buttons
                            <>
                                <Link to={'/login'}>
                                    <Button type="text" className="text-slate-600 hover:text-[#b87333] font-medium transition-colors px-4 rounded-xl">
                                        Đăng nhập
                                    </Button>
                                </Link>
                                <Link to={'/register'}>
                                    <button className="bg-gradient-to-r from-[#b87333] to-[#9a5e2a] hover:from-[#9a5e2a] hover:to-[#b87333] text-white px-5 py-2 sm:py-2.5 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                                        Đăng ký
                                    </button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;