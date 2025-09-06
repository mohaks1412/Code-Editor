import dotenv from "dotenv";
dotenv.config();

const conf = {
    appwriteUrl: String(process.env.APPWRITE_URL),
    appwriteProjectId: String(process.env.APPWRITE_PROJECT_ID),
    appwriteStorageId: String(process.env.APPWRITE_STORAGE_ID),
    appwriteApiKey: String(process.env.APPWRITE_API_KEY)
}



export default conf