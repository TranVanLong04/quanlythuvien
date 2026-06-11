import App from '../App';
import DetailProduct from '../pages/DetailProduct';
import Login from '../pages/Login';
import RegisterUser from '../pages/RegisterUser';
import Admin from '../pages/DashbroadComponents/index';
import InfoUser from '../pages/InfoUser';
import ForgotPassword from '../pages/ForgotPassword';
import NoiQuy from '../pages/NoiQuy';
import RoleRouteGuard from '../components/RoleRouteGuard';

export const routes = [
    {
        path: '/',
        // Chỉ User thường (hoặc khách chưa login) mới đc xem trang chủ
        component: <RoleRouteGuard allowedRole="user"><App /></RoleRouteGuard>,
    },
    {
        path: '/product/:id',
        component: <RoleRouteGuard allowedRole="user"><DetailProduct /></RoleRouteGuard>,
    },
    {
        path: '/login',
        // Update: Chặn admin/user nếu đã đăng nhập thì tự động xử lý qua context/routing nội bộ
        // Ta giữ nguyên form login, sau khi login thành công code sẽ redirect.
        component: <Login />, 
    },
    {
        path: '/register',
        component: <RegisterUser />,
    },
    {
        path: '/admin',
        // Chỉ định danh riêng cho Admin
        component: <RoleRouteGuard allowedRole="admin"><Admin /></RoleRouteGuard>,
    },
    {
        path: '/infoUser',
        component: <RoleRouteGuard allowedRole="user"><InfoUser /></RoleRouteGuard>,
    },
    {
        path: '/forgot-password',
        component: <ForgotPassword />,
    },
    {
        path: '/noi-quy',
        component: <RoleRouteGuard allowedRole="user"><NoiQuy /></RoleRouteGuard>,
    },
];