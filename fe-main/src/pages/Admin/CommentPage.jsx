import React, { useEffect, useState } from "react";
import { useComment } from "../../store/comments";
import CommentCard from "../../components/Admin/CommentCard";
import { useNotification } from "../../contexts/NotificationContext";
import { useNavigate } from "react-router-dom";

function CommentPage() {
    const { listComments, pagination } = useComment();
    const { showNotification } = useNotification ? useNotification() : { showNotification: (msg, type) => alert(msg) };
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [page, setPage] = useState(1);
    const limit = 10;
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        setErrorMsg("");
        listComments(undefined, page, limit)
            .then((res) => setComments(res.comments))
            .catch(() => {
                setComments([]);
                setErrorMsg("Không thể tải danh sách bình luận.");
            })
            .finally(() => setLoading(false));
    }, [page, listComments]);

    return (
        <div className="container mt-4">
            {errorMsg && (
                <div className="alert alert-danger text-center">{errorMsg}</div>
            )}
            <h2>Danh sách bình luận</h2>
            {pagination && typeof pagination.totalItems === "number" && (
                <span className="text-muted ms-2" style={{ fontSize: "1rem" }}>
                    (Tổng: {pagination.totalItems})
                </span>
            )}
            <div className="row mt-2">
                {loading ? (
                    <div className="col-12 text-center py-5">
                        <div className="spinner-border text-primary" />
                    </div>
                ) : comments && comments.length > 0 ? (
                    comments.map((comment) => (
                        <div className="col-12 mb-3" key={comment._id}>
                            <CommentCard
                                comment={comment}
                                onDeleted={id => setComments(prev => prev.filter(c => c._id !== id))}
                            />
                        </div>
                    ))
                ) : (
                    <div className="col-12">
                        <p>Không có bình luận nào.</p>
                    </div>
                )}
            </div>
            {pagination && (
                <div className="d-flex justify-content-center mt-4 mb-4">
                    <button
                        className="btn btn-primary mx-1"
                        disabled={pagination.currentPage <= 1}
                        onClick={() => navigate(`/admin/comments?page=${pagination.currentPage - 1}`)}
                    >
                        Trang trước
                    </button>
                    <span className="align-self-center mx-2">
                        Trang {pagination.currentPage} / {pagination.totalPages}
                    </span>
                    <button
                        className="btn btn-primary mx-1"
                        disabled={pagination.currentPage >= pagination.totalPages}
                        onClick={() => navigate(`/admin/comments?page=${pagination.currentPage + 1}`)}
                    >
                        Trang sau
                    </button>
                </div>
            )}
        </div>
    );
}

export default CommentPage;