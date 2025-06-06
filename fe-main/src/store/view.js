import { create } from "zustand";

export const useView = create((set, get) => ({
    currentPage: null,

    setCurrentPage: async (page) => {
        set({ currentPage: page }); // luôn set lại
        try {
            const res = await fetch("/api/views/count");
            const data = await res.json();
            console.log(`Lượt xem: ${data.totalViews}`);
            return data.totalViews;
        } catch (error) {
            console.error("Lỗi khi gửi view:", error);
        }
    },
}));
