// File: src/pages/Contact.jsx

import React, { useState, useEffect } from 'react';
import './Contact.css';
import { sendMessage } from './api/use-contact'; // Thêm dòng này

const Contact = () => {
  useEffect(() => {
    document.title = 'Liên hệ – Cookbook';
  }, []);

  // Lấy thông tin user từ localStorage ngay khi component được mount.
  const user = JSON.parse(localStorage.getItem('user')) || {};

  const [formData, setFormData] = useState({
    accountName: user.displayName || '',
    accountEmail: user.email || '',
    // phone: '', // Đã bỏ trường phone
    infoInput: '',
    company: ''
  });

  // Khi thông tin user được load (ví dụ: sau khi đăng nhập),
  // cập nhật state formData nếu user thay đổi.
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user')) || {};
    setFormData(prev => ({
      ...prev,
      accountName: currentUser.displayName || prev.accountName,
      accountEmail: currentUser.email || prev.accountEmail,
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Chỉ gửi message là nội dung infoInput
    const message = formData.infoInput;

    try {
      await sendMessage(message);
      setFormData(prev => ({
        ...prev,
        infoInput: '',
        company: ''
      }));
      alert('Thông tin liên hệ đã được gửi!');
    } catch (error) {
      alert('Gửi thông tin thất bại!');
    }
  };

  return (
    <div className="contact-container">
      <h1 className="contact-title">Liên hệ</h1>
      <p className="contact-subtitle">Bạn vui lòng cung cấp thông tin liên hệ:</p>
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="accountName">
            Tên tài khoản: <span className="required">*</span>
          </label>
          <input
            type="text"
            id="accountName"
            name="accountName"
            value={formData.accountName}
            onChange={handleChange}
            required
            readOnly
            placeholder="Tên tài khoản của bạn"
            className="readonly-input"
          />
        </div>

        {/* Đã bỏ toàn bộ div form-group cho "Số điện thoại" */}

        <div className="form-group">
          <label htmlFor="accountEmail">
            Email tài khoản: <span className="required">*</span>
          </label>
          <input
            type="email"
            id="accountEmail"
            name="accountEmail"
            value={formData.accountEmail}
            onChange={handleChange}
            required
            readOnly
            placeholder="Email tài khoản của bạn"
            className="readonly-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="infoInput">
            Nhập thông tin: <span className="required">*</span>
          </label>
          <textarea
            id="infoInput"
            name="infoInput"
            value={formData.infoInput}
            onChange={handleChange}
            required
            rows="5"
            placeholder="Vui lòng nhập thông tin chi tiết của bạn tại đây"
          ></textarea>
        </div>

        <button type="submit" className="submit-btn">
          Gửi thông tin
        </button>
      </form>
    </div>
  );
};

export default Contact;