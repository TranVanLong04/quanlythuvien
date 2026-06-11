import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Context from '../store/Context';
import cookies from 'js-cookie';

const RoleRouteGuard = ({ children, allowedRole }) => {
    const { dataUser } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        const token = cookies.get('logged');

        // Nếu chuỗi bảo mật admin yêu cầu mà không có token => login
        if (!token && allowedRole === 'admin') {
            navigate('/login', { replace: true });
            return;
        }

        // Khi dữ liệu user đã load xong
        if (dataUser && dataUser.role) {
            if (dataUser.role === 'admin' && allowedRole === 'user') {
                // Admin không được vào trang của User -> sang Admin
                navigate('/admin', { replace: true });
            } else if (dataUser.role === 'user' && allowedRole === 'admin') {
                // User thường không được vào trang của Admin -> sang Home
                navigate('/', { replace: true });
            }
        }
    }, [dataUser, navigate, allowedRole]);

    // Render components
    return <>{children}</>;
};

export default RoleRouteGuard;
