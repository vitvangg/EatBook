export const loginUser = async (email, password) => {
  const response = await fetch('/api/log-in', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',  // Gửi cookie cùng request
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Đăng nhập thất bại');
  }

  return response.json();
};
