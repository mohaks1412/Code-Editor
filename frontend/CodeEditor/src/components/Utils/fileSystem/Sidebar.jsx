import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setActiveFileIndex,
  setFiles,
} from "../../../store/codeSlice";
import axios from "axios";
import Input from "../../Input"; // adjust path if needed
import "./Sidebar.css";

const Sidebar = () => {
  const dispatch = useDispatch();
  const files = useSelector((state) => state.code.files);
  const activeFileIndex = useSelector((state) => state.code.activeFileIndex);
  const projectId = useSelector((state) => state.code.projectId);

  // State to hold the new filename input
  const [newFilename, setNewFilename] = useState("");

  // Ref to the input field for focus
  const inputRef = useRef(null);

  // Handler to set active file on click
  const handleSelectFile = (index) => {
    
    dispatch(setActiveFileIndex(index));
  };

  // Handler to add new file
  const handleAddFile = async () => {
    // Prevent empty filename creation
    if (!newFilename.trim()) {
      alert("Please enter a filename");
      if (inputRef.current) inputRef.current.focus();
      return;
    }

    try {
      const newFilePayload = {
        filename: newFilename.trim(),
        language: "javascript",
        code: "",
        output: "",
        testcase: [],
        media: [],
      };

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/projects/files/add/${projectId}`,
        newFilePayload,
        { withCredentials: true }
      );

      const newFile = res.data;
      console.log(newFile);
      
      const updatedFiles = [...files, newFile];

      dispatch(setFiles(updatedFiles));
      dispatch(setActiveFileIndex(updatedFiles.length - 1));

      // Clear input after successful addition
      setNewFilename("");
    } catch (error) {
      console.error("Failed to add new file:", error);
    }
  };

const handleDeleteFile = async (fileId, index) => {
  try {
    await axios.delete(
      `${import.meta.env.VITE_API_URL}/projects/files/delete/${projectId}/${fileId}`,
      { withCredentials: true }
    );

    // Remove deleted file from local files array
    const updatedFiles = files.filter(file => file._id !== fileId);

    dispatch(setFiles(updatedFiles));

    // Adjust activeFileIndex accordingly
    if (activeFileIndex >= updatedFiles.length) {
      dispatch(setActiveFileIndex(updatedFiles.length - 1));
    } else if (index < activeFileIndex) {
      dispatch(setActiveFileIndex(activeFileIndex - 1));
    }
  } catch (error) {
    console.error("Failed to delete file:", error);
  }
};

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Files</h2>
      </div>
      <div className="add-file-container">
  <Input
    label="New filename"
    type="text"
    value={newFilename}
    onChange={(e) => setNewFilename(e.target.value)}
    ref={inputRef}
    placeholder="Enter filename"
    style={{
      fontSize: "0.95rem",
      flex: 1, // let input take available space
      borderRadius: "6px",
      border: "1.5px solid #3d3d3d",
      background: "#191919",
      color: "#eee",
      padding: "7px 10px",
      outline: "none",
      transition: "border 0.2s, background 0.2s",
    }}
  />
  <button
    onClick={handleAddFile}
    className="add-file-button"
    title="Add New File"
  >
    +
  </button>
</div>

      <ul className="sidebar-list">
        {files.map((file, index) => (
          <li
            key={file._id}
            className={`sidebar-item ${activeFileIndex === index ? "active" : ""}`}
          >
            <span
              className="file-name"
              onClick={() => handleSelectFile(index)}
              title={file.filename}
            >
              {file.filename}
            </span>
            <button
              className="delete-file-button"
              onClick={() => handleDeleteFile(file._id, index)}
              title="Delete File"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
