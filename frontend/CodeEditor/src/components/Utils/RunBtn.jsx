import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setOutput, setStatus, updateFile } from '../../store/codeSlice';
import './RunBtn.css';
import store from "../../store/store"
import { TestcaseReloadContext } from '../contexts/TestCaseReloadContext';
import { useContext } from 'react';
import { setRightActiveTab } from '../../store/tabSlice';
import { useParams } from 'react-router-dom';

const RunBtn = () => {
  const dispatch = useDispatch();
  const projectType = useSelector(state => state.code.type);

  const context = useContext(TestcaseReloadContext);
  const triggerReload = context?.triggerReload ?? (() => {});

  const type = useSelector(state => state.code.type);
  const activeFileIndex = useSelector(state => state.code.activeFileIndex);
  const files = useSelector(state => state.code.files);

  const file = files[activeFileIndex] || {};

  const code = file.code || '';
  const language = file.language || '';
  const fileId = file._id;
  
  const testCases = type === 'dsa' ? file.testcase || [] : null;
  const input = type === 'assignment' ? file.input || '' : null;
  const [loading, setLoading] = useState(false);

  const runCode = async () => {

    
  console.log("Before setLoading(true)");
    setLoading(true);
  console.log("Loading set to true");
    
    //const response = await axios.post(`${VITE_API_URL}/api/dsa-assign`, { code, language, input });
    try{
    if(projectType === "assignment"){
      
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/execute/assignment`, { code, language, input, fileId}, {withCredentials: true});

      dispatch(updateFile({
  index: activeFileIndex,
  changes: { output: res.data.output }}));
      
    }

    if(testCases){
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/execute/dsa`, { code, language, testCases }, {withCredentials: true});

      console.log(res.data);              //array containing passed, stderr, stdout, testCaseId
      //I wanna  toggle the reload flag here
      
      triggerReload();
      
      dispatch(setRightActiveTab("Test Cases"))
    }

  }
  catch(err){
    console.log(err);
    
  }
  finally{
    
    console.log("Before setLoading(false)");
    setLoading(false);
  }


  
  };

  return (
    <div className="runbtn-container">
      <button className="runbtn" onClick={runCode} disabled={loading}>
        {loading ? 'Running...' : 'Run Code'}
      </button>
    </div>
  );
};

export default RunBtn;
