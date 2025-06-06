import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [message, setMessage] = useState('');
    const [type, setType] = useState('info');

    const showNotification = (msg, type = 'info') => {
        setMessage(msg);
        setType(type);
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            {message && (
                <div style={{
                    position: 'fixed',
                    top: 24,
                    right: 24,
                    zIndex: 9999,
                    minWidth: 240
                }}>
                    <div className={`alert alert-${type} shadow`}>
                        {message}
                    </div>
                </div>
            )}
        </NotificationContext.Provider>
    );
};