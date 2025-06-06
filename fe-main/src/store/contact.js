import { create } from 'zustand';

export const useContact = create((set) => ({
    contacts: [],
    setContacts: (contacts) => set({ contacts }),

    // Lấy danh sách contact
    listContact: async () => {
        const res = await fetch('/api/contact/list', {
            method: 'GET',
            credentials: 'include'
        });
        const data = await res.json();
        console.log('Contact list API response:', data);
        if (data.success) {
            // Sửa lại dòng này:
            set({ contacts: data.data }); // <-- dùng data.data thay vì data.contacts
            return data.data;
        } else {
            throw new Error(data.message || "Không lấy được danh sách liên hệ");
        }
    },

}));