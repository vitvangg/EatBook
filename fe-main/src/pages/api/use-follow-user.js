export const useFollowUser = () => {
  const followUser = async (userId, userData) => {
    const response = await fetch(`/api/user/follow/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ user: userData })
    })
    const data = await response.json()
    return data
  }

  return { followUser }
}