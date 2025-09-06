import React, { useState } from 'react';
import Button from './Button';
import Input from './Input';
import { useNavigate } from 'react-router-dom';
import './NewProject.css';
import axios from 'axios';
import { useDispatch } from 'react-redux';

import {
  setType,
  setQuestion,
  setNotes,
  setCode,
  setOutput,
  setProject,
  setProjectId,
} from "../store/codeSlice";

const categories = [
  { title: 'DSA', slug: 'dsa', description: 'Solve coding problems and practice algorithms', type: 'dsa', buttonContent: "Master Algorithms!", defaultLanguage: "javascript" },
  { title: 'Development', slug: 'dev', description: 'Build and manage your dev projects', type: 'dev', buttonContent: "Build Project" },
  { title: 'College Assignments', slug: 'assignment', description: 'Keep track of your coursework and submissions', type: 'college', buttonContent: "Complete Assignments" },
];

const NewProject = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [projectName, setProjectName] = useState('');
  const [error, setError] = useState(null); // State for error message

  const handleChoice = async (slug) => {
    setError(null); // Clear any previous errors

    if (!projectName.trim()) {
      setError("Please enter a project name first");
      return;
    }

    const selectedCategory = categories.find(cat => cat.slug === slug);
    const language = selectedCategory?.defaultLanguage || "javascript";

    try {
      let fileIds = [];

      if (slug === "dev") {
        const devFilesPayload = [
          {
            filename: "index.html",
            language: "html",
            code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${projectName}</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <h1>Hello, world!</h1>
  <script src="script.js"></script>
</body>
</html>`,
            output: "",
            input: "",
            testcase: [],
            media: [],
            question: "",
            notes: "",
          },
          {
            filename: "style.css",
            language: "css",
            code: `body { font-family: Arial, sans-serif; padding: 20px; }`,
            output: "",
            input: "",
            testcase: [],
            media: [],
            question: "",
            notes: "",
          },
          {
            filename: "script.js",
            language: "javascript",
            code: `console.log("Hello from script.js");`,
            output: "",
            input: "",
            testcase: [],
            media: [],
            question: "",
            notes: "",
          },
        ];

        const fileCreationPromises = devFilesPayload.map(filePayload =>
          axios.post(`${import.meta.env.VITE_API_URL}/files/create`, filePayload, {
            withCredentials: true,
          })
        );

        const filesCreated = await Promise.all(fileCreationPromises);
        fileIds = filesCreated.map(res => res.data._id);
      } else {
        const filePayload = {
          filename: "main",
          language,
          code: "",
          output: "",
          input: "",
          testcase: [],
          media: [],
          question: "",
          notes: "",
        };

        const fileRes = await axios.post(
          `${import.meta.env.VITE_API_URL}/files/create`,
          filePayload,
          { withCredentials: true }
        );
        fileIds.push(fileRes.data._id);
      }

      const projectPayload = {
        type: slug,
        name: projectName,
        language,
        files: fileIds,
      };

      const projectRes = await axios.post(
        `${import.meta.env.VITE_API_URL}/projects`,
        projectPayload,
        { withCredentials: true }
      );

      dispatch(setProject(projectRes.data));
      navigate(`/${slug}/${projectRes.data.projectId}`);
    } catch (err) {
      console.error("❌ Creation failed:", err.response?.data || err.message);
      // It's also a good idea to set an error for backend failures
      setError(err.response?.data?.message || "Project creation failed. Please try again.");
    }
  };

  return (
    <div className="newproject-container">
      <div className="project-title">
        <Input
          label="Project Name :"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="newproject-input"
        />
        {error && <p className="form-error">{error}</p>} {/* Display error message here */}
      </div>
      <div className="cards-wrapper">
        {categories.map((item) => (
          <div
            key={item.slug}
            className="project-card"
          >
            <h1>{item.title}</h1>
            <p>{item.description}</p>
            <Button type="button" onClick={() => handleChoice(item.slug)}>
              {item.buttonContent}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewProject;