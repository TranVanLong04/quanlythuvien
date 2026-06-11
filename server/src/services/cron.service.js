const cron = require('node-cron');
const { Op } = require('sequelize');
const modelHistoryBook = require('../models/historyBook.model');
const modelProduct = require('../models/product.model');
const modelNotification = require('../models/notification.model');
const modelUser = require('../models/users.model');

class CronService {
    start() {
        // Chạy vào 00:00 mỗi ngày
        cron.schedule('0 0 * * *', async () => {
            console.log('--- Đang quét các đơn mượn bị quá hạn nhận sách ---');
            try {
                // 48 giờ trước
                const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);

                // Tìm các đơn: trạng thái = success và ngày duyệt (updatedAt) <= 48h trước
                const expiredBooks = await modelHistoryBook.findAll({
                    where: {
                        status: 'success',
                        updatedAt: {
                            [Op.lte]: twoDaysAgo
                        }
                    }
                });

                if (expiredBooks.length === 0) {
                    console.log('Không có đơn mượn nào bị quá hạn.');
                    return;
                }

                console.log(`Tìm thấy ${expiredBooks.length} đơn mượn quá hạn nhận sách. Tiến hành hủy...`);

                const admins = await modelUser.findAll({ where: { role: 'admin' } });

                for (const record of expiredBooks) {
                    // Update status to cancel
                    await modelHistoryBook.update(
                        { status: 'cancel' },
                        { where: { id: record.id } }
                    );

                    // Khôi phục số lượng sách
                    const product = await modelProduct.findOne({ where: { id: record.bookId } });
                    if (product) {
                        await modelProduct.update(
                            { stock: product.stock + record.quantity },
                            { where: { id: record.bookId } }
                        );
                    }

                    // Thông báo cho User
                    const user = await modelUser.findOne({ where: { id: record.userId } });
                    const productName = product ? product.nameProduct : 'Sách không xác định';
                    
                    await modelNotification.create({
                        userId: record.userId,
                        message: `Đơn mượn sách "${productName}" đã tự động bị hủy do bạn không đến nhận sách sau 2 ngày kể từ khi được duyệt.`,
                        link: '/infoUser'
                    });

                    // Thông báo tới Admin
                    for (const admin of admins) {
                        await modelNotification.create({
                            userId: admin.id,
                            message: `Hệ thống tự động hủy đơn mượn sách "${productName}" của "${user ? user.fullName : 'Học sinh'}" do quá 2 ngày không nhận.`,
                            link: 'loan'
                        });
                    }
                }
                
                console.log('Hủy thành công các đơn mượn quá hạn.');
            } catch (error) {
                console.error('Lỗi khi quét các đơn mượn quá hạn:', error);
            }
        });
    }
}

module.exports = new CronService();
