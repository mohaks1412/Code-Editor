import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  projectId: null,
  type: "",
  files: [],  // Array of file objects (filename, language, code, question, output, testcase, media)
  activeFileIndex: 0,  // Index of the currently active file
  isLoading: false,
  status: null,
};

const codeSlice = createSlice({
  name: "code",
  initialState,
  reducers: {
    setProjectId: (state, action) => {
      state.projectId = action.payload;1
    },

    setType: (state, action) => {
      state.type = action.payload;
    },

    setNotes: (state, action) => {
      state.notes = action.payload;
    },

    setFiles: (state, action) => {
      state.files = action.payload;
      // Reset active file index when files change
      state.activeFileIndex = 0;
      
    },

    addFile: (state, action) => {
      state.files.push(action.payload);
      // Optionally set the new file as active
      state.activeFileIndex = state.files.length - 1;
    },

    updateFile: (state, action) => {
      const { index, changes } = action.payload;
      
      if (state.files[index] && changes) {
        state.files[index] = { ...state.files[index], ...changes };
      }
    },

    setActiveFileIndex: (state, action) => {
      state.activeFileIndex = action.payload;
    },

    setCode: (state, action) => {

      console.log(payload);
      
      if (state.files[state.activeFileIndex]) {
        state.files[state.activeFileIndex].code = action.payload;
      }
    },

    setOutput: (state, action) => {
      if (state.files[state.activeFileIndex]) {
        state.files[state.activeFileIndex].output = action.payload;
      }
    },

    setTestCase: (state, action) => {
      if (state.files[state.activeFileIndex]) {
        state.files[state.activeFileIndex].testcase = action.payload;
      }
    },

    setQuestion: (state, action) => {
      if(state.files[state.activeFileIndex]){
        state.files[state.activeFileIndex] = action.payload;
      }
    },

    setStatus: (state, action) => {
      state.status = action.payload;
    },

    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },


    setProject: (state, action) => {
      const p = action.payload;

      state.name = p.name ?? state.name;
      state.projectId = p._id ?? p.projectId ?? state.projectId;
      state.type = p.type ?? state.type;
      state.files = p.files ?? state.files;  // files contain question, notes per file now
      state.status = p.status ?? state.status;
      

      // Reset activeFileIndex only if project changed
      if (state.projectId !== (p._id || p.projectId)) {
        state.activeFileIndex = 0;
      }
    },
    updateFileById: (state, action) => {
      const { fileId, changes } = action.payload;
      
      const file = state.files.find((f) => f._id === fileId);
      if (file) Object.assign(file, changes);
    },
    
    clearProjects: (state) =>{
      state.name = ""
      state.projectId = null
      state.type = ""
      state.files = []  // Array of file objects (filename, language, code, question, output, testcase, media)
      state.activeFileIndex = 0  // Index of the currently active file
      state.isLoading = false
      state.status = null
    }
  },
});

export const {
  setProject,
  setProjectId,
  setNotes,
  setFiles,
  addFile,
  updateFile,
  setActiveFileIndex,
  setCode,
  setOutput,
  setTestCase,
  setQuestion,
  setType,
  setStatus,
  setIsLoading,
  updateFileById,
  clearProjects
} = codeSlice.actions;

export default codeSlice.reducer;
