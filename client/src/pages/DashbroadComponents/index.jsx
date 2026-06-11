import React, { useState, useContext, useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, Badge, Popover, List } from 'antd';
import { UserOutlined, SolutionOutlined, IdcardOutlined, BookOutlined, LineChartOutlined, LogoutOutlined, BellOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Context from '../../store/Context';
import { requestLogout, requestGetNotifications, requestMarkAsReadNotification } from '../../config/request';
import { toast } from 'react-toastify';

import UserManagement from './UserManagement';
import LoanRequestManagement from './LoanRequestManagement';
import CardIssuanceManagement from './CardIssuanceManagement';
import BookManagement from './BookManagement';
import Statistics from './Statistics';

const { Header, Content, Sider, Footer } = Layout;

const components = {
    stats: <Statistics />,
    user: <UserManagement />,
    loan: <LoanRequestManagement />,
    card: <CardIssuanceManagement />,
    book: <BookManagement />,
};

const IndexDashBroad = () => {
    const [selectedKey, setSelectedKey] = useState('stats');
    const { dataUser } = useContext(Context);
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([]);
    const unreadCount = notifications.filter(n => !n.isRead).length;

    useEffect(() => {
        const fetchNotifications = async () => {
            if (dataUser && dataUser.id && dataUser.role === 'admin') {
                try {
                    const res = await requestGetNotifications();
                    if (res && res.metadata) {
                        setNotifications(res.metadata);
                    }
                } catch (error) {
                    console.error('Lỗi khi tải thông báo Admin:', error);
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
            setSelectedKey(notification.link);
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
            toast.success('Đăng xuất thành công');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            navigate('/login');
        } catch (error) {
            toast.error('Lỗi khi đăng xuất');
        }
    };

    const userMenu = (
        <Menu>
            <Menu.Item key="1">
                Quay lại trang chủ
            </Menu.Item>
            <Menu.Item key="2" danger icon={<LogoutOutlined />} onClick={handleLogout}>
                Đăng xuất
            </Menu.Item>
        </Menu>
    );

    const renderContent = () => {
        return components[selectedKey] || <div>Chọn một mục từ menu</div>;
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider breakpoint="lg" collapsedWidth="0" theme="light" style={{ backgroundColor: '#ffffff', borderRight: '1px solid #f0f0f0' }}>
                <div className="h-8 m-4 bg-blue-50 text-blue-600 text-center leading-8 font-bold border border-blue-100 rounded">LIBRARY ADMIN</div>
                <Menu theme="light" mode="inline" defaultSelectedKeys={['stats']} onClick={(e) => setSelectedKey(e.key)}>
                    <Menu.Item key="stats" icon={<LineChartOutlined />}>
                        Thống kê
                    </Menu.Item>
                    <Menu.Item key="book" icon={<BookOutlined />}>
                        Quản lý sách
                    </Menu.Item>
                    <Menu.Item key="loan" icon={<SolutionOutlined />}>
                        Quản lý mượn sách
                    </Menu.Item>
                    <Menu.Item key="card" icon={<IdcardOutlined />}>
                        Quản lý cấp thẻ
                    </Menu.Item>
                    <Menu.Item key="user" icon={<UserOutlined />}>
                        Quản lý người dùng
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout className="bg-gray-50">
                <Header className="!bg-white p-0 flex justify-end items-center pr-6 shadow-sm" style={{ backgroundColor: '#ffffff' }}>
                    <Space size="large" className="mr-6 mt-1">
                        <Popover 
                            content={notificationContent} 
                            title={<div className="font-bold text-gray-800 px-1 py-1">Thông báo</div>} 
                            trigger="click"
                            placement="bottomRight"
                        >
                            <Badge count={unreadCount} overflowCount={99} className="cursor-pointer" offset={[-2, 2]}>
                                <BellOutlined className="text-2xl text-gray-600 hover:text-[#b87333] transition-colors" />
                            </Badge>
                        </Popover>
                    </Space>
                    {dataUser && dataUser.fullName ? (
                        <Dropdown overlay={userMenu} placement="bottomRight" cursor="pointer">
                            <Space className="cursor-pointer">
                                <Avatar src={dataUser.avatar ? `${import.meta.env.VITE_API_URL_IMAGE}/${dataUser.avatar}` : null} icon={!dataUser.avatar && <UserOutlined />} />
                                <span className="font-semibold text-gray-700">{dataUser.fullName} (Admin)</span>
                            </Space>
                        </Dropdown>
                    ) : (
                        <Space>
                            <Avatar icon={<UserOutlined />} />
                            <span>Đang tải...</span>
                        </Space>
                    )}
                </Header>
                <Content style={{ margin: '24px 16px 0' }}>
                    <div className="p-6 bg-white rounded-lg shadow-sm" style={{ minHeight: 360 }}>
                        {renderContent()}
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>Library Management ©2024 Created by Cascade</Footer>
            </Layout>
        </Layout>
    );
};

export default IndexDashBroad;
