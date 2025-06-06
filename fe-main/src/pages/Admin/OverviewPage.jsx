import React, { useEffect, useState } from "react";
import { useView } from "../../store/view";
import { useUser } from "../../store/users";
import { usePost } from "../../store/posts";
import { useComment } from "../../store/comments";

function OverviewPage() {
    const [totalViews, setTotalViews] = useState(0);
    const { users, pagination: userPagination, listUsers } = useUser();
    const { posts, pagination: postPagination, listPosts } = usePost();
    const { comments, pagination: commentPagination, listComments } = useComment();

    useEffect(() => {
        // Lấy tổng số view
        const fetchViews = async () => {
            const views = await useView.getState().setCurrentPage("overview");
            setTotalViews(views || 0);
        };
        fetchViews();

        // Lấy tổng số user, post, comment
        listUsers(1, 1);
        listPosts(1, 1);
        listComments(undefined, 1, 1);
    }, [listUsers, listPosts, listComments]);

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Tổng quan hệ thống</h2>
            <div className="row">
                <div className="col-md-3 mb-3">
                    <div className="card shadow-sm text-center">
                        <div className="card-body">
                            <h5 className="card-title">Tổng lượt xem</h5>
                            <p className="display-5 fw-bold">{totalViews}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card shadow-sm text-center">
                        <div className="card-body">
                            <h5 className="card-title">Tổng số người dùng</h5>
                            <p className="display-5 fw-bold">{userPagination?.totalItems || users?.length || 0}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card shadow-sm text-center">
                        <div className="card-body">
                            <h5 className="card-title">Tổng số bài viết</h5>
                            <p className="display-5 fw-bold">{postPagination?.totalItems || posts?.length || 0}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card shadow-sm text-center">
                        <div className="card-body">
                            <h5 className="card-title">Tổng số bình luận</h5>
                            <p className="display-5 fw-bold">{commentPagination?.totalItems || comments?.length || 0}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OverviewPage;