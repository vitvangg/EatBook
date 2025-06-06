import React, { useState } from 'react';
import './EditProfile.css';
import { useUpdateUser } from './api/use-update-user';

const EditProfile = () => {
  const userData = JSON.parse(localStorage.getItem('user'))
  // Giả lập dữ liệu user ban đầu
  const [user, setUser] = useState(userData);

  // Các mảng chọn ngày tháng năm
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

  const userDateOfBirth = new Date(userData.dateOfBirth)
  const [date, setDate] = useState(userDateOfBirth.getDate())
  const [month, setMonth] = useState(userDateOfBirth.getMonth())
  const [year, setYear] = useState(userDateOfBirth.getFullYear())

  const { updateUser } = useUpdateUser()

  // Hàm xử lý thay đổi giá trị input
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [key, subKey] = name.split('.');
      setUser(prev => ({
        ...prev,
        [key]: { ...prev[key], [subKey]: value }
      }));
    } else {
      setUser(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Hàm xử lý tải ảnh lên (avatar và background)
  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'avatar') {
          setUser(prev => ({ ...prev, avatarUrl: reader.result }));
        } else if (type === 'background') {
          setUser(prev => ({ ...prev, backgroundUrl: reader.result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Hàm submit (chưa kết nối API)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const userNewDateOfBirth = new Date(year, month, date)
    const userNewData = {
      ...user,
      dateOfBirth: userNewDateOfBirth,
      bio: {
        ...user.bio,
        currentPlaces: typeof user.bio.currentPlaces === 'string' ? user.bio.currentPlaces.split(',') : user.bio.currentPlaces
      }
    }
    const response = await updateUser(userNewData)
    if (response.success) {
      alert('Lưu thông tin thành công');
      localStorage.setItem('user', JSON.stringify(response.data._doc))
      window.location.href = '/user/' + user._id
    } else {
      alert('Lưu thông tin thất bại');
    }
  };

  const handleSelectDOB = (e) => {
    const { name, value } = e.target;
    if (name === 'day') setDate(value)
    else if (name === 'month') setMonth(value - 1)
    else if (name === 'year') setYear(value)
  }

  return (
    <div className="edit-profile-container">
      <h2>Chỉnh sửa trang cá nhân</h2>

      <form onSubmit={handleSubmit} className="edit-profile-form">
        <div className="background-upload">
          <div className="background-placeholder">
            {/* Hiển thị ảnh nền */}
            {user.backgroundUrl ? (
              <img src={user.backgroundUrl} alt="Ảnh bìa" />
            ) : (
              <div className="placeholder-text">Thay đổi ảnh bìa</div>
            )}
            <input
              type="file"
              id="background-upload-input"
              style={{ display: 'none' }}
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'background')}
            />
            <button
              type="button"
              className="btn-upload"
              onClick={() => document.getElementById('background-upload-input').click()}
            >
              📷
            </button>
          </div>
        </div>

        <div className="avatar-upload">
          <div className="avatar-placeholder">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" />
            ) : (
              <div className="placeholder-circle">📷</div>
            )}
            <input
              type="file"
              id="avatar-upload-input"
              style={{ display: 'none' }}
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'avatar')}
            />
            <button
              type="button"
              className="btn-upload-circle"
              onClick={() => document.getElementById('avatar-upload-input').click()}
            >
              📷
            </button>
          </div>
        </div>

        <div className="input-group">
          <label>Tên hiển thị</label>
          <input
            type="text"
            name="displayName"
            maxLength="50"
            value={user.displayName}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="input-group dob-group">
            <label>Ngày sinh</label>
            <div style={{ display: 'flex', gap: '10px' }}>
            <select name="day" value={date} onChange={handleSelectDOB}>
              <option value="">Ngày</option>
              {days.map(day => <option key={day} value={day}>{day}</option>)}
            </select>
            <select name="month" value={month + 1} onChange={handleSelectDOB}>
              <option value="">Tháng</option>
              {months.map(month => <option key={month} value={month}>{month}</option>)}
            </select>
            <select name="year" value={year} onChange={handleSelectDOB}>
              <option value="">Năm</option>
              {years.map(year => <option key={year} value={year}>{year}</option>)}
            </select>
          </div>
          <div className="input-group gender-group">
            <label>Giới tính</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <input type="radio" name="gender" value="male" checked={user.gender === 'male'} onChange={handleChange} /> Nam
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <input type="radio" name="gender" value="female" checked={user.gender === 'female'} onChange={handleChange} /> Nữ
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <input type="radio" name="gender" value="other" checked={user.gender === 'other'} onChange={handleChange} /> Khác
              </div>
            </div>
            </div>
          </div>
        </div>

        <div className="input-group">
          <label style={{ marginBottom: '10px' }}>Bio</label>
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '10px' }}>
            <label>Việc làm</label>
            <textarea name="bio.job" value={user.bio.job} onChange={handleChange} placeholder='Chỉnh sửa thông tin việc làm' style={{ height: '100px', padding: '10px' }}/>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '10px' }}>
            <label>Học vấn</label>
            <textarea name="bio.education" value={user.bio.education} onChange={handleChange} placeholder='Chỉnh sửa thông tin học vấn' style={{ height: '100px', padding: '10px' }}/>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '10px' }}>
            <label>Địa chỉ hiện tại</label>
            <textarea name="bio.currentPlaces" value={user.bio.currentPlaces} onChange={handleChange} placeholder='Chỉnh sửa địa chỉ hiện tại' style={{ height: '100px', padding: '10px' }}/>
          </div>
        </div>

        <button type="submit" className="btn-save">Lưu thay đổi</button>
      </form>
    </div>
  );
};

export default EditProfile;