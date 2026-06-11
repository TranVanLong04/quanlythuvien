import { useState } from 'react';
import { Button, Form, Input, Divider, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { requestRegister } from '../config/request';
import { toast } from 'react-toastify';
import imagesLogin from '../assets/images/login.jpg';

function RegisterUser() {
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const onFinish = async (values) => {
        setLoading(true);

        // Kiểm tra mật khẩu xác nhận
        if (values.password !== values.confirmPassword) {
            message.error('Mật khẩu xác nhận không khớp!');
            setLoading(false);
            return;
        }

        try {
            await requestRegister(values);
            toast.success('Đăng ký thành công!');
            setLoading(false);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            navigate('/');
        } catch (error) {
            toast.error(error.response.data.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <header>
                <Header />
            </header>

            <main className="flex-grow flex items-center justify-center bg-slate-50 py-12 relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-[10%] left-[5%] w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

                <div className="container mx-auto px-4 relative z-10 animate-fade-in-up">
                    <div className="flex flex-col lg:flex-row items-stretch max-w-5xl mx-auto bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50">
                        {/* Phần hình ảnh */}
                        <div className="hidden lg:flex lg:w-1/2 relative group">
                            <img
                                src={`${import.meta.env.VITE_API_URL_IMAGE}/${imagesLogin}`}
                                alt="Thư viện"
                                className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 via-indigo-900/40 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-10 text-white transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0">
                                <h2 className="text-4xl font-black mb-4 drop-shadow-lg tracking-tight">Cùng tham gia<br/>cộng đồng độc giả</h2>
                                <p className="text-indigo-100 text-lg font-medium drop-shadow leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                    Tạo tài khoản mới để sở hữu thư viện số của riêng bạn. Hàng ngàn cuốn sách hấp dẫn đang chờ đón!
                                </p>
                            </div>
                        </div>

                        {/* Phần form đăng ký */}
                        <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center bg-white relative">
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-extrabold text-slate-800 mb-2 tracking-tight">Tạo tài khoản</h1>
                                <p className="text-slate-500 font-medium">Bắt đầu hành trình đọc sách của bạn</p>
                            </div>

                            <Form
                                name="register_form"
                                className="register-form"
                                initialValues={{ typeLogin: 'email' }}
                                onFinish={onFinish}
                                layout="vertical"
                                size="large"
                            >
                                <Form.Item
                                    name="fullName"
                                    rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                                    className="mb-4"
                                >
                                    <Input
                                        prefix={<UserOutlined className="text-slate-400 mr-2" />}
                                        placeholder="Họ và tên"
                                        className="rounded-xl px-4 py-3 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="email"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập email!' },
                                        { type: 'email', message: 'Email không hợp lệ!' },
                                    ]}
                                    className="mb-4"
                                >
                                    <Input
                                        prefix={<MailOutlined className="text-slate-400 mr-2" />}
                                        placeholder="Email"
                                        className="rounded-xl px-4 py-3 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="password"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập mật khẩu!' },
                                        { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
                                    ]}
                                    className="mb-4"
                                >
                                    <Input.Password
                                        prefix={<LockOutlined className="text-slate-400 mr-2" />}
                                        placeholder="Mật khẩu"
                                        className="rounded-xl px-4 py-3 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="confirmPassword"
                                    rules={[
                                        { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                            },
                                        }),
                                    ]}
                                    className="mb-5"
                                >
                                    <Input.Password
                                        prefix={<LockOutlined className="text-slate-400 mr-2" />}
                                        placeholder="Xác nhận mật khẩu"
                                        className="rounded-xl px-4 py-3 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                    />
                                </Form.Item>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
                                    <Form.Item name="phone" className="mb-4 sm:mb-0">
                                        <Input
                                            prefix={<PhoneOutlined className="text-slate-400 mr-2" />}
                                            placeholder="SĐT (tùy chọn)"
                                            className="rounded-xl px-4 py-3 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                        />
                                    </Form.Item>

                                    <Form.Item name="address" className="mb-4 sm:mb-0">
                                        <Input
                                            prefix={<HomeOutlined className="text-slate-400 mr-2" />}
                                            placeholder="Địa chỉ (tùy chọn)"
                                            className="rounded-xl px-4 py-3 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                        />
                                    </Form.Item>
                                </div>

                                <Form.Item name="typeLogin" hidden>
                                    <Input type="hidden" />
                                </Form.Item>

                                <Form.Item className="mt-6 mb-6">
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className="w-full h-14 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-base font-bold tracking-wide"
                                        loading={loading}
                                    >
                                        Đăng ký ngay
                                    </Button>
                                </Form.Item>

                                <div className="text-center pt-2">
                                    <p className="text-slate-500 font-medium mb-3">Đã có tài khoản?</p>
                                    <Link to="/login">
                                        <Button className="w-full h-12 rounded-xl text-slate-600 font-semibold border-slate-300 hover:border-blue-400 hover:text-blue-600 transition-colors">
                                            Đăng nhập
                                        </Button>
                                    </Link>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </main>

            <footer>
                <Footer />
            </footer>
        </div>
    );
}

export default RegisterUser;
