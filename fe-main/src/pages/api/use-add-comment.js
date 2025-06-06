export const useAddComment = () => {
  const addComment = async (postId, comment) => {
    const response = await fetch(`/api/comment/create/${postId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ content: comment.content })
    })
    const data = await response.json()
    return data
  }

  return { addComment }
}