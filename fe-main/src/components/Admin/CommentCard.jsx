import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useComment } from "../../store/comments";
import { useNotification } from "../../contexts/NotificationContext";

const CommentCard = ({ comment, onDeleted }) => {
    const [showFull, setShowFull] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const { deleteComment } = useComment();
    const { showNotification } = useNotification ? useNotification() : { showNotification: (msg, type) => alert(msg) };

    if (!comment) return null;

    const author = comment.author || {};
    const post = comment.post || {};
    const postAuthor = post.author || {};

    const contentPreview =
        comment.content && comment.content.length > 120 && !showFull
            ? comment.content.slice(0, 120) + "..."
            : comment.content;

    const handleDelete = async () => {
        try {
            await deleteComment(comment._id);
            setShowConfirm(false);
            showNotification("Đã xóa bình luận!", "success");
            if (onDeleted) onDeleted(comment._id);
        } catch {
            showNotification("Xóa bình luận thất bại!", "error");
        }
    };

    return (
        <div className="card mb-3 shadow-sm position-relative">
            <div className="card-body">
                {/* Nút xóa */}
                <button
                    className="btn btn-outline-danger btn-sm position-absolute"
                    style={{ top: 10, right: 10, zIndex: 2 }}
                    title="Xóa bình luận"
                    onClick={() => setShowConfirm(true)}
                >
                    <FaTrash />
                </button>

                {/* Tác giả bình luận */}
                <div className="d-flex align-items-center mb-2">
                    <img
                        src={author.avatarUrl || "https://via.placeholder.com/32"}
                        alt={author.displayName || "User"}
                        className="rounded-circle me-2"
                        width={32}
                        height={32}
                    />
                    <div>
                        <div className="fw-bold">{author.displayName || "User"}</div>
                        <div className="text-muted" style={{ fontSize: "0.95em" }}>
                            {new Date(comment.createdAt).toLocaleString("vi-VN")}
                        </div>
                    </div>
                </div>

                {/* Nội dung bình luận */}
                <div style={{ whiteSpace: "pre-line" }}>
                    {contentPreview}
                    {comment.content && comment.content.length > 120 && (
                        <button
                            className="btn btn-link btn-sm p-0 ms-1"
                            style={{ fontSize: "0.95em" }}
                            onClick={() => setShowFull((v) => !v)}
                        >
                            {showFull ? "Ẩn bớt" : "Xem thêm"}
                        </button>
                    )}
                </div>

                {/* Thông tin bài viết */}
                {post && (
                    <div className="mt-3 p-2 rounded" style={{ background: "#f8f9fa" }}>
                        <div className="fw-bold mb-1">
                            Bài viết: {post.title || "Không rõ tiêu đề"}
                        </div>
                        <div>
                            <span className="me-2">
                                <strong>Cuốn sách:</strong> {post.bookName || "Không rõ"}
                            </span>
                            <span>
                                <strong>Tác giả:</strong> {postAuthor.displayName || "Không rõ"}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Bootstrap Modal xác nhận xóa */}
            {showConfirm && (
                <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.2)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Xác nhận xóa</h5>
                                <button type="button" className="btn-close" onClick={() => setShowConfirm(false)}></button>
                            </div>
                            <div className="modal-body">
                                Bạn có chắc chắn muốn xóa bình luận cho bài viết "<strong>{post.title}</strong>"?
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary btn-sm" onClick={() => setShowConfirm(false)}>
                                    Hủy
                                </button>
                                <button className="btn btn-danger btn-sm" onClick={handleDelete}>
                                    Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommentCard;