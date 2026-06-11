import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Tabs, Table, Radio, Tag, DatePicker, Space, Dropdown, Button } from 'antd';
import { Pie, Column, Line } from '@ant-design/charts';
import { UserOutlined, BookOutlined, SolutionOutlined, DownloadOutlined, FileExcelOutlined, FilePdfOutlined, FileTextOutlined } from '@ant-design/icons';
import { requestStatistics } from '../../config/request';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
dayjs.extend(weekOfYear);

const processTimeData = (dataArray, granularity, typeName) => {
    if (!dataArray) return [];
    const grouped = {};
    dataArray.forEach(item => {
        let key = '';
        if (granularity === 'month') key = dayjs(item.date).format('YYYY-MM');
        else if (granularity === 'year') key = dayjs(item.date).format('YYYY');
        else if (granularity === 'week') key = dayjs(item.date).format('YYYY-[W]ww');
        
        if (!grouped[key]) grouped[key] = 0;
        grouped[key] += parseInt(item.count, 10);
    });
    return Object.keys(grouped).map(k => ({ date: k, value: grouped[k], type: typeName })).sort((a,b)=>a.date.localeCompare(b.date));
};

const removeVietnameseTones = (str) => {
    if (!str) return '';
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    return str;
};

const Statistics = () => {
    const [data, setData] = useState({});
    const [timeFilter, setTimeFilter] = useState('month');
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [userSortOrder, setUserSortOrder] = useState('desc');

    useEffect(() => {
        const fetchData = async () => {
            const res = await requestStatistics();
            setData(res);
        };
        fetchData();
    }, []);

    // Tab 1: Tổng quan & Người dùng
    const topUsersColumns = [
        { title: 'Tên Người Dùng', dataIndex: 'fullName', key: 'fullName' },
        { 
            title: 'Tổng Số Mượn', 
            dataIndex: 'totalBorrowed', 
            key: 'totalBorrowed'
        },
    ];

    let sortedUsers = data?.topUsersData ? [...data.topUsersData] : [];
    if (userSortOrder === 'asc') {
        sortedUsers.sort((a, b) => parseInt(a.totalBorrowed, 10) - parseInt(b.totalBorrowed, 10));
    } else {
        sortedUsers.sort((a, b) => parseInt(b.totalBorrowed, 10) - parseInt(a.totalBorrowed, 10));
    }

    // Tab 2: Sách
    // Tab 2: Sách (Đổi thành bảng hiển thị xếp hạng)
    const topBooksColumns = [
        { title: 'Tên Đầu Sách', dataIndex: 'name', key: 'name', render: text => <strong className="text-blue-600">{text}</strong> },
        { title: 'Lượt Mượn', dataIndex: 'totalBorrowed', key: 'totalBorrowed', align: 'center', render: text => <Tag color="blue">{text} lượt</Tag> },
    ];

    // Tab 3: Phân tích Trễ hạn & Hình Phạt
    let groupedPenaltyList = [];
    if (data?.penaltyList) {
        const usersMap = {};
        data.penaltyList.forEach(item => {
            if (!usersMap[item.userId]) {
                usersMap[item.userId] = {
                    userId: item.userId,
                    fullName: item.fullName,
                    totalPenalty: 0,
                    books: []
                };
            }
            usersMap[item.userId].totalPenalty += item.penalty;
            usersMap[item.userId].books.push(item);
        });
        groupedPenaltyList = Object.values(usersMap).sort((a,b) => b.totalPenalty - a.totalPenalty);
    }

    const penaltyColumns = [
        { title: 'Người Dùng', dataIndex: 'fullName', key: 'fullName', render: text => <b>{text}</b> },
        { title: 'Số Sách Trễ Hạn', dataIndex: 'books', key: 'booksCount', render: books => <Tag color="orange">{books.length} cuốn</Tag> },
        { title: 'Tổng Tiền Phạt', dataIndex: 'totalPenalty', key: 'totalPenalty', align: 'right', render: text => <strong className="text-red-600">{text.toLocaleString('vi-VN')} đ</strong> },
    ];

    const expandedRowRender = (record) => {
        const expandedColumns = [
            { title: 'Tên Sách', dataIndex: 'bookName', key: 'bookName', render: text => <span className="font-semibold text-blue-600">{text}</span> },
            { title: 'Số Lượng', dataIndex: 'quantity', key: 'quantity', align: 'center', render: text => <span>x{text}</span> },
            { title: 'Hạn Trả', dataIndex: 'returnDate', key: 'returnDate', render: text => dayjs(text).format('DD/MM/YYYY') },
            { title: 'Tình Trạng (Trễ)', dataIndex: 'daysOverdue', key: 'daysOverdue', align: 'center', render: text => <Tag color="error">{text} ngày</Tag> },
            { title: 'Mức Phạt', dataIndex: 'penalty', key: 'penalty', align: 'right', render: text => <span className="text-red-400">{text.toLocaleString('vi-VN')} đ</span> },
        ];
        return <Table columns={expandedColumns} dataSource={record.books} rowKey="id" pagination={false} size="small" className="bg-gray-50 border-gray-200 border rounded" />;
    };

    const piePenaltyConfig = {
        appendPadding: 10,
        data: data?.penaltyRatioData || [],
        angleField: 'value',
        colorField: 'type',
        radius: 1,
        innerRadius: 0.6, // Làm thành dạng Donut chart nhìn sẽ cân đối hơn
        height: 300,
        width: 300,      // Fix cứng kích thước tránh tràn Table
        autoFit: false,
        color: ['#52c41a', '#ff4d4f'],
        label: { type: 'inner', offset: '-50%', content: '{percentage}' },
        interactions: [{ type: 'element-active' }],
    };

    // Tab 4: Thời gian
    let filteredTimeData = {
        borrowByMonth: [],
        newUsersByMonth: [],
        newBooksByMonth: []
    };
    if (data?.timeStats) {
        Object.keys(data.timeStats).forEach(key => {
            filteredTimeData[key] = data.timeStats[key].filter(item => {
                if (!selectedDate) return true;
                const itemDate = dayjs(item.date);
                if (timeFilter === 'year') {
                    return true; // Xem toàn bộ biểu đồ khi chọn theo Năm
                }
                if (timeFilter === 'month') {
                    // Xem biểu đồ tháng trong 1 Năm được chọn
                    return itemDate.year() === selectedDate.year();
                }
                if (timeFilter === 'week') {
                    // Xem biểu đồ tuần trong 1 Tháng được chọn
                    return itemDate.month() === selectedDate.month() && itemDate.year() === selectedDate.year();
                }
                return true;
            });
        });
    }

    let timeChartData = [];
    if (data?.timeStats) {
        timeChartData = [
            ...processTimeData(filteredTimeData.borrowByMonth, timeFilter, 'Lượt mượn sách'),
            ...processTimeData(filteredTimeData.newUsersByMonth, timeFilter, 'Người dùng mới'),
            ...processTimeData(filteredTimeData.newBooksByMonth, timeFilter, 'Sách nhập mới')
        ];
    }
    
    const lineConfig = {
        data: timeChartData,
        xField: 'date',
        yField: 'value',
        colorField: 'type', // Antd Charts v2 sử dụng colorField để phân chia đối tượng
        seriesField: 'type', // Cũ (v1)
        smooth: true,
        height: 350,
        color: ['#1890ff', '#faad14', '#52c41a'],
        legend: { position: 'top' },
        animation: { appear: { animation: 'path-in', duration: 1000 } },
    };



    const exportToExcel = () => {
        const wb = XLSX.utils.book_new();

        // Sheet 1: Tổng quan
        const summaryData = [
            ["Tổng số người dùng", data?.totalUsers || 0],
            ["Tổng số đầu sách", data?.totalBooks || 0],
            ["Yêu cầu & Đang mượn", (data?.pendingRequests || 0) + (data?.loanStatusData?.find(x=>x.status==='Đã duyệt')?.count || 0)]
        ];
        const wsSummary = XLSX.utils.aoa_to_sheet([["Chỉ số", "Giá trị"], ...summaryData]);
        XLSX.utils.book_append_sheet(wb, wsSummary, "Tổng Quan");

        // Sheet 2: Người Dùng Mượn Nhiều
        const wsUsers = XLSX.utils.json_to_sheet(sortedUsers.map(u => ({
            "Tên Người Dùng": u.fullName,
            "Tổng Số Lượt Mượn": u.totalBorrowed
        })));
        XLSX.utils.book_append_sheet(wb, wsUsers, "Top Người Dùng");

        // Sheet 3: Sách Mượn Nhiều
        const wsBooks = XLSX.utils.json_to_sheet((data?.topBorrowedBooks || []).map(b => ({
            "Tên Đầu Sách": b.name,
            "Lượt Mượn": b.totalBorrowed
        })));
        XLSX.utils.book_append_sheet(wb, wsBooks, "Top Sách");

        // Sheet 4: Vi Phạm
        const penaltyData = groupedPenaltyList.map(p => ({
            "Người Dùng": p.fullName,
            "Số Sách Trễ Hạn": p.books.length,
            "Tổng Tiền Phạt (VNĐ)": p.totalPenalty
        }));
        const wsPenalty = XLSX.utils.json_to_sheet(penaltyData);
        XLSX.utils.book_append_sheet(wb, wsPenalty, "Vi Phạm");

        XLSX.writeFile(wb, `Bao_Cao_Thong_Ke_${dayjs().format('YYYYMMDD')}.xlsx`);
    };

    const exportToCSV = () => {
        let csvContent = "\uFEFF"; 
        csvContent += "BAO CAO THONG KE\n\n";
        
        csvContent += "1. TONG QUAN\n";
        csvContent += `Tong nguoi dung,${data?.totalUsers || 0}\n`;
        csvContent += `Tong dau sach,${data?.totalBooks || 0}\n`;
        csvContent += `Yeu cau & Dang muon,${(data?.pendingRequests || 0) + (data?.loanStatusData?.find(x=>x.status==='Đã duyệt')?.count || 0)}\n\n`;

        csvContent += "2. TOP NGUOI DUNG MUON NHIEU\n";
        csvContent += "Ten Nguoi Dung,Tong So Luot Muon\n";
        sortedUsers.forEach(u => {
            csvContent += `"${u.fullName}",${u.totalBorrowed}\n`;
        });
        csvContent += "\n";

        csvContent += "3. TOP SACH MUON NHIEU\n";
        csvContent += "Ten Dau Sach,Luot Muon\n";
        (data?.topBorrowedBooks || []).forEach(b => {
            csvContent += `"${b.name}",${b.totalBorrowed}\n`;
        });
        csvContent += "\n";

        csvContent += "4. VI PHAM & PHAT\n";
        csvContent += "Nguoi Dung,So Sach Tre Han,Tong Tien Phat (VND)\n";
        groupedPenaltyList.forEach(p => {
            csvContent += `"${p.fullName}",${p.books.length},${p.totalPenalty}\n`;
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `Bao_Cao_Thong_Ke_${dayjs().format('YYYYMMDD')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        
        doc.setFontSize(18);
        doc.text("BAO CAO THONG KE THU VIEN", 14, 22);
        
        doc.setFontSize(11);
        doc.text(`Ngay xuat: ${dayjs().format('DD/MM/YYYY')}`, 14, 30);

        doc.autoTable({
            startY: 35,
            head: [['Chi So', 'Gia Tri']],
            body: [
                ['Tong so nguoi dung', data?.totalUsers || 0],
                ['Tong so dau sach', data?.totalBooks || 0],
                ['Yeu cau & Dang muon', (data?.pendingRequests || 0) + (data?.loanStatusData?.find(x=>x.status==='Đã duyệt')?.count || 0)]
            ],
            theme: 'grid',
            headStyles: { fillColor: [24, 144, 255] }
        });

        doc.text("TOP NGUOI DUNG MUON NHIEU", 14, doc.lastAutoTable.finalY + 10);
        doc.autoTable({
            startY: doc.lastAutoTable.finalY + 15,
            head: [['Ten Nguoi Dung', 'Tong So Luot Muon']],
            body: sortedUsers.map(u => [removeVietnameseTones(u.fullName), u.totalBorrowed]),
            theme: 'striped',
            headStyles: { fillColor: [24, 144, 255] }
        });

        doc.text("TOP SACH MUON NHIEU", 14, doc.lastAutoTable.finalY + 10);
        doc.autoTable({
            startY: doc.lastAutoTable.finalY + 15,
            head: [['Ten Dau Sach', 'Luot Muon']],
            body: (data?.topBorrowedBooks || []).map(b => [removeVietnameseTones(b.name), b.totalBorrowed]),
            theme: 'striped',
            headStyles: { fillColor: [24, 144, 255] }
        });

        doc.text("DANH SACH VI PHAM", 14, doc.lastAutoTable.finalY + 10);
        doc.autoTable({
            startY: doc.lastAutoTable.finalY + 15,
            head: [['Nguoi Dung', 'So Sach Tre Han', 'Tong Tien Phat (VND)']],
            body: groupedPenaltyList.map(p => [removeVietnameseTones(p.fullName), p.books.length, p.totalPenalty.toLocaleString('vi-VN')]),
            theme: 'striped',
            headStyles: { fillColor: [255, 77, 79] }
        });

        doc.save(`Bao_Cao_Thong_Ke_${dayjs().format('YYYYMMDD')}.pdf`);
    };

    const exportMenu = {
        items: [
            {
                key: 'excel',
                label: 'Xuất Excel (.xlsx)',
                icon: <FileExcelOutlined style={{ color: '#52c41a' }} />,
                onClick: exportToExcel,
            },
            {
                key: 'csv',
                label: 'Xuất CSV (.csv)',
                icon: <FileTextOutlined style={{ color: '#1890ff' }} />,
                onClick: exportToCSV,
            },
            {
                key: 'pdf',
                label: 'Xuất PDF (.pdf)',
                icon: <FilePdfOutlined style={{ color: '#ff4d4f' }} />,
                onClick: exportToPDF,
            },
        ],
    };

    const items = [
        {
            key: '1',
            label: 'Người Dùng',
            children: (
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Card 
                            title="Xếp hạng lượng mượn sách" 
                            extra={
                                <Radio.Group value={userSortOrder} onChange={e => setUserSortOrder(e.target.value)}>
                                    <Radio.Button value="desc">Nhiều nhất ↓</Radio.Button>
                                    <Radio.Button value="asc">Ít nhất ↑</Radio.Button>
                                </Radio.Group>
                            }
                        >
                            <Table dataSource={sortedUsers} columns={topUsersColumns} rowKey={(record, index) => index} pagination={false} />
                        </Card>
                    </Col>
                </Row>
            )
        },
        {
            key: '2',
            label: 'Mượn - Trả',
            children: (
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Card title="Sách mượn nhiều nhất">
                            <Table dataSource={data?.topBorrowedBooks} columns={topBooksColumns} rowKey="name" pagination={false} size="small" />
                        </Card>
                    </Col>
                </Row>
            )
        },
        {
            key: '3',
            label: 'Hạn mượn & Phạt',
            children: (
                <Row gutter={[16, 16]}>
                    <Col span={9}>
                        <Card title="Tỉ lệ Đúng Hạn / Quá Hạn" style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                           <Pie {...piePenaltyConfig} />
                        </Card>
                    </Col>
                    <Col span={15}>
                        <Card title="Danh sách vi phạm (Cảnh cáo / Phạt)" style={{ minHeight: '100%' }}>
                            <Table 
                                dataSource={groupedPenaltyList} 
                                columns={penaltyColumns} 
                                rowKey="userId" 
                                expandable={{ expandedRowRender }}
                                pagination={{ pageSize: 5 }} 
                            />
                        </Card>
                    </Col>
                </Row>
            )
        },
        {
            key: '4',
            label: 'Dòng Thời Gian',
            children: (
                <Card 
                    title="Biểu đồ phát triển" 
                    extra={
                        <Space>
                            {timeFilter === 'month' ? (
                                <DatePicker picker="year" value={selectedDate} onChange={val => setSelectedDate(val || dayjs())} allowClear={false} />
                            ) : timeFilter === 'week' ? (
                                <DatePicker picker="month" value={selectedDate} onChange={val => setSelectedDate(val || dayjs())} allowClear={false} />
                            ) : null}
                            <Radio.Group value={timeFilter} onChange={e => setTimeFilter(e.target.value)}>
                                <Radio.Button value="week">Theo Tuần</Radio.Button>
                                <Radio.Button value="month">Theo Tháng</Radio.Button>
                                <Radio.Button value="year">Theo Năm</Radio.Button>
                            </Radio.Group>
                        </Space>
                    }
                >
                    {timeChartData.length > 0 ? <Line {...lineConfig} /> : <p className="text-center text-gray-500 py-10">Không có số liệu trong thời gian này</p>}
                </Card>
            )
        }
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Thống kê nâng cao</h2>
                <Dropdown menu={exportMenu} placement="bottomRight">
                    <Button type="primary" icon={<DownloadOutlined />}>
                        Xuất Báo Cáo
                    </Button>
                </Dropdown>
            </div>
            {/* Thống kê nhanh */}
            <Row gutter={16} className="mb-6">
                <Col span={8}>
                    <Card className="shadow-sm">
                        <Statistic title="Tổng số người dùng" value={data?.totalUsers || 0} prefix={<UserOutlined />} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card className="shadow-sm">
                        <Statistic title="Tổng số đầu sách" value={data?.totalBooks || 0} prefix={<BookOutlined />} />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card className="shadow-sm">
                        <Statistic title="Yêu cầu & Đang mượn (đang xử lý)" value={(data?.pendingRequests || 0) + (data?.loanStatusData?.find(x=>x.status==='Đã duyệt')?.count || 0)} prefix={<SolutionOutlined />} />
                    </Card>
                </Col>
            </Row>

            <Tabs defaultActiveKey="1" items={items} type="card" className="bg-white p-4 rounded-md shadow-sm" />
        </div>
    );
};

export default Statistics;
