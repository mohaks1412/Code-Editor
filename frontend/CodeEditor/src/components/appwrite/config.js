const conf = {
    appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
    appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteStorageId: String(import.meta.env.VITE_APPWRITE_STORAGE_ID),
    appwriteApiKey: String(import.meta.env.VITE_APPWRITE_API_KEY)
}



export default conf