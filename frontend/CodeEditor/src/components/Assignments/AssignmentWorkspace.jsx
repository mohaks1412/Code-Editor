import React from 'react';
import IDE from '../Utils/IDE';
import Sidebar from '../Utils/fileSystem/Sidebar';
import RunBtn from '../Utils/RunBtn';
import Input from '../Input';
import { useDispatch, useSelector } from 'react-redux';
import './AssignmentWorkspace.css';
import { updateFile } from '../../store/codeSlice';

const AssignmentWorkspace = () => {

  
  const dispatch = useDispatch();
  const activeFileIndex = useSelector(state => state.code.activeFileIndex);
  const files = useSelector(state => state.code.files);
   const inputValue = files[activeFileIndex]?.input || '';
   const outputValue = files[activeFileIndex]?.output || '';

   const handleInputChange = (e) => {
    const newInput = e.target.value;
    const updatedFile = {
      ...files[activeFileIndex],
      input: newInput,
    };
    dispatch(updateFile({ index: activeFileIndex, changes: updatedFile }));
  };

  return (
    <div className="assignment-workspace">
      <div className="sidebar-container">
        <Sidebar />
      </div>
      <div className="main-content">
        <div className="run-button-container">
          <RunBtn />
        </div>
        <div className="ide-container">
          <IDE />
        </div>
        <div className="output-container">
          <Input style={{border:"none",
            height: "100%"
          }}
          multiline
          placeholder="Enter Input here"
          value={inputValue}
          onChange={handleInputChange}
          />
          <Input
          
          style={{border:"none",
            height: "100%"
          }}
          placeholder="Output will appear here"
          readOnly
          multiline
          value={outputValue}
          />
        </div>
      </div>
    </div>
  );
};

export default AssignmentWorkspace;
