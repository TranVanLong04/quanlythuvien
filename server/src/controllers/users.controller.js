const modelUser = require('../models/users.model');
const modelApiKey = require('../models/apiKey.model');
const modelOtp = require('../models/otp.model');

const { AuthFailureError, BadRequestError } = require('../core/error.response');
const { OK } = require('../core/success.response');
const User = require('../models/users.model');
const Product = require('../models/product.model');
const HistoryBook = require('../models/historyBook.model');
const { Op, Sequelize } = require('sequelize');
const { createApiKey, createRefreshToken, createToken, verifyToken } = require('../services/tokenServices');

const sendMailForgotPassword = require('../utils/sendMailForgotPassword');

const bcrypt = require('bcrypt');
const CryptoJS = require('crypto-js');
const { jwtDecode } = require('jwt-decode');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');

require('dotenv').config();

class controllerUser {
    async registerUser(req, res) {
        const { fullName, phone, address, email, password } = req.body;
        if (!fullName || !phone || !email || !password) {
            throw new BadRequestError('Vui lòng nhập đầy đủ thông tin');
        }
        const findUser = await modelUser.findOne({ where: { email } });

        if (findUser) {
            throw new BadRequestError('Email đã tồn tại');
        }

        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const passwordHash = bcrypt.hashSync(password, salt);
        const dataUser = await modelUser.create({
            fullName,
            phone,
            address,
            email,
            password: passwordHash,
            typeLogin: 'email',
        });

        await dataUser.save();
        await createApiKey(dataUser.id);
        const token = await createToken({
            id: dataUser.id,
            isAdmin: dataUser.isAdmin,
            address: dataUser.address,
            phone: dataUser.phone,
        });
        const refreshToken = await createRefreshToken({ id: dataUser.id });
        res.cookie('token', token, {
            httpOnly: true, // Chặn truy cập từ JavaScript (bảo mật hơn)
            secure: true, // Chỉ gửi trên HTTPS (để đảm bảo an toàn)
            sameSite: 'Strict', // Chống tấn công CSRF
            maxAge: 15 * 60 * 1000, // 15 phút
        });

        res.cookie('logged', 1, {
            httpOnly: false, // Chặn truy cập từ JavaScript (bảo mật hơn)
            secure: true, // Chỉ gửi trên HTTPS (để đảm bảo an toàn)
            sameSite: 'Strict', // Chống tấn công CSRF
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
        });

        // Đặt cookie HTTP-Only cho refreshToken (tùy chọn)
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
        });

        new OK({ message: 'Đăng ký thành công', metadata: { token, refreshToken, role: dataUser.role } }).send(res);
    }

    async loginUser(req, res) {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new BadRequestError('Vui lòng nhập đầy đủ thông tin');
        }
        const findUser = await modelUser.findOne({ where: { email } });
        if (!findUser) {
            throw new AuthFailureError('Tài khoản hoặc mật khẩu không chính xác');
        }
        const isPasswordValid = bcrypt.compareSync(password, findUser.password);
        if (!isPasswordValid) {
            throw new AuthFailureError('Tài khoản hoặc mật khẩu không chính xác');
        }
        await createApiKey(findUser.id);
        const token = await createToken({ id: findUser.id, isAdmin: findUser.isAdmin });
        const refreshToken = await createRefreshToken({ id: findUser.id });
        res.cookie('token', token, {
            httpOnly: true, // Chặn truy cập từ JavaScript (bảo mật hơn)
            secure: true, // Chỉ gửi trên HTTPS (để đảm bảo an toàn)
            sameSite: 'Strict', // Chống tấn công CSRF
            maxAge: 15 * 60 * 1000, // 15 phút
        });
        res.cookie('logged', 1, {
            httpOnly: false, // Chặn truy cập từ JavaScript (bảo mật hơn)
            secure: true, // Chỉ gửi trên HTTPS (để đảm bảo an toàn)
            sameSite: 'Strict', // Chống tấn công CSRF
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
        });
        new OK({ message: 'Đăng nhập thành công', metadata: { token, refreshToken, role: findUser.role } }).send(res);
    }

    async authUser(req, res) {
        const { id } = req.user;

        const findUser = await modelUser.findOne({ where: { id } });

        if (!findUser) {
            throw new AuthFailureError('Tài khoản không tồn tại');
        }

        const auth = CryptoJS.AES.encrypt(JSON.stringify(findUser), process.env.SECRET_CRYPTO).toString();

        new OK({ message: 'success', metadata: auth }).send(res);
    }

    async refreshToken(req, res) {
        const refreshToken = req.cookies.refreshToken;

        const decoded = await verifyToken(refreshToken);

        const user = await modelUser.findOne({ where: { id: decoded.id } });
        const token = await createToken({ id: user.id });
        res.cookie('token', token, {
            httpOnly: true, // Chặn truy cập từ JavaScript (bảo mật hơn)
            secure: true, // Chỉ gửi trên HTTPS (để đảm bảo an toàn)
            sameSite: 'Strict', // Chống tấn công CSRF
            maxAge: 15 * 60 * 1000, // 15 phút
        });

        res.cookie('logged', 1, {
            httpOnly: false, // Chặn truy cập từ JavaScript (bảo mật hơn)
            secure: true, // Chỉ gửi trên HTTPS (để đảm bảo an toàn)
            sameSite: 'Strict', // Chống tấn công CSRF
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
        });

        new OK({ message: 'Refresh token thành công', metadata: { token } }).send(res);
    }

    async logout(req, res) {
        const { id } = req.user;
        await modelApiKey.destroy({ where: { userId: id } });
        res.clearCookie('token');
        res.clearCookie('refreshToken');
        res.clearCookie('logged');

        new OK({ message: 'Đăng xuất thành công' }).send(res);
    }

    async updateInfoUser(req, res, next) {
        const { id } = req.user;
        const { fullName, address, phone, sex } = req.body;

        const user = await modelUser.findOne({ where: { id } });

        let image = '';
        if (req.file) {
            // const result = await cloudinary.uploader.upload(req.file.path);
            // image = result.secure_url;
        } else {
            image = user.avatar;
        }

        if (!user) {
            throw new BadRequestError('Không tìm thấy tài khoản');
        }
        await user.update({ fullName, address, phone, sex, avatar: image });

        new OK({ message: 'Cập nhật thông tin tài khoản thành cong' }).send(res);
    }

    async loginGoogle(req, res) {
        const { credential } = req.body;
        const dataToken = jwtDecode(credential);
        const user = await modelUser.findOne({ where: { email: dataToken.email } });
        if (user) {
            await createApiKey(user.id);
            const token = await createToken({ id: user.id });
            const refreshToken = await createRefreshToken({ id: user.id });
            res.cookie('token', token, {
                httpOnly: true, // Chặn truy cập từ JavaScript (bảo mật hơn)
                secure: true, // Chỉ gửi trên HTTPS (để đảm bảo an toàn)
                sameSite: 'Strict', // Chống tấn công CSRF
                maxAge: 15 * 60 * 1000, // 15 phút
            });
            res.cookie('logged', 1, {
                httpOnly: false, // Chặn truy cập từ JavaScript (bảo mật hơn)
                secure: true, // Chỉ gửi trên HTTPS (để đảm bảo an toàn)
                sameSite: 'Strict', // ChONGL tấn công CSRF
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
            });
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'Strict',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
            });
            new OK({ message: 'Đăng nhập thành công', metadata: { token, refreshToken, role: user.role } }).send(res);
        } else {
            const newUser = await modelUser.create({
                fullName: dataToken.name,
                email: dataToken.email,
                typeLogin: 'google',
            });
            await newUser.save();
            await createApiKey(newUser.id);
            const token = await createToken({ id: newUser.id });
            const refreshToken = await createRefreshToken({ id: newUser.id });
            res.cookie('token', token, {
                httpOnly: true, // Chặn truy cập từ JavaScript (bảo mật hơn)
                secure: true, // Chỉ gửi trên HTTPS (để đảm bảo an toàn)
                sameSite: 'Strict', // ChONGL tấn công CSRF
                maxAge: 15 * 60 * 1000, // 15 phút
            });
            res.cookie('logged', 1, {
                httpOnly: false, // Chặn truy cập từ JavaScript (bảo mật hơn)
                secure: true, // Chỉ gửi trên HTTPS (để đảm bảo an toàn)
                sameSite: 'Strict', // ChONGL tấn công CSRF
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
            });
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'Strict',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
            });
            new OK({ message: 'Đăng nhập thành công', metadata: { token, refreshToken, role: newUser.role } }).send(res);
        }
    }

    async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            if (!email) {
                throw new BadRequestError('Vui lòng nhập email');
            }

            const user = await modelUser.findOne({ where: { email } });
            if (!user) {
                throw new AuthFailureError('Email không tồn tại');
            }

            const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '15m' });
            const otp = await otpGenerator.generate(6, {
                digits: true,
                lowerCaseAlphabets: false,
                upperCaseAlphabets: false,
                specialChars: false,
            });

            const saltRounds = 10;

            bcrypt.hash(otp, saltRounds, async function (err, hash) {
                if (err) {
                    console.error('Error hashing OTP:', err);
                } else {
                    await modelOtp.create({
                        email: user.email,
                        otp: hash,
                    });
                    await sendMailForgotPassword(email, otp);

                    return res
                        .setHeader('Set-Cookie', [
                            `tokenResetPassword=${token};  Secure; Max-Age=300; Path=/; SameSite=Strict`,
                        ])
                        .status(200)
                        .json({ message: 'Gửi thành công !!!' });
                }
            });
        } catch (error) {
            console.error('Error forgot password:', error);
            return res.status(500).json({ message: 'Có lỗi xảy ra' });
        }
    }

    async resetPassword(req, res) {
        try {
            const token = req.cookies.tokenResetPassword;
            const { otp, newPassword } = req.body;

            if (!token) {
                throw new BadRequestError('Vui lòng gửi yêu cầu quên mật khẩu');
            }

            const decode = jwt.verify(token, process.env.JWT_SECRET);
            if (!decode) {
                throw new AuthFailureError('Sai mã OTP hoặc đã hết hạn, vui lòng lấy OTP mới');
            }

            const findOTP = await modelOtp.findOne({
                where: { email: decode.email },
                order: [['createdAt', 'DESC']],
            });
            if (!findOTP) {
                throw new AuthFailureError('Sai mã OTP hoặc đã hết hạn, vui lòng lấy OTP mới');
            }

            // So sánh OTP
            const isMatch = await bcrypt.compare(otp, findOTP.otp);
            if (!isMatch) {
                throw new AuthFailureError('Sai mã OTP hoặc đã hết hạn, vui lòng lấy OTP mới');
            }

            // Hash mật khẩu mới
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

            // Tìm người dùng
            const findUser = await modelUser.findOne({ where: { email: decode.email } });
            if (!findUser) {
                throw new AuthFailureError('Người dùng không tồn tại');
            }

            // Cập nhật mật khẩu mới
            findUser.password = hashedPassword;
            await findUser.save();

            // Xóa OTP sau khi đặt lại mật khẩu thành công
            await modelOtp.destroy({ where: { email: decode.email } });
            res.clearCookie('tokenResetPassword');
            return res.status(200).json({ message: 'Đặt lại mật khẩu thành công' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng liên hệ ADMIN !!' });
        }
    }

    async getUsers(req, res) {
        const users = await modelUser.findAll();
        new OK({ message: 'Lấy danh sách người dùng thành công', metadata: users }).send(res);
    }

    async updateUser(req, res) {
        const { userId, fullName, phone, email, role, address } = req.body;

        const user = await modelUser.findOne({ where: { id: userId } });
        if (!user) {
            throw new BadRequestError('Người dùng không tồn tại');
        }
        user.fullName = fullName;
        user.phone = phone;
        user.email = email;
        user.role = role;
        user.address = address;
        await user.save();
        new OK({ message: 'Cập nhật người dùng thành công' }).send(res);
    }

    async changeAvatar(req, res) {
        const { file } = req;
        const { id } = req.user;
        if (!file) {
            throw new BadRequestError('Vui lòng chọn file');
        }
        const user = await modelUser.findOne({ where: { id } });
        if (!user) {
            throw new BadRequestError('Người dùng không tồn tại');
        }
        user.avatar = `uploads/avatars/${file.filename}`;
        await user.save();
        new OK({
            message: 'Upload thành công',
            metadata: `uploads/avatars/${file.filename}`,
        }).send(res);
    }

    async deleteUser(req, res) {
        const { userId } = req.body;
        const user = await modelUser.findOne({ where: { id: userId } });
        if (!user) {
            throw new BadRequestError('Người dùng không tồn tại');
        }
        await user.destroy();
        new OK({ message: 'Xóa người dùng thành công' }).send(res);
    }

    async updatePassword(req, res) {
        const { userId, password } = req.body;
        const user = await modelUser.findOne({ where: { id: userId } });
        if (!user) {
            throw new BadRequestError('Người dùng không tồn tại');
        }
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const passwordHash = bcrypt.hashSync(password, salt);
        user.password = passwordHash;
        await user.save();
        new OK({ message: 'Cập nhật mật khẩu thành công' }).send(res);
    }

    async requestIdStudent(req, res) {
        const { id } = req.user;
        const user = await modelUser.findOne({ where: { id } });
        if (!user) {
            throw new BadRequestError('Người dùng không tồn tại');
        }
        console.log(user.dataValues.idStudent);

        if (user.dataValues.idStudent !== null || user.dataValues.idStudent === '0') {
            throw new BadRequestError('Vui lòng chờ xác nhận ID sinh viên');
        } else {
            user.idStudent = '0';
            await user.save();
            new OK({ message: 'Yêu cầu thành công' }).send(res);
        }
    }

    async confirmIdStudent(req, res) {
        const { idStudent, userId } = req.body;
        if (!idStudent || !userId) {
            throw new BadRequestError('Vui lòng nhập ID sinh viên');
        }

        const user = await modelUser.findOne({ where: { id: userId } });
        if (!user) {
            throw new BadRequestError('Người dùng không tồn tại');
        }
        user.idStudent = idStudent;
        await user.save();
        new OK({ message: 'Xác nhận thành công' }).send(res);
    }

    async getRequestLoan(req, res) {
        const findRequestLoan = await modelUser.findAll({ where: { idStudent: '0' || null } });
        new OK({
            message: 'Lấy danh sách yêu cầu mượn sách thành công',
            metadata: findRequestLoan,
        }).send(res);
    }

    async getStatistics(req, res) {
        try {
            const dayjs = require('dayjs');
            const totalUsers = await User.count();
            const totalBooks = await Product.count();
            const pendingRequests = await HistoryBook.count({ where: { status: 'pending' } });

            const booksInStock = await Product.count({ where: { stock: { [Op.gt]: 0 } } });
            const booksOutOfStock = totalBooks - booksInStock;

            const bookStatusData = [
                { type: 'Còn sách', value: booksInStock },
                { type: 'Hết sách', value: booksOutOfStock },
            ];

            const approvedLoans = await HistoryBook.count({ where: { status: 'success' } });
            const pendingLoans = pendingRequests;
            const rejectedLoans = await HistoryBook.count({ where: { status: 'cancel' } });

            // 1. Thống kê người dùng: người dùng mượn nhiều nhất
            const topUsersData = await HistoryBook.findAll({
                attributes: ['userId', 'fullName', [Sequelize.fn('SUM', Sequelize.col('quantity')), 'totalBorrowed']],
                where: { quantity: { [Op.gt]: 0 } },
                group: ['userId', 'fullName'],
                order: [[Sequelize.literal('totalBorrowed'), 'DESC']],
                limit: 10,
                raw: true
            });

            // Người dùng trễ hạn và tính phạt (2000đ/ngày/cuốn)
            const pickedUpLoans = await HistoryBook.findAll({
                where: { status: 'picked_up' },
                raw: true
            });
            
            // Truy vấn lấy danh sách Tên Sách trước để dùng chung gán cho Penalty List
            const pickedUpBookIds = pickedUpLoans.map(loan => loan.bookId);
            const pickedUpBooks = pickedUpBookIds.length ? await Product.findAll({ where: { id: pickedUpBookIds }, raw: true }) : [];

            let penaltyList = [];
            let overdueCount = 0;
            let onTimeCount = 0; 
            
            pickedUpLoans.forEach(loan => {
                if (!loan.returnDate) return;
                const returnDate = dayjs(loan.returnDate);
                const today = dayjs();
                const daysOverdue = today.diff(returnDate, 'day');
                
                if (daysOverdue > 0) {
                    overdueCount++;
                    const penalty = daysOverdue * 2000 * Math.max(1, loan.quantity);
                    const bookInfo = pickedUpBooks.find(b => b.id === loan.bookId);
                    penaltyList.push({
                        id: loan.id,
                        userId: loan.userId,
                        fullName: loan.fullName,
                        phone: loan.phone,
                        bookId: loan.bookId,
                        bookName: bookInfo ? bookInfo.nameProduct : 'Sách đã xoá',
                        quantity: loan.quantity,
                        borrowDate: loan.borrowDate,
                        returnDate: loan.returnDate,
                        daysOverdue,
                        penalty

                    });
                } else {
                    onTimeCount++;
                }
            });
            
            // Xếp hạng User vi phạm từ cao xuống thấp
            penaltyList.sort((a,b) => b.penalty - a.penalty);

            // 2. Thống kê mượn - trả: Sách mượn nhiều nhất / ít nhất
            const bookBorrowStats = await HistoryBook.findAll({
                attributes: ['bookId', [Sequelize.fn('SUM', Sequelize.col('quantity')), 'totalBorrowed']],
                where: { quantity: { [Op.gt]: 0 } },
                group: ['bookId'],
                order: [[Sequelize.literal('totalBorrowed'), 'DESC']],
                raw: true
            });
            
            const bookIds = bookBorrowStats.map(b => b.bookId);
            const bookDetails = bookIds.length > 0 ? await Product.findAll({ where: { id: bookIds }, raw: true }) : [];
            const mappedBooks = bookBorrowStats.map(b => {
                const bInfo = bookDetails.find(d => d.id === b.bookId);
                return { 
                   name: bInfo ? bInfo.nameProduct : 'Sách đã xóa',
                   image: bInfo ? bInfo.image : '',
                   totalBorrowed: parseInt(b.totalBorrowed, 10) || 0 
                };
            });
            
            const topBorrowedBooks = mappedBooks.slice(0, 10);
            const leastBorrowedBooks = [...mappedBooks].reverse().slice(0, 10);

            // 3. Tỉ lệ đúng hạn / quá hạn
            const penaltyRatioData = [
                { type: 'Đúng hạn', value: onTimeCount },
                { type: 'Quá hạn', value: overdueCount > 0 ? overdueCount : 0 }
            ];

            // 4. Thống kê theo thời gian (Ngày) - Cho phép Frontend tự gom nhóm theo Tuần/Tháng/Năm
            const borrowByMonth = await HistoryBook.findAll({
                attributes: [
                    [Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m-%d'), 'date'],
                    [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
                ],
                group: ['date'],
                order: [['date', 'ASC']],
                raw: true
            });

            const newUsersByMonth = await User.findAll({
                attributes: [
                    [Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m-%d'), 'date'],
                    [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
                ],
                group: ['date'],
                order: [['date', 'ASC']],
                raw: true
            });

            const newBooksByMonth = await Product.findAll({
                attributes: [
                    [Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m-%d'), 'date'],
                    [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
                ],
                group: ['date'],
                order: [['date', 'ASC']],
                raw: true
            });

            const loanStatusData = [
                { status: 'Đã duyệt', count: approvedLoans },
                { status: 'Chờ duyệt', count: pendingLoans },
                { status: 'Từ chối (hoặc trả)', count: rejectedLoans },
                { status: 'Quá hạn', count: overdueCount },
            ];

            res.status(200).json({
                totalUsers,
                totalBooks,
                pendingRequests,
                bookStatusData,
                loanStatusData,
                topUsersData,
                penaltyList,
                topBorrowedBooks,
                leastBorrowedBooks,
                penaltyRatioData,
                timeStats: {
                    borrowByMonth,
                    newUsersByMonth,
                    newBooksByMonth
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Lỗi server khi thống kê: ' + error.message });
        }
    }
}

module.exports = new controllerUser();
