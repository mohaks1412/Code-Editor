import React, { useState, useEffect } from 'react';
import Input from '../Input';
import './TestCase.css';
import axios from 'axios';
import { useSelector } from 'react-redux';

const DEBOUNCE_DELAY = 500; // 2 seconds

const TestCase = ({ testCase, onDelete }) => {
  
 const activeFileIndex = useSelector((state) => state.code.activeFileIndex);
   const files = useSelector((state) => state.code.files);
   const fileId = files[activeFileIndex]?._id || null;
  const [localTestCase, setLocalTestCase] = useState({
    input: testCase.input || '',
    expected: testCase.expected || '',
  });
  const passed = testCase.status;
  const [isUpdating, setIsUpdating] = useState(false);

  const handleInputChange = (field, value) => {
    setLocalTestCase((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    setLocalTestCase({
      input: testCase.input || '',
      expected: testCase.expected || '',
    });
  }, [testCase]);

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (
        localTestCase.input !== testCase.input ||
        localTestCase.expected !== testCase.expected
      ) {
        setIsUpdating(true);
        try {
          await axios.put(
            `${import.meta.env.VITE_API_URL}/testcases/${testCase._id}`,
            { ...testCase, ...localTestCase },
            { withCredentials: true }
          );
        } catch (error) {
          console.error('Failed to update test case:', error);
        }
        setIsUpdating(false);
      }
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(handler);
    };
  }, [localTestCase, testCase]);

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/testcases/${fileId}/${testCase._id}`,
        { withCredentials: true }
      );
      if (onDelete) onDelete(testCase._id);
    } catch (error) {
      console.error('Failed to delete test case:', error);
    }
  };

  return (
    <div className="testcase-container">
      <Input
        label="Input :"
        multiline
        value={localTestCase.input}
        onChange={(e) => handleInputChange('input', e.target.value)}
        className="testcase-input"
      />

      <Input
        label="Expected Output :"
        multiline
        value={localTestCase.expected}
        onChange={(e) => handleInputChange('expected', e.target.value)}
        className="testcase-expected"
      />

      {
        (testCase.status !== null) && <Input
          label="Recieved Output :"
          multiline
          value={testCase.received}
          style={{color: passed===null?"#ff8f00":passed?"#4CAF50":"#F44336",
            border: passed===null?"2px solid #ff8f00":passed?"2px solid #4CAF50":"2px solid #F44336",
            boxShadow: passed === null ? "0 0 9px #ff8f00" : passed ? "0 0 9px #4CAF50" : "0 0 9px #F44336",
          }
          }
          className="testcase-output"
        onChange={(e) => handleInputChange('received', e.target.value)}
          readOnly
        />
      }
    
    
      <button
        onClick={handleDelete}
        style={{
          marginTop: '10px',
          color: 'red',
          cursor: 'pointer',
          background: 'none',
          border: '1px solid red',
          padding: '6px 12px',
          borderRadius: '4px',
        }}
        title="Delete Test Case"
        disabled={isUpdating}
      >
        Delete Test Case
      </button>

      {isUpdating && <p style={{color: 'blue'}}>Updating...</p>}
    </div>
  );
};

export default TestCase;
