export const useCreatePost = () => {
    const createPost = async (post) => {
        const formData = new FormData();
        formData.append('title', post.title);
        formData.append('bookName', post.bookName);
        formData.append('content', post.content);
    
        if (post.images && Array.isArray(post.images)) {
          post.images.forEach(image => {
            formData.append('images', image); 
          });
        }
    
        if (post.bookImage) {
          formData.append('bookImage', post.bookImage);
        }
    
        if (post.tags) {
          if (Array.isArray(post.tags)) {
            post.tags.forEach(tag => formData.append('tags', tag));
          } else {
            formData.append('tags', post.tags);
          }
        }
    
        const response = await fetch('/api/create', {
          method: 'POST',
          body: formData,
          credentials: 'include' 
        });
    
        const data = await response.json();
        return data;
      };
    
      return { createPost };
    };