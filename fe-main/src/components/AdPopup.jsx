// File: src/components/AdPopup.jsx

import React from 'react';
import './AdPopup.css';

/**
 * Component hiển thị popup quảng cáo.
 * Props:
 *  - visible: Boolean, quyết định có hiển thị popup hay không.
 *  - onClose: Hàm callback khi nhấn nút đóng.
 */
const AdPopup = ({ visible, onClose }) => {
  if (!visible) return null; // Nếu không hiển thị, trả về null

  return (
    <div className="ad-popup-overlay">
      <div className="ad-popup-content">
        {/* Nút đóng */}
        <button className="ad-popup-close-btn" onClick={onClose}>
          ×
        </button>

        {/* Tiêu đề quảng cáo */}
        <h2>Ưu đãi đặc biệt!</h2>

        {/* Hình / nội dung quảng cáo (có thể thay thế bằng hình ảnh thực tế) */}
        <div className="ad-popup-body">
          <img
            src="FE\web-prj\src\assets\react.svg"
            alt="Quảng cáo sản phẩm"
            className="ad-popup-image"
          />
          <p>
            Đăng ký ngay hôm nay để nhận Ưu Đãi 50% cho khách hàng mới! Chương
            trình chỉ diễn ra trong 24 giờ.
          </p>
          <a href="/promotion" className="ad-popup-cta">
            Tìm hiểu thêm
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdPopup;
