import React, { useState } from "react";

const ContactCard = ({ contact }) => {
    const [showFull, setShowFull] = useState(false);

    if (!contact) return null;

    // Hiển thị tối đa 100 ký tự, nếu dài hơn thì cắt
    const shortMessage = contact.message.length > 100
        ? contact.message.slice(0, 100) + "..."
        : contact.message;

    return (
        <div className="card mb-3 shadow-sm">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                        <div>
                            <strong>Người gửi:</strong>{" "}
                            {contact.author?.displayName || "Ẩn danh"}
                        </div>
                        <div>
                            <strong>Email:</strong>{" "}
                            {contact.author?.email || "Ẩn danh"}
                        </div>
                    </div>
                    <small className="text-muted">
                        {new Date(contact.createdAt).toLocaleString("vi-VN")}
                    </small>
                </div>
                <div>
                    <strong>Ý kiến:</strong>{" "}
                    {showFull ? (
                        <span>{contact.message}</span>
                    ) : (
                        <span>{shortMessage}</span>
                    )}
                </div>
                {contact.message.length > 100 && (
                    <button
                        className="btn btn-link p-0 mt-2"
                        onClick={() => setShowFull((v) => !v)}
                    >
                        {showFull ? "Ẩn bớt" : "Xem thêm"}
                    </button>
                )}
            </div>
        </div>
    );
};

export default ContactCard;