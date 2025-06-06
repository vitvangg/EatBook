export const useGetPosts = () => {
  const getPosts = async () => {
    const response = await fetch(`/api/post`, {
      credentials: 'include',
      mode: 'cors'
    })
    const data = await response.json()
    return data.data.posts
  }

  return { getPosts }
}