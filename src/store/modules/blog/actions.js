export default {
    async loadBlogPost(context, postNumber) {
        const apiKey = "AIzaSyBtWN-ncyuf_mLjJLBPzlIrP2sfSUVbxLM";
        const blogId = "3352192114497284671";
        const fetchImages = true;

        const response = await fetch(
            `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?key=${apiKey}&maxResults=${postNumber}&orderBy=published&fetchImages=${fetchImages}`
        );
        const responseData = await response.json();
        if (!response.ok) {
            console.log("Errore nella richiesta");
            throw new Error(responseData.message || 'Failed to fetch!');
        }

        context.commit('setPosts', responseData);
    }
}