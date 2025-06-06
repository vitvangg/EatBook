import { create } from "zustand";

export const useUser = create((set) => ({
    user: JSON.parse(localStorage.getItem('user')) || null, // user đăng nhập
    users: [],
    pagination: null,
    detailUser: null, // <-- Thêm dòng này

    setUser: (user) => set({ user }),
    setPagination: (pagination) => set({ pagination }),
    setDetailUser: (detailUser) => set({ detailUser }), //
    login: async (email, password) => {
        const res = await fetch('/api/log-in', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (data.success) {
            const userData = data.userData;
            const userObj = {
                id: userData._id,
                role: userData.role,
                displayName: userData.displayName,
                avatarUrl: userData.avatarUrl,
                email: userData.email,
            };
            set({ user: userObj });
            localStorage.setItem('user', JSON.stringify(userObj)); // Lưu vào localStorage
            return data;
        } else {
            throw new Error(data.message || "Đăng nhập thất bại");
        }
    },
    LogOut: async () => {
        set({ user: null });
        localStorage.removeItem('user'); // Xóa khỏi localStorage khi logout
    },
    listUsers: async (page = 1, limit = 12) => {
        const res = await fetch(`/api/user?page=${page}&limit=${limit}`, {
            credentials: 'include',
        });
        const data = await res.json();
        if (data.success) {
            set({
                users: data.data.users,
                pagination: data.data.pagination
            });
            return {
                users: data.data.users,
                pagination: data.data.pagination
            };
        } else {
            throw new Error(data.message || "Không thể tải danh sách người dùng");
        }
    },
    fetchDetailUser: async (id) => {
        const res = await fetch(`/api/user/${id}`);
        const data = await res.json();
        if (data.success) {
            set({ detailUser: data.data }); // Lưu ý: data.data là user object
            return data.data;
        } else {
            throw new Error(data.message || "Không thể tải thông tin người dùng");
        }
    },
}));