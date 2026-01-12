// 💡 Logic: If we are on your laptop (localhost), use localhost.
// If we are online, use the Render URL.
const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3000' 
  : 'https://my-awesome-store.onrender.com'; 

export default API_BASE_URL;