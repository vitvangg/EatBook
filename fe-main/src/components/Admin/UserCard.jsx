import React from 'react';

function UserCard({ user }) {
    return (
        <div className="card h-100 shadow-sm border-0 position-relative">
            {/* Background image */}
            <div style={{
                height: 120,
                background: `url(${user.backgroundUrl}) center/cover no-repeat`,
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12
            }} />
            {/* Avatar */}
            <div
                style={{
                    position: 'absolute',
                    top: 70,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    borderRadius: '50%',
                    border: '3px solid #fff',
                    width: 72,
                    height: 72,
                    background: '#fff',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
                }}
            >
                <img
                    src={user.avatarUrl}
                    alt={user.displayName}
                    width={72}
                    height={72}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
            </div>
            {/* Card body */}
            <div className="card-body d-flex flex-column align-items-center" style={{ marginTop: 40 }}>
                <h5 className="fw-bold mb-1">{user.displayName}</h5>
                <div className="text-muted mb-2" style={{ fontSize: 14 }}>{user.email}</div>
                <div className="d-flex flex-wrap justify-content-center gap-3 mb-2">
                    <div>
                        <span className="fw-bold">{user.followers?.length || 0}</span>
                        <span className="text-muted ms-1">Follower</span>
                    </div>
                    <div>
                        <span className="fw-bold">{user.following?.length || 0}</span>
                        <span className="text-muted ms-1">Following</span>
                    </div>
                    <div>
                        <span className="fw-bold">{user.posts?.length || 0}</span>
                        <span className="text-muted ms-1">Posts</span>
                    </div>
                    <div>
                        <span className="fw-bold">{user.comments?.length || 0}</span>
                        <span className="text-muted ms-1">Comments</span>
                    </div>
                </div>
                {/* Có thể thêm bio hoặc các nút thao tác ở đây nếu muốn */}
            </div>
        </div>
    );
}

export default UserCard;