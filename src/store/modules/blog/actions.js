export default {
    async loadBlogPost(context, postNumber) {
        const blogId = "3352192114497284671";
        const fetchImages = true;

        const response = await fetch(
            `${process.env.VUE_APP_API_BLOG_BASE_URL}/blogs/${blogId}/posts?key=${process.env.VUE_APP_BLOG_API_KEY}&maxResults=${postNumber}&orderBy=published&fetchImages=${fetchImages}`
        );
        const responseData = await response.json();
        if (!response.ok) {
            console.log("Errore nella richiesta");
            throw new Error(responseData.message || 'Failed to fetch!');
        }

        context.commit('setPosts', responseData);
    }
}