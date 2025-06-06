export const useGetUser = () => {
  const getUser = async (id) => {
    const response = await fetch(`/api/user/${id}`, {
      method: 'GET'
    })
    const data = await response.json()
    return data
  }

  return { getUser }
}