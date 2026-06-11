import { useState } from 'react';
import { Button, Form, Input, message, Card, Divider } from 'antd';
import { MailOutlined, LockOutlined, KeyOutlined } from '@ant-design/icons';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { requestForgotPassword, requestResetPassword } from '../config/request';

function ForgotPassword() {
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleEmailSubmit = async (values) => {
        try {
            setLoading(true);
            // Replace with your actual API endpoint
            const data = {
                email: values.email,
            };
            await requestForgotPassword(data);
            setEmail(values.email);
            setIsEmailSent(true);
            message.success('Mã xác thực đã được gửi đến email của bạn!');
        } catch (error) {
            message.error('Có lỗi xảy ra. Vui lòng thử lại sau!');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (values) => {
        try {
            setLoading(true);
            const data = {
                email: email,
                otp: values.otp,
                newPassword: values.newPassword,
            };
            await requestResetPassword(data);
            message.success('Đặt lại mật khẩu thành công!');
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        } catch (error) {
            message.error('Có lỗi xảy ra. Vui lòng thử lại sau!');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <header className="sticky top-0 z-50">
                <Header />
            </header>

            <main className="flex-grow flex items-center justify-center bg-slate-50 py-12 px-4 relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-[15%] left-[15%] w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute bottom-[15%] right-[15%] w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

                <div className="w-full max-w-lg bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-8 sm:p-12 relative z-10 animate-fade-in-up">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-blue-50 mb-6 shadow-inner ring-1 ring-indigo-500/10">
                            {isEmailSent ? <KeyOutlined className="text-3xl text-indigo-600" /> : <MailOutlined className="text-3xl text-indigo-600" />}
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Quên mật khẩu</h2>
                        <p className="text-slate-500 font-medium mt-3 text-sm sm:text-base">
                            {!isEmailSent
                                ? 'Nhập email của bạn để nhận mã xác thực'
                                : 'Nhập mã xác thực và mật khẩu mới để tiếp tục'}
                        </p>
                    </div>

                    <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-8"></div>

                    {!isEmailSent ? (
                        <Form name="forgot_password" layout="vertical" onFinish={handleEmailSubmit} autoComplete="off">
                            <Form.Item
                                name="email"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập email!' },
                                    { type: 'email', message: 'Email không hợp lệ!' },
                                ]}
                                className="mb-6"
                            >
                                <Input
                                    prefix={<MailOutlined className="text-slate-400 mr-2" />}
                                    placeholder="Email đã đăng ký"
                                    className="rounded-xl px-4 py-3 bg-slate-50 border-slate-200 focus:bg-white transition-colors text-base"
                                />
                            </Form.Item>

                            <Form.Item className="mb-6">
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="w-full h-14 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-base font-bold tracking-wide"
                                    loading={loading}
                                >
                                    Giửi mã xác thực
                                </Button>
                            </Form.Item>

                            <div className="text-center mt-6">
                                <a href="/login" className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors">
                                    ← Quay lại đăng nhập
                                </a>
                            </div>
                        </Form>
                    ) : (
                        <Form name="reset_password" layout="vertical" onFinish={handleResetPassword} autoComplete="off">
                            <Form.Item
                                name="otp"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập mã OTP!' },
                                    { min: 6, message: 'Mã OTP phải có ít nhất 6 ký tự!' },
                                ]}
                                className="mb-5"
                            >
                                <Input
                                    prefix={<KeyOutlined className="text-slate-400 mr-2" />}
                                    placeholder="Mã xác thực OTP"
                                    className="rounded-xl px-4 py-3 bg-slate-50 border-slate-200 focus:bg-white transition-colors text-base"
                                />
                            </Form.Item>

                            <Form.Item
                                name="newPassword"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                                    { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' },
                                ]}
                                className="mb-5"
                            >
                                <Input.Password
                                    prefix={<LockOutlined className="text-slate-400 mr-2" />}
                                    placeholder="Mật khẩu mới"
                                    className="rounded-xl px-4 py-3 bg-slate-50 border-slate-200 focus:bg-white transition-colors text-base"
                                />
                            </Form.Item>

                            <Form.Item
                                name="confirmPassword"
                                dependencies={['newPassword']}
                                rules={[
                                    { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('newPassword') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                        },
                                    }),
                                ]}
                                className="mb-6"
                            >
                                <Input.Password
                                    prefix={<LockOutlined className="text-slate-400 mr-2" />}
                                    placeholder="Xác nhận mật khẩu mới"
                                    className="rounded-xl px-4 py-3 bg-slate-50 border-slate-200 focus:bg-white transition-colors text-base"
                                />
                            </Form.Item>

                            <Form.Item className="mb-6">
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="w-full h-14 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-base font-bold tracking-wide"
                                    loading={loading}
                                >
                                    Đặt lại mật khẩu
                                </Button>
                            </Form.Item>

                            <div className="text-center mt-6">
                                <Button
                                    type="text"
                                    onClick={() => setIsEmailSent(false)}
                                    className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
                                >
                                    Quay lại nhập email
                                </Button>
                            </div>
                        </Form>
                    )}
                </div>
            </main>

            <footer>
                <Footer />
            </footer>
        </div>
    );
}

export default ForgotPassword;
