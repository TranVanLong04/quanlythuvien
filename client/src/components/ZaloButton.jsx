import React, { useState } from 'react';
import { message } from 'antd';

/**
 * Component nút bấm Zalo
 * - Mở Zalo app trên mobile qua deep link
 * - Fallback sang web trên desktop
 * - Có hiệu ứng hover, responsive
 */
const ZaloButton = ({ 
    phoneNumber = '0353788379',
    text = 'Chat Zalo',
    className = '',
    style = {},
    showIcon = true
}) => {
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Detect xem device có phải mobile không
     */
    const isMobileDevice = () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    /**
     * Xử lý click nút Zalo
     * - Ưu tiên deep link trên mobile
     * - Fallback sang web nếu không mở được
     */
    const handleZaloClick = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const isMobile = isMobileDevice();
            const deepLinkUrl = `zalo://chat?phone=${phoneNumber}`;
            const fallbackUrl = `https://zalo.me/${phoneNumber}`;

            if (isMobile) {
                // Trên mobile: thử mở deep link trước
                const timer = setTimeout(() => {
                    // Nếu không mở được deep link sau 1.5s, fallback sang web
                    window.location.href = fallbackUrl;
                }, 1500);

                // Thử mở deep link
                window.location.href = deepLinkUrl;

                // Xóa timer nếu deep link thành công (window.location thay đổi)
                return () => clearTimeout(timer);
            } else {
                // Trên desktop: mở web Zalo
                window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
                message.success('Đang mở Zalo trên trình duyệt...');
            }
        } catch (error) {
            console.error('Lỗi khi mở Zalo:', error);
            message.error('Không thể mở Zalo. Vui lòng thử lại!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={handleZaloClick}
                disabled={isLoading}
                className={`zalo-button ${className}`}
                style={style}
                title={`Chat với ${phoneNumber} qua Zalo`}
                aria-label={`Liên hệ Zalo - ${phoneNumber}`}
            >
                {/* Icon Zalo - SVG inline */}
                {showIcon && (
                    <svg
                        className="zalo-icon"
                        viewBox="0 0 48 48"
                        width="24"
                        height="24"
                        fill="currentColor"
                    >
                        <path d="M24 2C12.95 2 4 10.95 4 22c0 6.52 3.32 12.26 8.35 15.72L11 46l8.02-4.21c2.34.65 4.82 1 7.38 1 11.05 0 20-8.95 20-20S35.05 2 24 2m0 37c-2.16 0-4.22-.32-6.18-.93l-.44-.15-4.58 2.41.63-4.51-.35-.56C6.86 31.54 4.5 27.06 4.5 22c0-10.49 8.51-19 19-19s19 8.51 19 19-8.51 19-19 19z" />
                        {/* Vòng tròn bên trong */}
                        <path d="M16.5 13h-2c-.28 0-.5.22-.5.5v10c0 .28.22.5.5.5h2c.28 0 .5-.22.5-.5v-10c0-.28-.22-.5-.5-.5m6 0h-2c-.28 0-.5.22-.5.5v10c0 .28.22.5.5.5h2c.28 0 .5-.22.5-.5v-10c0-.28-.22-.5-.5-.5m6 0h-2c-.28 0-.5.22-.5.5v10c0 .28.22.5.5.5h2c.28 0 .5-.22.5-.5v-10c0-.28-.22-.5-.5-.5m6 0h-2c-.28 0-.5.22-.5.5v10c0 .28.22.5.5.5h2c.28 0 .5-.22.5-.5v-10c0-.28-.22-.5-.5-.5" />
                    </svg>
                )}
                
                {/* Text nút */}
                <span className="zalo-text">{isLoading ? 'Đang mở...' : text}</span>
            </button>

            <style jsx>{`
                .zalo-button {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding: 10px 20px;
                    background: linear-gradient(135deg, #0068FF 0%, #005FE8 100%);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 8px rgba(0, 104, 255, 0.3);
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                    white-space: nowrap;
                    user-select: none;
                }

                .zalo-button:hover:not(:disabled) {
                    background: linear-gradient(135deg, #0055D4 0%, #004AC2 100%);
                    box-shadow: 0 4px 16px rgba(0, 104, 255, 0.4);
                    transform: translateY(-2px);
                }

                .zalo-button:active:not(:disabled) {
                    transform: translateY(0);
                    box-shadow: 0 2px 8px rgba(0, 104, 255, 0.3);
                }

                .zalo-button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .zalo-icon {
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .zalo-text {
                    display: inline-block;
                }

                /* Responsive: Mobile */
                @media (max-width: 640px) {
                    .zalo-button {
                        padding: 12px 16px;
                        font-size: 13px;
                        gap: 6px;
                    }

                    .zalo-icon {
                        width: 18px;
                        height: 18px;
                    }
                }

                /* Focus state cho accessibility */
                .zalo-button:focus-visible {
                    outline: 2px solid rgba(0, 104, 255, 0.5);
                    outline-offset: 2px;
                }
            `}</style>
        </>
    );
};

export default ZaloButton;
