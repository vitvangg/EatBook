import React, { useEffect, useState } from "react";
import PostCard from "../../components/Admin/PostCard";
import { usePost } from "../../store/posts";
import { useSearchParams, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

function PostPage() {
    const { listPosts, posts, pagination } = usePost();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const page = Number(searchParams.get('page')) || 1;
    const [errorMsg, setErrorMsg] = useState("");
    const [reload, setReload] = useState(false);

    useEffect(() => {
        listPosts(page);
    }, [listPosts, page]);

    // Scroll lên đầu trang khi có lỗi hệ thống
    useEffect(() => {
        if (errorMsg) {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [errorMsg]);

    useEffect(() => {
        listPosts(page);
    }, [reload, listPosts, page]);

    // Khi xóa thành công/thất bại, chỉ cần reload lại danh sách
    const handleDeleteSuccess = () => {
        setReload(r => !r);
    };
    const handleDeleteError = () => { };

    return (
        <div className="container mt-4">
            {/* Hiển thị lỗi hệ thống nếu có */}
            {errorMsg && (
                <div className="alert alert-danger alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3" style={{ zIndex: 2000, minWidth: 300, maxWidth: 500 }} role="alert">
                    {errorMsg}
                    <button type="button" className="btn-close" onClick={() => setErrorMsg("")}></button>
                </div>
            )}
            <h2>Danh sách bài viết</h2>
            {pagination && typeof pagination.totalItems === "number" && (
                <span className="text-muted ms-2" style={{ fontSize: "1rem" }}>
                    (Tổng: {pagination.totalItems})
                </span>
            )}
            <div className="row">
                {posts && posts.length > 0 ? (
                    posts.map((post) => (
                        <div className="col-md-4 mb-4 mt-2" key={post._id || post.id}>
                            <PostCard
                                post={post}
                                pagination={pagination}
                                onSuccess={handleDeleteSuccess}
                                onError={handleDeleteError}
                            />
                        </div>
                    ))
                ) : (
                    <div className="col-12">
                        <p>Không có bài viết nào.</p>
                    </div>
                )}
            </div>
            {/* Phân trang đơn giản */}
            {pagination && (
                <div className="d-flex justify-content-center mt-4 mb-4">
                    <button
                        className="btn btn-primary mx-1"
                        disabled={!pagination.hasPreviousPage || !pagination.currentPage}
                        onClick={() => navigate(`/admin/posts?page=${pagination.currentPage - 1}`)}
                    >
                        Trang trước
                    </button>
                    <span className="align-self-center mx-2">
                        Trang {pagination.currentPage || 1} / {pagination.totalPages}
                    </span>
                    <button
                        className="btn btn-primary mx-1"
                        disabled={!pagination.hasNextPage || !pagination.currentPage}
                        onClick={() => navigate(`/admin/posts?page=${pagination.currentPage + 1}`)}
                    >
                        Trang sau
                    </button>
                </div>
            )}
        </div>
    );
}

export default PostPage;