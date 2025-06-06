// File: src/pages/WritePost.js
import React, { useState, useEffect } from 'react';
import './WritePost.css';
import { useCreatePost } from './api/use-create-post';
import { useNavigate } from 'react-router-dom';

const WritePost = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Viết bài mới - Cookbook';
  }, []);

  // ──────────────────── 1. Các state hiện có ────────────────────
  const [title, setTitle] = useState('');            // Tiêu đề bài viết
  const [bookName, setBookName] = useState('');      // Danh mục/quyển sách
  const [content, setContent] = useState('');        // Nội dung bài viết
  const [images, setImages] = useState([]);          // Ảnh bài viết (có thể nhiều)
  const [bookImage, setBookImage] = useState(null);  // Ảnh bìa sách (1 file)

  // ──────────────────── 2. State Mới: tags (mảng string) ────────────────────
  const [tags, setTags] = useState([]);              // Mảng string chứa các tag đã chọn

  const { createPost } = useCreatePost();

  // ──────────────────── 3. Xử lý upload ảnh ────────────────────
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImages([...images, file]);
  };

  const handleBookImageUpload = (e) => {
    const file = e.target.files[0];
    setBookImage(file);
  };

  // ──────────────────── 4. Hàm Đăng bài (cập nhật thêm tags) ────────────────────
  const handlePost = () => {
    // (A) Có thể kiểm tra validate tags:
    if (tags.length === 0) {
      alert('Bạn phải chọn ít nhất 1 tag');
      return;
    }

    // Gọi createPost kèm tags (array)
    createPost({ title, bookName, content, images, bookImage, tags });
    alert('Đăng bài thành công');
    navigate('/home');
  };

  // ──────────────────── 5. UI ────────────────────
  return (
    <div className="write-post">
      <h2>Viết bài</h2>

      {/* 5.1. Input Tiêu đề */}
      <input
        type="text"
        placeholder="Tiêu đề bài viết"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* 5.2. Input Danh mục/quyển sách */}
      <input
        type="text"
        placeholder="Danh mục/quyển sách"
        value={bookName}
        onChange={(e) => setBookName(e.target.value)}
      />

      {/* 5.3. Textarea Nội dung */}
      <textarea
        placeholder="Nội dung bài viết"
        rows="10"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>

      {/* ───────────── 5.4. Phần Chọn Tag (multiple-select) ───────────── */}
      <div className="tag-select" style={{ marginTop: '1rem' }}>
        <label htmlFor="tagInput" style={{ display: 'block', marginBottom: '0.5rem' }}>
          🔖 Chọn Tag (có thể chọn nhiều):
        </label>
        <select
          id="tagInput"
          multiple
          value={tags}  // tags là array
          onChange={(e) => {
            const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
            setTags(selected);  // Cập nhật mảng tags
          }}
          style={{
            width: '100%',
            height: '120px',
            padding: '0.5rem',
            fontSize: '1rem',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        >
          <option value="Art & Photography">Art & Photography</option>
          <option value="Biographies & Memoirs">Biographies & Memoirs</option>
          <option value="Business & Economics">Business & Economics</option>
          <option value="How-To & Self Help">How-To & Self Help</option>
          <option value="Children's Books">Children's Books</option>
          <option value="Dictionaries">Dictionaries</option>
          <option value="Education & Teaching">Education & Teaching</option>
          <option value="Fiction & Literature">Fiction & Literature</option>
          <option value="Magazines">Magazines</option>
          <option value="Medical & Health">Medical & Health</option>
          <option value="Parenting & Relationships">Parenting & Relationships</option>
          <option value="Reference">Reference</option>
          <option value="Science & Technology">Science & Technology</option>
          <option value="History & Politics">History & Politics</option>
          <option value="Travel & Tourism">Travel & Tourism</option>
          <option value="Cookbooks & Food">Cookbooks & Food</option>
          <option value="Other">Other</option>
        </select>
        <p style={{ fontSize: '0.85rem', color: '#555', marginTop: '0.5rem' }}>
          (Nhấn Ctrl/Cmd và click để chọn nhiều tag)
        </p>
      </div>
      {/* ───────────── Kết thúc 5.4. Chọn Tag ───────────── */}

      {/* 5.5. Upload ảnh bài viết */}


      {/* 5.6. Upload ảnh sách */}
      <div className="image-upload">
        <label htmlFor="fileInput-book">📷 Thêm ảnh sách</label>
        <input
          type="file"
          id="fileInput-book"
          accept="image/*"
          onChange={handleBookImageUpload}
        />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
          {bookImage && (
            <img
              src={URL.createObjectURL(bookImage)}
              alt="Thumbnail"
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
            />
          )}
        </div>
      </div>

      {/* 5.7. Nút Đăng bài */}
      <button onClick={handlePost}>Đăng bài</button>
    </div>
  );
};

export default WritePost;
