// Fetch blog posts from the server and render them
async function renderBlogPosts() {
    const blogList = document.querySelector(".blog-list");
    blogList.innerHTML = "";
  
    // Fetch blog posts from the API (backend)
    const response = await fetch('/blogs');
    const blogPosts = await response.json();
  
    blogPosts.forEach((blog) => {
      const blogElement = document.createElement("div");
      blogElement.classList.add("blog");
  
      const titleElement = document.createElement("h2");
      titleElement.textContent = blog.title;
  
      const contentElement = document.createElement("p");
      contentElement.textContent = blog.content;
  
      const likeElement = document.createElement("button");
      likeElement.textContent = Like (${blog.likes});
      likeElement.addEventListener("click", () => {
        // Update the like count in the database
        fetch(/blogs/${blog.id}/like, { method: 'POST' })
          .then(() => {
            blog.likes++;
            likeElement.textContent = Like (${blog.likes});
          })
          .catch((error) => {
            console.error('Error liking the post:', error);
          });
      });
  
      const dislikeElement = document.createElement("button");
      dislikeElement.textContent = Dislike (${blog.dislikes});
      dislikeElement.addEventListener("click", () => {
        // Update the dislike count in the database
        fetch(/blogs/${blog.id}/dislike, { method: 'POST' })
          .then(() => {
            blog.dislikes++;
            dislikeElement.textContent = Dislike (${blog.dislikes});
          })
          .catch((error) => {
            console.error('Error disliking the post:', error);
          });
      });
  
      const shareElement = document.createElement("button");
      shareElement.textContent = "Share";
      shareElement.addEventListener("click", () => {
        // Add sharing functionality here
      });
  
      const commentElement = document.createElement("button");
      commentElement.textContent = "Comment";
      commentElement.addEventListener("click", () => {
        // Add commenting functionality here
      });
  
      blogElement.appendChild(titleElement);
      blogElement.appendChild(contentElement);
      blogElement.appendChild(likeElement);
      blogElement.appendChild(dislikeElement);
      blogElement.appendChild(shareElement);
      blogElement.appendChild(commentElement);
  
      blogList.appendChild(blogElement);
    });
  }
  
  // Call the render function to display blog posts
  renderBlogPosts();