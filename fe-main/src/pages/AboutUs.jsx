// File: src/pages/AboutUs.jsx

import React, { useEffect } from 'react';
import './AboutUs.css';

export default function AboutUs() {
  // Đặt lại tiêu đề trang khi component mount
  useEffect(() => {
    document.title = 'CookBook – About Us';
  }, []);

  return (
    <div className="aboutus-container">
      <h1 className="aboutus-title">About Us</h1>
      <p className="aboutus-intro">
        Chúng tôi là đội ngũ phát triển của dự án Cookbook. Dưới đây là thông tin về ba thành viên chính:
      </p>
      <div className="table-wrapper">
        <table className="aboutus-table">
          <thead>
            <tr>
              <th>Tên</th>
              <th>MSSV</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Nguyễn Văn Việt Quang</td>
              <td>20213583</td>
              <td>Backend</td>
            </tr>
            <tr>
              <td>Đào Đức Nhật Minh</td>
              <td>20210603</td>
              <td>Frontend</td>
            </tr>
            <tr>
              <td>Nguyễn Anh Duy</td>
              <td>20210274</td>
              <td>App</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
