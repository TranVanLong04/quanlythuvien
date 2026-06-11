import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, Select, Input } from 'antd';
import { requestGetAllHistoryBook, requestUpdateStatusBook, requestApproveReturnBook } from '../../config/request';
import dayjs from 'dayjs';

const { Search } = Input;

const LoanRequestManagement = () => {
    const [data, setData] = useState([]);
    const [sortOrder, setSortOrder] = useState('desc');
    const [searchText, setSearchText] = useState('');
    const fetchData = async () => {
        const res = await requestGetAllHistoryBook();
        setData(res.metadata);
    };
    useEffect(() => {
        fetchData();
    }, []);
    const handleUpdateStatus = async (id, status, productId, userId) => {
        try {
            const data = {
                idHistory: id,
                status,
                productId,
                userId,
            };
            await requestUpdateStatusBook(data);
            fetchData();
        } catch (error) {
            console.log(error);
        }
    };

    const handleApproveReturn = async (id) => {
        try {
            const data = { idHistory: id };
            await requestApproveReturnBook(data);
            fetchData();
        } catch (error) {
            console.log(error);
        }
    };

    const columns = [
        { title: 'ID Yêu cầu', dataIndex: 'id', key: 'id', render: (text) => <span>{text.slice(0, 10)}</span> },
        { title: 'Người mượn', dataIndex: 'fullName', key: 'fullName' },
        {
            title: 'Ảnh',
            dataIndex: 'product',
            key: 'product',
            render: (record) => (
                <img
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    src={`${import.meta.env.VITE_API_URL_IMAGE}/${record.image}`}
                    alt=""
                />
            ),
        },
        { title: 'Tên sách', dataIndex: 'product', key: 'product', render: (record) => record.nameProduct },
        { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity', render: (text) => Math.abs(text) },
        {
            title: 'Ngày mượn',
            dataIndex: 'borrowDate',
            key: 'borrowDate',
            sorter: (a, b) => new Date(a.borrowDate) - new Date(b.borrowDate),
            render: (text) => dayjs(text).format('DD/MM/YYYY'),
        },
        {
            title: 'Ngày trả',
            dataIndex: 'returnDate',
            key: 'returnDate',
            render: (text) => dayjs(text).format('DD/MM/YYYY'),
        },
        {
            title: 'Trạng thái',
            key: 'status',
            render: (text, record) => {
                let derivedStatus = record.status;
                if (record.status === 'success' && record.quantity < 0) derivedStatus = 'pending_return';
                if (record.status === 'picked_up' && record.quantity < 0) derivedStatus = 'pending_return';
                if (record.status === 'cancel' && record.quantity < 0) derivedStatus = 'returned';

                let color = derivedStatus === 'pending' ? 'green' : derivedStatus === 'success' ? 'cyan' : derivedStatus === 'picked_up' ? 'geekblue' : derivedStatus === 'pending_return' ? 'orange' : derivedStatus === 'returned' ? 'blue' : 'volcano';
                return (
                    <Tag color={color}>
                        {derivedStatus === 'pending' ? 'Chờ duyệt' : derivedStatus === 'success' ? 'Chờ lấy sách' : derivedStatus === 'picked_up' ? 'Đã lấy sách' : derivedStatus === 'pending_return' ? 'Chờ duyệt trả' : derivedStatus === 'returned' ? 'Đã trả' : 'Từ chối'}
                    </Tag>
                );
            },
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (text, record) => {
                let derivedStatus = record.status;
                if (record.status === 'success' && record.quantity < 0) derivedStatus = 'pending_return';
                if (record.status === 'picked_up' && record.quantity < 0) derivedStatus = 'pending_return';
                if (record.status === 'cancel' && record.quantity < 0) derivedStatus = 'returned';

                return (
                <span className="flex items-center gap-2">
                    {derivedStatus === 'pending' && (
                        <Button
                            onClick={() => handleUpdateStatus(record.id, 'success', record.product.id, record.userId)}
                            type="primary"
                        >
                            Duyệt
                        </Button>
                    )}
                    {derivedStatus === 'pending' && (
                        <Button
                            onClick={() => handleUpdateStatus(record.id, 'cancel', record.product.id, record.userId)}
                            type="primary"
                            danger
                        >
                            {' '}
                            Từ chối
                        </Button>
                    )}
                    {derivedStatus === 'success' && (
                        <Button
                            onClick={() => handleUpdateStatus(record.id, 'picked_up', record.product.id, record.userId)}
                            type="primary"
                            style={{ backgroundColor: '#13c2c2', borderColor: '#13c2c2' }}
                        >
                            Xác nhận đã lấy
                        </Button>
                    )}
                    {derivedStatus === 'picked_up' && (
                        <Button
                            onClick={() => handleUpdateStatus(record.id, 'success', record.product.id, record.userId)}
                            type="default"
                        >
                            Hoàn tác
                        </Button>
                    )}
                    {(derivedStatus === 'picked_up' || derivedStatus === 'pending_return') && (
                        <>
                            <span className="text-red-500 font-semibold">Chưa trả</span>
                            <Button
                                onClick={() => handleApproveReturn(record.id)}
                                type="primary"
                            >
                                Xác nhận trả sách
                            </Button>
                        </>
                    )}
                    {derivedStatus === 'returned' && (
                        <span className="font-semibold text-blue-500">Đã trả</span>
                    )}
                </span>
                );
            },
        },
    ];

    const sortedData = [...data].sort((a, b) => {
        return sortOrder === 'desc'
            ? new Date(b.borrowDate) - new Date(a.borrowDate)
            : new Date(a.borrowDate) - new Date(b.borrowDate);
    });

    const filteredData = sortedData.filter((item) => {
        const searchLower = searchText.toLowerCase();
        return (
            item.id?.toLowerCase().includes(searchLower) ||
            item.fullName?.toLowerCase().includes(searchLower) ||
            item.product?.nameProduct?.toLowerCase().includes(searchLower)
        );
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Quản lý yêu cầu mượn sách</h2>
                <div className="flex items-center gap-4">
                    <Search
                        placeholder="Tìm mã, người mượn, sách..."
                        allowClear
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 250 }}
                    />
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">Sắp xếp ngày mượn:</span>
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
            </div>
            <Table columns={columns} dataSource={filteredData} rowKey="id" />
        </div>
    );
};

export default LoanRequestManagement;
