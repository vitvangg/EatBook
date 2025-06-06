import { create } from "zustand";

export const useComment = create((set) => ({
    comments: [],
    pagination: null,

    setComments: (comments) => set({ comments }),
    setPagination: (pagination) => set({ pagination }),
    addComment: async (postId, content) => {
        const res = await fetch(`/api/comment/create/${postId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // Để gửi cookie xác thực
            body: JSON.stringify({ content })
        });
        const data = await res.json();
        if (data.success) {
            return data;
        } else {
            throw new Error(data.message || "Không thể thêm bình luận");
        }
    },
    listCommentByPost: async (postId) => {
        const res = await fetch(`/api/comment/${postId}`);
        const data = await res.json();
        if (data.success) {
            return data.data.comments;
        } else {
            throw new Error(data.message || "Không thể tải bình luận");
        }
    },
    listComments: async (postId, page = 1, limit = 12) => {
        const res = await fetch(`/api/comment?postId=${postId}&page=${page}&limit=${limit}`);
        const data = await res.json();

        if (data.success) {
            set({
                comments: data.data.comments,
                pagination: data.data.pagination
            });
            return {
                comments: data.data.comments,
                pagination: data.data.pagination
            };
        } else {
            throw new Error(data.message || "Không thể tải danh sách bình luận");
        }
    },
    deleteComment: async (commentId) => {
        const res = await fetch(`/api/comment/${commentId}`, {
            method: 'DELETE',
            credentials: 'include' // Để gửi cookie xác thực
        });
        const data = await res.json();
        if (data.success) {
            set((state) => ({
                comments: state.comments.filter(comment => comment._id !== commentId),
                pagination: state.pagination
            }));
            return true;
        } else {
            throw new Error(data.message || "Không thể xóa bình luận");
        }
    }
}));