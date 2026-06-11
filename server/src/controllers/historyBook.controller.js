const modelHistoryBook = require('../models/historyBook.model');
const modelUser = require('../models/users.model');
const modelProduct = require('../models/product.model');
const modelNotification = require('../models/notification.model');

const { BadRequestError } = require('../core/error.response');
const { OK, Created } = require('../core/success.response');
const SendMailBookBorrowConfirmation = require('../utils/SendMailSuccess');
const { where } = require('sequelize');
const SendMailBookBorrowFailed = require('../utils/SendMailFail');
const SendMailBookBorrowRequest = require('../utils/SendMailRequest');
const dayjs = require('dayjs');

class historyBookController {
    async createHistoryBook(req, res) {
        const { id } = req.user;
        const findUser = await modelUser.findOne({ where: { id } });
        if (!findUser) {
            throw new BadRequestError('Người dùng không tồn tại');
        }
        if (
            findUser.dataValues.idStudent === null ||
            findUser.dataValues.idStudent === '0' ||
            findUser.dataValues.idStudent === ''
        ) {
            throw new BadRequestError('Bạn chưa có ID sinh viên !!!');
        }

        const { fullName, phoneNumber, address, bookId, borrowDate, returnDate, quantity } = req.body;
        if (!fullName || !phoneNumber || !address || !bookId || !borrowDate || !returnDate || !quantity) {
            throw new BadRequestError('Vui lòng nhập đầy đủ thông tin');
        }
        const historyBook = await modelHistoryBook.create({
            fullName,
            phone: phoneNumber,
            address,
            bookId,
            borrowDate,
            returnDate,
            quantity,
            userId: id,
        });
        const findProduct = await modelProduct.findOne({ where: { id: bookId } });
        if (!findProduct) {
            throw new BadRequestError('Sách không tồn tại');
        }
        await modelProduct.update({ stock: findProduct.stock - quantity }, { where: { id: bookId } });

        // Thông báo cho Admin
        const admins = await modelUser.findAll({ where: { role: 'admin' } });
        const newStock = findProduct.stock - quantity;
        for (const admin of admins) {
            await modelNotification.create({
                userId: admin.id,
                message: `Người dùng ${findUser.fullName} vừa yêu cầu mượn cuốn sách: "${findProduct.nameProduct}".`,
                link: 'loan'
            });
            if (newStock < 5) {
                await modelNotification.create({
                    userId: admin.id,
                    message: `Cảnh báo: Sách "${findProduct.nameProduct}" sắp hết trong kho (còn ${newStock} cuốn).`,
                    link: 'book'
                });
            }
        }
        
        // Gửi mail thông báo đăng ký thành công cho User trong nền (không chặn response)
        SendMailBookBorrowRequest(findUser.email, findProduct, borrowDate, returnDate).catch(console.error);

        new Created({
            message: 'Create history book success',
            metadata: historyBook,
        }).send(res);
    }

    async getHistoryUser(req, res) {
        const { id } = req.user;
        const historyBook = await modelHistoryBook.findAll({ where: { userId: id } });
        const data = await Promise.all(
            historyBook.map(async (item) => {
                const product = await modelProduct.findOne({ where: { id: item.bookId } });
                return {
                    ...item.dataValues,
                    product,
                };
            }),
        );
        new OK({
            message: 'Get history book success',
            metadata: data,
        }).send(res);
    }

    async cancelBook(req, res) {
        const { id } = req.user;
        const { idHistory } = req.body;
        const findHistory = await modelHistoryBook.findOne({ where: { id: idHistory, userId: id } });
        if (!findHistory) {
            throw new BadRequestError('Lịch sử mượn không tồn tại');
        }
        const findProduct = await modelProduct.findOne({ where: { id: findHistory.bookId } });
        if (!findProduct) {
            throw new BadRequestError('Sách không tồn tại');
        }
        await modelHistoryBook.update({ status: 'cancel' }, { where: { id: idHistory } });
        await modelProduct.update(
            { stock: findProduct.stock + findHistory.quantity },
            { where: { id: findHistory.bookId } },
        );

        // Thông báo cho Admin
        const findUser = await modelUser.findOne({ where: { id } });
        const admins = await modelUser.findAll({ where: { role: 'admin' } });
        for (const admin of admins) {
            await modelNotification.create({
                userId: admin.id,
                message: `Người dùng ${findUser.fullName} đã tự hủy yêu cầu mượn sách: "${findProduct.nameProduct}".`,
                link: 'loan'
            });
        }
        new OK({
            message: 'Cancel book success',
        }).send(res);
    }

    async getAllHistoryBook(req, res) {
        const historyBook = await modelHistoryBook.findAll({
            order: [['createdAt', 'DESC']],
        });
        const data = await Promise.all(
            historyBook.map(async (item) => {
                const product = await modelProduct.findOne({ where: { id: item.bookId } });
                return {
                    ...item.dataValues,
                    product,
                };
            }),
        );
        new OK({
            message: 'Get all history book success',
            metadata: data,
        }).send(res);
    }

    async updateStatusBook(req, res) {
        const { idHistory, status, productId, userId } = req.body;
        const findHistory = await modelHistoryBook.findOne({ where: { id: idHistory } });
        const findProduct = await modelProduct.findOne({ where: { id: productId } });
        const findUser = await modelUser.findOne({ where: { id: userId } });
        if (!findHistory) {
            throw new BadRequestError('Lịch sử mượn không tồn tại');
        }
        await modelHistoryBook.update({ status }, { where: { id: idHistory } });
        
        // Tạo thông báo cho user
        let message = '';
        if (status === 'success') {
            message = `Yêu cầu mượn sách "${findProduct.nameProduct}" đã được duyệt. Vui lòng đến lấy sách!`;
        } else if (status === 'picked_up') {
            message = `Bạn đã nhận sách "${findProduct.nameProduct}". Chúc bạn đọc sách vui vẻ!`;
        } else if (status === 'cancel') {
            message = `Yêu cầu mượn sách "${findProduct.nameProduct}" của bạn đã bị hủy hoặc chưa được lấy.`;
        } else {
            message = `Yêu cầu mượn sách "${findProduct.nameProduct}" đã chuyển sang trạng thái: ${status}`;
        }
        
        await modelNotification.create({
            userId,
            message,
            link: '/infoUser' // Chuyển hướng tới trang thông tin (chứa lịch sử mượn)
        });

        if (status === 'success') {
            SendMailBookBorrowConfirmation(
                findUser.email,
                findProduct,
                findHistory.borrowDate,
                findHistory.returnDate,
            ).catch(console.error);
        }
        if (status === 'cancel') {
            SendMailBookBorrowFailed(findUser.email, findProduct).catch(console.error);
        }
        new OK({
            message: 'Update status book success',
        }).send(res);
    }

    async requestReturnBook(req, res) {
        const { id } = req.user;
        const { idHistory } = req.body;
        const findHistory = await modelHistoryBook.findOne({ where: { id: idHistory, userId: id } });
        if (!findHistory) {
            throw new BadRequestError('Lịch sử mượn không tồn tại');
        }
        if (findHistory.status !== 'picked_up' || findHistory.quantity <= 0) {
            throw new BadRequestError('Chỉ có thể yêu cầu trả sách đã được lấy');
        }
        // Use negative quantity to signify 'pending_return' state without altering DB schema
        await modelHistoryBook.update({ quantity: -Math.abs(findHistory.quantity) }, { where: { id: idHistory } });

        // Thêm thông báo cho admin
        const findUser = await modelUser.findOne({ where: { id } });
        const findProduct = await modelProduct.findOne({ where: { id: findHistory.bookId } });
        const admins = await modelUser.findAll({ where: { role: 'admin' } });
        for (const admin of admins) {
            await modelNotification.create({
                userId: admin.id,
                message: `Người dùng ${findUser.fullName} vừa yêu cầu trả sách: "${findProduct.nameProduct}".`,
                link: 'loan'
            });
        }
        new OK({
            message: 'Request return book success',
        }).send(res);
    }

    async approveReturnBook(req, res) {
        // Admin action
        const { idHistory } = req.body;
        const findHistory = await modelHistoryBook.findOne({ where: { id: idHistory } });
        if (!findHistory) {
            throw new BadRequestError('Lịch sử mượn không tồn tại');
        }
        if (!['success', 'picked_up'].includes(findHistory.status)) {
            throw new BadRequestError('Trạng thái không hợp lệ để trả sách');
        }
        const findProduct = await modelProduct.findOne({ where: { id: findHistory.bookId } });
        if (!findProduct) {
            throw new BadRequestError('Sách không tồn tại');
        }
        
        const originalQuantity = Math.abs(findHistory.quantity);
        // Use 'cancel' + negative quantity to signify 'returned' state without altering DB schema
        await modelHistoryBook.update({ status: 'cancel', quantity: -originalQuantity }, { where: { id: idHistory } });
        await modelProduct.update(
            { stock: findProduct.stock + originalQuantity },
            { where: { id: findHistory.bookId } },
        );
        
        // Thông báo cho user là sách đã trả thành công
        await modelNotification.create({
            userId: findHistory.userId,
            message: `Hệ thống đã nhận lại sách "${findProduct.nameProduct}" từ bạn. Cảm ơn bạn!`,
            link: '/infoUser'
        });
        
        new OK({
            message: 'Approve return book success',
        }).send(res);
    }

    async extendBook(req, res) {
        const { id } = req.user;
        const { idHistory } = req.body;
        const findHistory = await modelHistoryBook.findOne({ where: { id: idHistory, userId: id } });
        if (!findHistory) {
            throw new BadRequestError('Lịch sử mượn không tồn tại');
        }
        if (!['picked_up'].includes(findHistory.status)) {
            throw new BadRequestError('Chỉ có thể gia hạn sách khi đang cầm sách');
        }

        const today = dayjs();
        const returnDate = dayjs(findHistory.returnDate);
        const diffDays = returnDate.diff(today, 'day');

        if (diffDays > 2) {
            throw new BadRequestError('Chỉ có thể gia hạn khi thời gian mượn còn <= 2 ngày');
        }

        const newReturnDate = returnDate.add(7, 'day').format('YYYY-MM-DD');

        await modelHistoryBook.update({ returnDate: newReturnDate }, { where: { id: idHistory } });

        new OK({
            message: 'Gia hạn sách thành công (+7 ngày)',
            metadata: { newReturnDate }
        }).send(res);
    }
}

module.exports = new historyBookController();
