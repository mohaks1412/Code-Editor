import React from 'react'
import { useSelector } from 'react-redux';
import Tabs from './Tabs';
import Notepad from '../Utils/Notepad';
import IDE from '../Utils/IDE';
import Test from './Test';
import './Workspace.css'

const Workspace = ({ position }) => {

    const activeTab = useSelector((state) => {
        if (position === "left") {
            return state.tabs.leftActiveTab;
        } else {
            return state.tabs.rightActiveTab;
        }
    });

    // Fixed capitalization in key 'Test Cases' to match what you had in Tabs component
    const tabMap = {
    "Question": <Notepad key="question-editor" tabId={1} />,
    "Notes": <Notepad key="notes-editor" tabId={2} />,
    "Code": <IDE key="code-editor" />,
    "Test Cases": <Test key="test-cases" />,
    };

    return (
        <div className={`workspace workspace-${position}`}>
            <Tabs position={position} />
            <div className="workspace-content">
                {tabMap[activeTab]}
            </div>
        </div>
    );
}

export default Workspace;
