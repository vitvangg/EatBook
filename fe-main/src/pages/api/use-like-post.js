export const useLikePost = () => {
  const likePost = async (postId) => {
    const response = await fetch(`/api/post/like/${postId}`, {
      method: 'PUT',
      credentials: 'include',
      mode: 'cors'
    })
    const data = await response.json()
    return data
  }

  return { likePost }
}