import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";

const fileSystemSlice = createSlice({
  name: "fileSystem",
  initialState: {
    tree: [
      { id: "root", name: "root", type: "folder", children: [] }
    ],
    selectedFolderId: "root"
  },
  reducers: {
    selectFolder: (state, action) => {
      state.selectedFolderId = action.payload;
    },
    addFile: (state, action) => {
      const { name } = action.payload;
      const folder = findFolderById(state.tree, state.selectedFolderId);
      if (folder) {
        folder.children.push({
          id: uuid(),
          name,
          type: "file"
        });
      }
    },
    addFolder: (state, action) => {
      const { name } = action.payload;
      const folder = findFolderById(state.tree, state.selectedFolderId);
      if (folder) {
        folder.children.push({
          id: uuid(),
          name,
          type: "folder",
          children: []
        });
      }
    }
  }
});

function findFolderById(tree, id) {
  for (let node of tree) {
    if (node.id === id && node.type === "folder") return node;
    if (node.children) {
      const found = findFolderById(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

export const { selectFolder, addFile, addFolder } = fileSystemSlice.actions;
export default fileSystemSlice.reducer;
