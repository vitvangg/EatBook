import { Search, Bell, Edit, User } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import React, { useRef, useState, useEffect } from 'react';
import { useUser } from '../../store/users';
import { useNotification } from '../../contexts/NotificationContext';

const adminMenu = [
    { label: "Overview", path: "/admin/overview" },
    { label: "Users", path: "/admin/users" },
    { label: "Posts", path: "/admin/posts" },
    { label: "Comments", path: "/admin/comments" },
    { label: "Contact", path: "/admin/contact" }, // Thêm dòng này
];

const AdminHeader = () => {
    const location = useLocation();
    const { user, LogOut } = useUser();
    const [showMenu, setShowMenu] = useState(false);
    const [avatarError, setAvatarError] = useState(false);
    const menuRef = useRef();
    const { showNotification } = useNotification();
    const navigate = useNavigate();

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        await LogOut();
        showNotification("Đã đăng xuất!", "info");
        navigate('/login');
    };

    const handleAvatarError = () => {
        setAvatarError(true);
    };

    return (
        <>
            <link
                href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
                rel="stylesheet"
            />

            <header className="bg-white shadow-sm border-bottom">
                {/* Main Header */}
                <div className="container-fluid">
                    <nav className="navbar py-3">
                        <div className="navbar-brand d-flex align-items-center">
                            <div
                                className="d-flex align-items-center justify-content-center me-2"
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    backgroundColor: '#0d6efd',
                                    borderRadius: '8px'
                                }}
                            >
                                <span className="text-white fw-bold">A</span>
                            </div>
                            <span className="fs-4 fw-bold text-dark">Admin Panel</span>
                        </div>

                        <div className="d-flex align-items-stretch position-relative" style={{ height: '40px' }}>
                            <button
                                className="btn btn-outline-secondary h-100 d-flex align-items-center justify-content-center"
                                style={{ width: '40px' }}
                                onClick={() => setShowMenu((v) => !v)}
                            >
                                <User size={18} />
                            </button>
                            {showMenu && (
                                <div
                                    ref={menuRef}
                                    className="position-absolute end-0 top-100"
                                    style={{
                                        minWidth: 220,
                                        background: 'white',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: 8,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                                        zIndex: 1000,
                                        padding: 16
                                    }}
                                >
                                    <div className="d-flex align-items-center mb-3">
                                        {user && (
                                            <img
                                                src={user?.avatarUrl || 'https://avatars.githubusercontent.com/u/583231?v=4'}
                                                alt="User Avatar"
                                                className="rounded-circle me-2"
                                                width={40}
                                                height={40}
                                                onError={handleAvatarError}
                                                style={{
                                                    objectFit: 'cover',
                                                    border: '1px solid #e5e7eb'
                                                }}
                                            />
                                        )}
                                        <div>
                                            <div className="fw-bold">{user?.displayName || 'Admin'}</div>
                                            <div className="text-muted" style={{ fontSize: 13 }}>
                                                {user?.email || 'admin@example.com'}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        className="btn btn-danger w-100"
                                        onClick={handleLogout}
                                    >
                                        Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>
                    </nav>
                </div>

                {/* Admin Menu */}
                <div className="bg-light border-top">
                    <div className="container-fluid">
                        <div className="d-flex py-3 overflow-auto">
                            {adminMenu.map(({ label, path }) => (
                                <Link key={label} to={path} className="text-decoration-none">
                                    <button
                                        className={`btn me-2 text-nowrap ${location.pathname === path
                                            ? 'btn-primary'
                                            : 'btn-outline-secondary'
                                            }`}
                                    >
                                        {label}
                                    </button>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};

export default AdminHeader;