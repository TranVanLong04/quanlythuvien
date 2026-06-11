const { google } = require('googleapis');
const nodemailer = require('nodemailer');
require('dotenv').config();
const dayjs = require('dayjs');

const EMAIL_USER = process.env.USER_EMAIL;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

const SendMailBookBorrowRequest = async (email, productInfo, borrowDate, returnDate) => {
    try {

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: `"Thư viện DAU" <${EMAIL_USER}>`,
            to: email,
            subject: 'Đơn mượn sách đang được xử lý',
            text: `Hệ thống đã ghi nhận đơn mượn sách: ${productInfo.nameProduct}. Vui lòng chờ admin phê duyệt.`,
            html: `
            <!DOCTYPE html>
            <html lang="vi">
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: 'Roboto', sans-serif; background-color: #f2f4f8; margin: 0; padding: 0; color: #2d3436; }
                    .container { max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 6px 12px rgba(0,0,0,0.1); }
                    .header { background: linear-gradient(135deg, #0984e3, #74b9ff); padding: 30px; color: #ffffff; text-align: center; }
                    .header h2 { margin: 0; font-size: 22px; }
                    .success-icon { font-size: 48px; margin-bottom: 10px; }
                    .content { padding: 30px; }
                    .message { font-size: 16px; margin-bottom: 20px; line-height: 1.6; }
                    .book-info { background-color: #f8f9fa; border-left: 4px solid #0984e3; padding: 20px; margin: 20px 0; border-radius: 5px; }
                    .book-title { font-size: 18px; font-weight: bold; color: #2d3436; margin-bottom: 10px; }
                    .book-details { font-size: 14px; color: #636e72; line-height: 1.5; }
                    .return-date { text-align: center; background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; font-size: 16px; font-weight: bold; color: #856404; border-radius: 8px; margin: 20px 0; }
                    .note { background-color: #e8f4f8; border-left: 4px solid #74b9ff; padding: 15px; margin: 20px 0; border-radius: 5px; font-size: 14px; }
                    .footer { text-align: center; font-size: 14px; padding: 20px; background-color: #f1f2f6; color: #636e72; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="success-icon">⏳</div>
                        <h2>Đơn mượn sách đã được ghi nhận!</h2>
                    </div>
                    <div class="content">
                        <div class="message">
                            Hệ thống đã nhận được đơn yêu cầu mượn sách của bạn. Quản trị viên đang tiến hành kiểm tra và duyệt đơn.
                        </div>
                        
                        <div class="book-info">
                            <div class="book-title">${productInfo.nameProduct}</div>
                            <div class="book-details">
                                <strong>Số lượng còn lại trong kho:</strong> ${productInfo.stock} cuốn<br/>
                                <strong>Ngày mượn:</strong> ${borrowDate}
                            </div>
                        </div>

                        <div class="return-date">
                            📅 Ngày trả dự kiến: ${dayjs(returnDate).format('DD/MM/YYYY')}
                        </div>

                        <div class="note">
                            <strong>Lưu ý quan trọng:</strong><br/>
                            • Hệ thống sẽ gửi một email xác nhận khác khi đơn mượn được phê duyệt.<br/>
                            • <strong>Hạn lấy sách:</strong> Trong vòng 2 ngày kể từ khi đơn mượn chuyển sang trạng thái "Thành công" (Đã duyệt), nếu bạn chưa qua lấy sách thì thư viện sẽ tự động Hủy đơn.<br/>
                            • Bạn có thể sử dụng tính năng "Gia hạn" khi ngày trả còn dưới 2 ngày.
                        </div>
                    </div>
                    <div class="footer">
                        Trân trọng,<br/><strong>Thư viện DAU</strong><br/>📞 Hotline: 0353788379 | 📧 longtran13112004@gmail.com
                    </div>
                </div>
            </body>
            </html>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email xác nhận đăng ký mượn sách đã gửi:', info.messageId);
    } catch (error) {
        console.error('❌ Lỗi khi gửi email xác nhận đăng ký mượn sách:', error);
    }
};

module.exports = SendMailBookBorrowRequest;
