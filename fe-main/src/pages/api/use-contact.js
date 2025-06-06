export const sendMessage = async (message) => {
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw errorData;
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};