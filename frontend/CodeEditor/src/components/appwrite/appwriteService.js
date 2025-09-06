import { Client, Storage } from "appwrite";
import conf from './config'

const client = new Client()
  .setEndpoint(conf.appwriteUrl) // frontend endpoint
  .setProject(conf.appwriteProjectId);

export const storageService = new Storage(client);

export function viewFile(fileId) {

  if(!fileId){
    return;
  }
  const bucketId = import.meta.env.VITE_APPWRITE_STORAGE_ID;
  return storageService.getFileView(bucketId, fileId);
}
