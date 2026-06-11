import React, { useEffect, useState } from 'react';
import { Card, Empty, List, Tag, Image, Typography, Space, Spin, Button, Select, Input } from 'antd';
import { requestCancelBook, requestGetHistoryUser, requestReturnBook, requestUpdateStatusBook, requestExtendBook } from '../../config/request';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

const { Text, Title } = Typography;
const { Search } = Input;

// Mapping for status colors and texts for better readability and maintenance
const statusConfig = {
    pending: { text: 'Đang chờ duyệt', color: 'gold' },
    success: { text: 'Chờ lấy sách', color: 'cyan' },
    picked_up: { text: 'Đã lấy sách', color: 'green' },
    cancel: { text: 'Đã hủy', color: 'red' },
    pending_return: { text: 'Đang chờ duyệt trả sách', color: 'orange' },
    returned: { text: 'Đã trả', color: 'blue' },
};

const BorrowingHistory = () => {
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState('desc');
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await requestGetHistoryUser();
                setBorrowedBooks(res.metadata);
            } catch (error) {
                toast.error(error.response.data.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spin size="large" />
            </div>
        );
    }

    const handleCancelBook = async (idHistory) => {
        try {
            await requestCancelBook({ idHistory });
            toast.success('Huỷ mượn sách thành công');
            const res = await requestGetHistoryUser();
            setBorrowedBooks(res.metadata);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const handleReturnBook = async (idHistory) => {
        try {
            await requestReturnBook({ idHistory });
            toast.success('Yêu cầu trả sách thành công');
            const res = await requestGetHistoryUser();
            setBorrowedBooks(res.metadata);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    const handleExtendBook = async (idHistory) => {
        try {
            await requestExtendBook({ idHistory });
            toast.success('Gia hạn sách thành công (+7 ngày)');
            const res = await requestGetHistoryUser();
            setBorrowedBooks(res.metadata);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    const handleConfirmPickup = async (idHistory, productId, userId) => {
        try {
            await requestUpdateStatusBook({ idHistory, status: 'picked_up', productId, userId });
            toast.success('Xác nhận đã lấy sách thành công');
            const res = await requestGetHistoryUser();
            setBorrowedBooks(res.metadata);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
        }
    };

    const sortedBooks = [...borrowedBooks].sort((a, b) => {
        return sortOrder === 'desc'
            ? new Date(b.borrowDate) - new Date(a.borrowDate)
            : new Date(a.borrowDate) - new Date(b.borrowDate);
    });

    const filteredBooks = sortedBooks.filter((item) => {
        const searchLower = searchText.toLowerCase();
        let derivedStatus = item.status;
        if (item.status === 'success' && item.quantity < 0) derivedStatus = 'pending_return';
        if (item.status === 'picked_up' && item.quantity < 0) derivedStatus = 'pending_return';
        if (item.status === 'cancel' && item.quantity < 0) derivedStatus = 'returned';
        const statusInfo = statusConfig[derivedStatus] || { text: derivedStatus };

        return (
            item.id?.toLowerCase().includes(searchLower) ||
            item.product?.nameProduct?.toLowerCase().includes(searchLower) ||
            statusInfo.text.toLowerCase().includes(searchLower)
        );
    });

    return (
        <Card 
            title="Lịch sử mượn sách" 
            bordered={false}
            extra={
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                    <Search
                        placeholder="Tìm bản ghi, tên sách, trạng thái..."
                        allowClear
                        onChange={(e) => setSearchText(e.target.value)}
                        className="w-[200px] sm:w-[250px]"
                    />
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm hidden sm:inline">Sắp xếp:</span>
                        <Select
                            defaultValue="desc"
                            style={{ width: 120 }}
                            onChange={(value) => setSortOrder(value)}
                            options={[
                                { value: 'desc', label: 'Mới nhất' },
                                { value: 'asc', label: 'Cũ nhất' }
                            ]}
                        />
                    </div>
                </div>
            }
        >
            {filteredBooks.length > 0 ? (
                <List
                    itemLayout="vertical"
                    dataSource={filteredBooks}
                    renderItem={(item) => {
                        let derivedStatus = item.status;
                        if (item.status === 'success' && item.quantity < 0) derivedStatus = 'pending_return';
                        if (item.status === 'picked_up' && item.quantity < 0) derivedStatus = 'pending_return';
                        if (item.status === 'cancel' && item.quantity < 0) derivedStatus = 'returned';
                        
                        const displayQuantity = Math.abs(item.quantity);
                        const statusInfo = statusConfig[derivedStatus] || { text: derivedStatus, color: 'default' };
                        
                        return (
                            <List.Item key={item.id} className="!p-0 mb-4">
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <Image
                                            width={100}
                                            className="rounded object-cover self-center sm:self-start"
                                            src={`${import.meta.env.VITE_API_URL}/${item.product.image}`}
                                            alt={item.product.nameProduct}
                                            preview={false}
                                        />
                                        <div className="flex-grow">
                                            <Title level={5} className="mb-1">
                                                {item.product.nameProduct}
                                            </Title>
                                            <Space direction="vertical" size="small" className="w-full text-sm">
                                                <Text type="secondary">Số lượng: {displayQuantity}</Text>
                                                <Text type="secondary">
                                                    Ngày mượn: {dayjs(item.borrowDate).format('DD/MM/YYYY')}
                                                </Text>
                                                <Text type="secondary">
                                                    Ngày trả: {dayjs(item.returnDate).format('DD/MM/YYYY')}
                                                </Text>
                                                {derivedStatus === 'returned' ? (
                                                    <p className="text-blue-500 font-bold">Đã trả sách</p>
                                                ) : ['success', 'picked_up', 'pending_return'].includes(derivedStatus) ? (
                                                    dayjs(item.returnDate).diff(dayjs(), 'day') < 0 ? (
                                                        <p className="text-red-500 font-bold">
                                                            Đã trễ: {Math.abs(dayjs(item.returnDate).diff(dayjs(), 'day'))} ngày
                                                        </p>
                                                    ) : (
                                                        <p className="text-green-500">
                                                            Số ngày còn lại: {dayjs(item.returnDate).diff(dayjs(), 'day')} ngày
                                                        </p>
                                                    )
                                                ) : null}
                                            </Space>
                                        </div>
                                        <div className="flex flex-col items-start sm:items-end justify-between mt-2 sm:mt-0">
                                            <Tag color={statusInfo.color} className="mb-2">
                                                {statusInfo.text}
                                            </Tag>
                                            <Text type="secondary" className="text-xs">
                                                Mã mượn: {item.id.substring(0, 8)}
                                            </Text>
                                            {derivedStatus === 'pending' && (
                                                <Button danger type="primary" onClick={() => handleCancelBook(item.id)}>
                                                    Huỷ mượn
                                                </Button>
                                            )}
                                            {derivedStatus === 'success' && (
                                                <Button type="primary" className="bg-cyan-500 hover:bg-cyan-600" onClick={() => handleConfirmPickup(item.id, item.product.id, item.userId)}>
                                                    Xác nhận đã lấy sách
                                                </Button>
                                            )}
                                            {derivedStatus === 'picked_up' && (
                                                <div className="flex flex-col gap-2 w-full mt-2 lg:mt-0">
                                                    <Button type="primary" onClick={() => handleReturnBook(item.id)} className="w-full">
                                                        Yêu cầu trả sách
                                                    </Button>
                                                    {dayjs(item.returnDate).diff(dayjs(), 'day') <= 2 && (
                                                        <Button 
                                                            className="w-full bg-purple-500 hover:bg-purple-600 text-white border-none" 
                                                            onClick={() => handleExtendBook(item.id)}
                                                        >
                                                            Gia hạn (+7 ngày)
                                                        </Button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </List.Item>
                        );
                    }}
                />
            ) : (
                <Empty description="Bạn chưa mượn cuốn sách nào." />
            )}
        </Card>
    );
};

export default BorrowingHistory;
