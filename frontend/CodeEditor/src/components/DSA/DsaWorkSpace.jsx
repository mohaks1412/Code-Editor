import React from 'react';
import Workspace from './Workspace';
import RunBtn from '../Utils/RunBtn';
import Sidebar from '../Utils/fileSystem/Sidebar';
import './DsaWorkSpace.css'; 
import RecordBtn from '../Utils/RecordBtn';
import AudioBoard from '../Utils/AudioBoard';
import DeleteAudio from '../Utils/DeleteAudio';
import { useSelector } from 'react-redux';

import { TestcaseReloadProvider } from '../contexts/TestCaseReloadContext';

const DsaWorkSpace = () => {
  const projectId = useSelector(state => state.code.projectId);

  return (
    <TestcaseReloadProvider>
      <div className="dsa-workspace-container">
        <div className="top-bar">
          <RunBtn />
          <RecordBtn />
          <DeleteAudio />
        </div>
        <AudioBoard />
        <div className="main-content">
          <div className="sidebar-container">
            <Sidebar />
          </div>
          <div className="workspaces-container">
            <Workspace position="left" />
            <Workspace position="right" />
          </div>
        </div>
      </div>
    </TestcaseReloadProvider>
  );
};

export default DsaWorkSpace;
