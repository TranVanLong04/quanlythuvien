import { useState } from 'react';
import { Button, Form, Input, Card, Divider, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { requestLogin } from '../config/request';
import { toast } from 'react-toastify';
import imagesLogin from '../assets/images/login.jpg';

function LoginUser() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const onFinish = async (values) => {
        setLoading(true);

        try {
            const response = await requestLogin(values);
            const userRole = response.data?.metadata?.role || 'user';
            
            toast.success('Đăng nhập thành công!');
            setLoading(false);
            
            setTimeout(() => {
                window.location.reload();
            }, 1000);

            if (userRole === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
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
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col lg:flex-row items-stretch max-w-5xl mx-auto bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50">
                        {/* Phần hình ảnh */}
                        <div className="hidden lg:flex lg:w-1/2 relative group">
                            <img
                                src={`${import.meta.env.VITE_API_URL_IMAGE}/${imagesLogin}`}
                                alt="Thư viện"
                                className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/40 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-10 text-white transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0">
                                <h2 className="text-4xl font-black mb-4 drop-shadow-lg tracking-tight">Khám phá<br/>thế giới tri thức</h2>
                                <p className="text-blue-100 text-lg font-medium drop-shadow leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                    Đăng nhập để mượn sách, quản lý lộ trình học tập và theo dõi lịch sử đọc của bạn một cách dễ dàng và tiện lợi nhất.
                                </p>
                            </div>
                        </div>

                        {/* Phần form đăng nhập */}
                        <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-14 flex flex-col justify-center bg-white relative">
                            <div className="text-center mb-10">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-50 mb-6 shadow-inner ring-1 ring-blue-500/10">
                                    <UserOutlined className="text-3xl text-blue-600" />
                                </div>
                                <h1 className="text-3xl font-extrabold text-slate-800 mb-2 tracking-tight">Chào mừng trở lại!</h1>
                                <p className="text-slate-500 font-medium text-sm sm:text-base">Vui lòng đăng nhập vào tài khoản của bạn</p>
                            </div>

                            <Form
                                name="login_form"
                                className="login-form"
                                initialValues={{ remember: true }}
                                onFinish={onFinish}
                                layout="vertical"
                                size="large"
                            >
                                <Form.Item
                                    name="email"
                                    rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
                                    className="mb-5"
                                >
                                    <Input
                                        prefix={<UserOutlined className="text-slate-400 mr-2" />}
                                        placeholder="Email của bạn"
                                        className="rounded-xl px-4 py-3 bg-slate-50 border-slate-200 focus:bg-white hover:bg-white transition-colors text-base"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="password"
                                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                                    className="mb-4"
                                >
                                    <Input.Password
                                        prefix={<LockOutlined className="text-slate-400 mr-2" />}
                                        placeholder="Mật khẩu"
                                        className="rounded-xl px-4 py-3 bg-slate-50 border-slate-200 focus:bg-white hover:bg-white transition-colors text-base"
                                    />
                                </Form.Item>

                                <div className="flex justify-end mb-8">
                                    <Link className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors" to="/forgot-password">
                                        Quên mật khẩu?
                                    </Link>
                                </div>

                                <Form.Item className="mb-6">
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className="w-full h-14 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-base font-bold tracking-wide"
                                        loading={loading}
                                    >
                                        Đăng nhập
                                    </Button>
                                </Form.Item>

                                <div className="relative flex items-center py-5">
                                    <div className="flex-grow border-t border-slate-200"></div>
                                    <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-medium">Hoặc</span>
                                    <div className="flex-grow border-t border-slate-200"></div>
                                </div>

                                <div className="text-center pt-2">
                                    <Link to="/register">
                                        <Button className="w-full h-12 rounded-xl text-slate-600 font-semibold border-slate-300 hover:border-blue-400 hover:text-blue-600 transition-colors">
                                            Đăng ký tài khoản mới
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

export default LoginUser;
