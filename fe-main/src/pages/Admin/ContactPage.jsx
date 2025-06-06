import React, { useEffect, useState } from "react";
import { useContact } from "../../store/contact";
import ContactCard from "../../components/Admin/ContactCard";

const ContactPage = () => {
    const { contacts, listContact } = useContact();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContacts = async () => {
            setLoading(true);
            try {
                await listContact();
            } catch (err) {
                // Có thể show notification nếu muốn
            } finally {
                setLoading(false);
            }
        };
        fetchContacts();
    }, [listContact]);

    return (
        <div className="container mt-4">
            <h2 className="mb-4">
                Danh sách liên hệ / ý kiến người dùng
                <span className="ms-3 fs-5 text-secondary">
                    (Tổng: {contacts ? contacts.length : 0})
                </span>
            </h2>
            {loading ? (
                <div>Đang tải...</div>
            ) : (
                <div>
                    {contacts && contacts.length > 0 ? (
                        contacts.map((contact) => (
                            <ContactCard key={contact._id} contact={contact} />
                        ))
                    ) : (
                        <div>Không có liên hệ nào.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ContactPage;