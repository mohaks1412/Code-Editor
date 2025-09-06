// appwriteClient.js
import { Client, Storage, ID, Permission, Role } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import conf from "./conf.js";

class StorageService {
  constructor() {
    this.client = new Client()
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId)
      .setKey(conf.appwriteApiKey);

    this.storage = new Storage(this.client);
    this.bucketId = conf.appwriteStorageId;
  }

  async createFile(file) {
    if (!file) throw new Error("❌ No file provided");
    
    const nodeFile = InputFile.fromBuffer(file.buffer, file.originalname);
    
    return this.storage.createFile(
      this.bucketId,
      ID.unique(),
      nodeFile,
      [Permission.read(Role.any())]
    );
  }

  async getFile(fileId) {
    return this.storage.getFile(this.bucketId, fileId);
  }

  async deleteFile(fileId) {
    if (!fileId) throw new Error("❌ No fileId provided for deletion");
    return this.storage.deleteFile(this.bucketId, fileId);
  }
  // 👇 New helper for <audio>/<img>/<video>
  viewFile(fileId) {

    if(!fileId){
      return;
    }
    
    return this.storage.getFileView(this.bucketId, fileId);
  }
}

export default new StorageService();
