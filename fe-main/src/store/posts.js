import { create } from "zustand";


export const usePost = create((set) => ({

    posts: [],

    pagination: null,

    setPosts: (posts) => set({ posts }),

    setPagination: (pagination) => set({ pagination }),
    listPosts: async (page = 1, limit = 12) => {
        const res = await fetch(`/api/post?page=${page}&limit=${limit}`);
        const data = await res.json();

        if (data.success) {
            set({
                posts: data.data.posts,
                pagination: data.data.pagination
            });
        }
    },
    detailPost: async (id) => {
        const res = await fetch(`/api/post/${id}`);
        const data = await res.json();
        if (data.success) {
            return data.post;
        } else {
            throw new Error(data.message || "Failed to fetch post details");
        }
    },
    deletePost: async (id) => {
        const res = await fetch(`/api/post/delete/${id}`, {
            method: 'DELETE'
        });
        const data = await res.json();
        if (data.success) {
            set((state) => ({
                posts: state.posts.filter(post => post._id !== id),
                pagination: state.pagination
            }));
            return true;
        } else {
            throw new Error(data.message || "Failed to delete post");
        }
    },
    // Thay đổi hàm updatePost trong store
    updatePost: async (id, postData) => {
        // Tạo FormData thay vì JSON
        const formData = new FormData();
        formData.append('title', postData.title);
        formData.append('content', postData.content);
        formData.append('bookName', postData.bookName);

        // Xử lý tags - chuyển array thành string
        if (postData.tags && postData.tags.length > 0) {
            formData.append('tags', postData.tags.join(','));
        }

        const res = await fetch(`/api/post/update/${id}`, {
            method: 'PATCH',
            // Bỏ Content-Type header để browser tự set cho FormData
            body: formData,
            credentials: 'include'
        });

        const data = await res.json();
        if (data.success) {
            set((state) => ({
                posts: state.posts.map(post => post._id === id ? data.data : post),
                pagination: state.pagination
            }));
            return data.data;
        } else {
            throw new Error(data.message || "Failed to update post");
        }
    },
    createPost: async (postData) => {
        let res, data;
        if (postData instanceof FormData) {
            res = await fetch('/api/create', {
                method: 'POST',
                body: postData
            });
        } else {
            // Nếu là object thường (không có file), gửi dạng JSON
            res = await fetch('/api/post/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            });
        }
        data = await res.json();
        if (data.success) {
            set((state) => ({
                posts: [data.post, ...state.posts],
                pagination: state.pagination
            }));
            return data.post;
        } else {
            throw new Error(data.message || "Failed to create post");
        }
    },
    likePost: async (postId) => {
        const res = await fetch(`/api/post/like/${postId}`, {
            method: 'PUT',
            credentials: 'include'
        });
        const data = await res.json();
        if (data.success) {
            return data.message;
        } else {
            throw new Error(data.message || "Failed to like post");
        }
    },
}))