import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePost } from '../../store/posts';
import { useNotification } from '../../contexts/NotificationContext';

const TAG_OPTIONS = [
    "Art & Photography",
    "Biographies & Memoirs",
    "Business & Economics",
    "How-To & Self Help",
    "Children's Books",
    "Dictionaries",
    "Education & Teaching",
    "Fiction & Literature",
    "Magazines",
    "Medical & Health",
    "Parenting & Relationships",
    "Reference",
    "Science & Technology",
    "History & Politics",
    "Travel & Tourism",
    "Cookbooks & Food",
    "Other"
];

const UpdatePostCard = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { detailPost, updatePost } = usePost();
    const { showNotification } = useNotification ? useNotification() : { showNotification: (msg) => alert(msg) };

    const [form, setForm] = useState({
        title: '',
        content: '',
        bookName: '',
        tags: [],
    });
    const [loading, setLoading] = useState(false);
    const [initLoading, setInitLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            setInitLoading(true);
            try {
                const post = await detailPost(id);
                console.log('Post detail:', post); // Thêm dòng này
                setForm({
                    title: post.title || '',
                    content: post.content || '',
                    bookName: post.bookName || '',
                    tags: post.tags || [],
                });
            } catch (err) {
                console.error('Fetch post error:', err); // Thêm dòng này
                showNotification('Không tìm thấy bài viết!', 'error');
                navigate('/admin/posts');
            } finally {
                setInitLoading(false);
            }
        };
        fetchPost();
    }, [id, detailPost, navigate, showNotification]);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Xử lý thêm tag
    const handleAddTag = (e) => {
        const value = e.target.value;
        if (value && !form.tags.includes(value)) {
            setForm({ ...form, tags: [...form.tags, value] });
        }
    };

    // Xử lý xóa tag
    const handleRemoveTag = (tag) => {
        setForm({ ...form, tags: form.tags.filter(t => t !== tag) });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            await updatePost(id, {
                title: form.title,
                content: form.content,
                bookName: form.bookName,
                tags: form.tags,
            });
            showNotification('Cập nhật bài viết thành công!', 'success');
            navigate('/admin/posts');
        } catch (err) {
            console.error('Update error:', err); // Thêm dòng này để xem lỗi
            showNotification(err.message || 'Cập nhật thất bại!', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (initLoading) {
        return <div className="container mt-4">Đang tải dữ liệu bài viết...</div>;
    }

    return (
        <div className="container mt-4">
            <div className="mb-3">
                <button className="btn btn-secondary" onClick={() => navigate('/admin/posts')}>
                    ← Quay lại danh sách bài viết
                </button>
            </div>
            <h2 className="mb-4">Cập nhật bài viết</h2>
            <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
                <div className="mb-3">
                    <label className="form-label">Tiêu đề</label>
                    <input
                        type="text"
                        className="form-control"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Nội dung</label>
                    <textarea
                        className="form-control"
                        name="content"
                        rows={8}
                        value={form.content}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Tên sách</label>
                    <input
                        type="text"
                        className="form-control"
                        name="bookName"
                        value={form.bookName}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Tags</label>
                    <div className="mb-2">
                        {form.tags.map(tag => (
                            <span key={tag} className="badge bg-primary me-2 mb-1">
                                {tag}
                                <button
                                    type="button"
                                    className="btn-close btn-close-white btn-sm ms-2"
                                    aria-label="Remove"
                                    style={{ fontSize: 8, verticalAlign: 'middle' }}
                                    onClick={() => handleRemoveTag(tag)}
                                />
                            </span>
                        ))}
                    </div>
                    <select
                        className="form-select"
                        value=""
                        onChange={handleAddTag}
                    >
                        <option value="">Chọn tag để thêm...</option>
                        {TAG_OPTIONS.filter(tag => !form.tags.includes(tag)).map(tag => (
                            <option key={tag} value={tag}>{tag}</option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Đang cập nhật...' : 'Cập nhật'}
                </button>
            </form>
        </div>
    );
};

export default UpdatePostCard;