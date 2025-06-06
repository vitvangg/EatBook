import React, { useEffect, useState } from "react";
import { useUser } from "../../store/users";
import UserCard from "../../components/Admin/UserCard";
import { useSearchParams, useNavigate } from "react-router-dom";

function UserPage() {
    const { listUsers } = useUser();
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const page = Number(searchParams.get('page')) || 1;
    const limit = 12;

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            setErrorMsg("");
            try {
                const res = await listUsers(page, limit);
                setUsers(res.users || []);
                setPagination({
                    currentPage: res.currentPage || page,
                    totalPages: res.totalPages || 1,
                    totalItems: res.totalItems || (res.users ? res.users.length : 0)
                });
            } catch (err) {
                setErrorMsg("Không thể tải danh sách người dùng.");
            }
            setLoading(false);
        };
        fetchUsers();
    }, [page, listUsers]);

    return (
        <div className="container mt-4">
            {errorMsg && (
                <div className="alert alert-danger text-center">{errorMsg}</div>
            )}
            <h2>Danh sách người dùng</h2>
            {pagination && typeof pagination.totalItems === "number" && (
                <span className="text-muted ms-2" style={{ fontSize: "1rem" }}>
                    (Tổng: {pagination.totalItems})
                </span>
            )}
            <div className="row">
                {loading ? (
                    <div className="col-12 text-center py-5">
                        <div className="spinner-border text-primary" />
                    </div>
                ) : users && users.length > 0 ? (
                    users.map((user) => (
                        <div className="col-md-4 mb-4 mt-2" key={user._id}>
                            <UserCard user={user} />
                        </div>
                    ))
                ) : (
                    <div className="col-12">
                        <p>Không có người dùng nào.</p>
                    </div>
                )}
            </div>
            {pagination && (
                <div className="d-flex justify-content-center mt-4 mb-4">
                    <button
                        className="btn btn-primary mx-1"
                        disabled={pagination.currentPage <= 1}
                        onClick={() => navigate(`/admin/users?page=${pagination.currentPage - 1}`)}
                    >
                        Trang trước
                    </button>
                    <span className="align-self-center mx-2">
                        Trang {pagination.currentPage} / {pagination.totalPages}
                    </span>
                    <button
                        className="btn btn-primary mx-1"
                        disabled={pagination.currentPage >= pagination.totalPages}
                        onClick={() => navigate(`/admin/users?page=${pagination.currentPage + 1}`)}
                    >
                        Trang sau
                    </button>
                </div>
            )}
        </div>
    );
}

export default UserPage;