import React, { useState, useEffect } from "react";
import TestCase from "./TestCase";
import "./Test.css";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { updateFile } from "../../store/codeSlice";

const Test = () => {
  const dispatch = useDispatch();
  const activeFileIndex = useSelector((state) => state.code.activeFileIndex);
  const files = useSelector((state) => state.code.files);

  const fileId = files[activeFileIndex]?._id || null;
  const testCaseIds = files[activeFileIndex]?.testcase || [];

  const [activeTestCaseId, setActiveTestCaseId] = useState(null);
  const [activeTestCaseData, setActiveTestCaseData] = useState(null);
  const [testCasesData, setTestCasesData] = useState({}); // map: id -> testCase

  // Preload all test cases whenever testCaseIds changes
  useEffect(() => {
    if (testCaseIds.length === 0) {
      setTestCasesData({});
      setActiveTestCaseId(null);
      setActiveTestCaseData(null);
      return;
    }

    const fetchAllTestCases = async () => {
      try {
        const responses = await Promise.all(
          testCaseIds.map((id) =>
            axios.get(`${import.meta.env.VITE_API_URL}/testcases/${id}`, {
              withCredentials: true,
            })
          )
        );

        const casesMap = {};
        responses.forEach((res) => {
          const tc = res.data.testCase;
          casesMap[tc._id] = tc;
        });

        setTestCasesData(casesMap);
        setActiveTestCaseId(testCaseIds[0]);
        setActiveTestCaseData(casesMap[testCaseIds[0]]);
      } catch (error) {
        console.error("Failed to fetch test cases:", error);
      }
    };

    fetchAllTestCases();
  }, [testCaseIds]);

  const handleSelectTestCase = (testCaseId) => {
    setActiveTestCaseId(testCaseId);
    setActiveTestCaseData(testCasesData[testCaseId]);
  };

  const handleDeleteTestCase = (deletedTestCaseId) => {
    const filteredIds = testCaseIds.filter((id) => id !== deletedTestCaseId);
    const updatedFile = {
      ...files[activeFileIndex],
      testcase: filteredIds,
    };

    dispatch(updateFile({ index: activeFileIndex, changes: updatedFile }));

    if (activeTestCaseId === deletedTestCaseId) {
      const newActive = filteredIds[0] || null;
      setActiveTestCaseId(newActive);
      setActiveTestCaseData(newActive ? testCasesData[newActive] : null);
    }
  };

  const handleAddTestCase = async () => {
    if (!fileId) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/testcases/${fileId}`,
        {
          input: "",
          expected: "",
          received: "",
          status: null,
        },
        { withCredentials: true }
      );

      const newTestCase = response.data.testCase;
      const updatedTestCases = [...testCaseIds, newTestCase._id];
      const updatedFile = {
        ...files[activeFileIndex],
        testcase: updatedTestCases,
      };

      dispatch(updateFile({ index: activeFileIndex, changes: updatedFile }));

      setTestCasesData((prev) => ({
        ...prev,
        [newTestCase._id]: newTestCase,
      }));

      setActiveTestCaseId(newTestCase._id);
      setActiveTestCaseData(newTestCase);
    } catch (error) {
      console.error("Failed to add test case:", error);
    }
  };

  return (
    <div className="test-container" style={{ position: "relative", zIndex: 3 }}>
      <div className="test-tabs">
        {testCaseIds.map((tcId, index) => {
          const isActive = tcId === activeTestCaseId;
          const testCase = testCasesData[tcId];

          let statusClass = "unevaluated";
          if (testCase?.status === true) statusClass = "passed";
          else if (testCase?.status === false) statusClass = "failed";

          return (
            <button
              key={tcId}
              className={`test-tab ${isActive ? "active-tab" : ""} ${statusClass}`}
              onClick={() => handleSelectTestCase(tcId)}
            >
              Test Case {index + 1}
            </button>
          );
        })}

        <button className="add-test-case-btn" onClick={handleAddTestCase}>
          + Add Test Case
        </button>
      </div>

      <div className="test-case-editor">
        {activeTestCaseData ? (
          <TestCase
            testCase={activeTestCaseData}
            fileId={fileId}
            onDelete={handleDeleteTestCase}
          />
        ) : (
          <div style={{ padding: 20, color: "#888" }}>
            {activeTestCaseId
              ? "Loading test case..."
              : "No test cases available."}
          </div>
        )}
      </div>
    </div>
  );
};

export default Test;
