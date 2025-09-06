import React, { createContext, useContext, useState, useCallback } from "react";

const ProjectContext = createContext();

const initialState = {
  projectId: null,
  type: "",
  question: "",
  notes: "",
  code: "",
  testcase: [
    {
      id: 1,
      input: "",
      expected: "",
      recieved: "",
    },
  ],
  output: "",
  isLoading: false,
  status: null,
};

export const ProjectProvider = ({ children }) => {
  const [project, setProject] = useState(initialState);

  // ✅ all the equivalent "reducers" as updater functions
  const setProjectId = useCallback((id) => {
    setProject((prev) => ({ ...prev, projectId: id }));
  }, []);

  const setType = useCallback((type) => {
    setProject((prev) => ({ ...prev, type }));
  }, []);

  const setCode = useCallback((code) => {
    setProject((prev) => ({ ...prev, code }));
  }, []);

  const setQuestion = useCallback((question) => {
    setProject((prev) => ({ ...prev, question }));
  }, []);

  const setNotes = useCallback((notes) => {
    setProject((prev) => ({ ...prev, notes }));
  }, []);

  const setOutput = useCallback((output) => {
    setProject((prev) => ({ ...prev, output }));
  }, []);

  const addTest = useCallback((test) => {
    setProject((prev) => ({
      ...prev,
      testcase: [...prev.testcase, test],
    }));
  }, []);

  const updateTest = useCallback(({ id, input, expected }) => {
    setProject((prev) => ({
      ...prev,
      testcase: prev.testcase.map((tc) =>
        tc.id === id
          ? {
              ...tc,
              ...(input !== undefined && { input }),
              ...(expected !== undefined && { expected }),
            }
          : tc
      ),
    }));
  }, []);

  const setStatus = useCallback((status) => {
    setProject((prev) => ({ ...prev, status }));
  }, []);

  const setIsLoading = useCallback((isLoading) => {
    setProject((prev) => ({ ...prev, isLoading }));
  }, []);

  // ⚡ replacement for your Redux setProject reducer
  const overwriteProject = useCallback((newProject) => {
    setProject((prev) => ({ ...prev, ...newProject }));
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        project,
        setProjectId,
        setType,
        setCode,
        setQuestion,
        setNotes,
        setOutput,
        addTest,
        updateTest,
        setStatus,
        setIsLoading,
        overwriteProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

// ✅ custom hook for consuming the context
export const useProject = () => {
  const ctx = useContext(ProjectContext);
  if (!ctx) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return ctx;
};
