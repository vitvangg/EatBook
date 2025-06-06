export const useUpdateUser = () => {
  const updateUser = async (userData) => {
    const formData = new FormData()
    if (userData.bio.job) 
        formData.append('bio.job', userData.bio.job);
    if (userData.bio.education)
        formData.append('bio.education', userData.bio.education);
    if (userData.bio.currentPlaces && userData.bio.currentPlaces.length > 0) 
        formData.append('bio.currentPlaces', userData.bio.currentPlaces.join(','));
    if (userData.dateOfBirth)
        formData.append('dateOfBirth', userData.dateOfBirth);
    if (userData.gender)
        formData.append('gender', userData.gender);
    if (userData.displayName)
        formData.append('displayName', userData.displayName);
    if (userData.email)
        formData.append('email', userData.email);
    if (userData.avatarUrl)
        formData.append('avatarUrl', userData.avatarUrl);
    if (userData.backgroundUrl)
        formData.append('backgroundUrl', userData.backgroundUrl);

    const response = await fetch(`/api/user/update`, {
      method: 'PATCH',
      body: formData,
    })
    const data = await response.json()
    return data
  }

  return { updateUser }
}