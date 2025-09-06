import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {setLeftActiveTab, setRightActiveTab} from '../../store/tabSlice'
import './Tabs.css';

const Tabs = ({ position }) => {
  const dispatch = useDispatch();

  const leftActiveTab = useSelector(state => state.tabs.leftActiveTab);
  const rightActiveTab = useSelector(state => state.tabs.rightActiveTab);

  const onTabChange = (tab) => {
    if (position === "left") {
      dispatch(setLeftActiveTab(tab));
    } else {
      dispatch(setRightActiveTab(tab));
    }
  };

  const leftTabs = ['Question', 'Notes'];
  const rightTabs = ['Code', 'Test Cases'];

  const tabsToRender = position === 'left' ? leftTabs : rightTabs;
  const activeTab = position === 'left' ? leftActiveTab : rightActiveTab;

  return (
    <div className="tabs-container">
      {tabsToRender.map((tab) => (
        <button
          key={tab}
          className={tab === activeTab ? 'active' : ''}
          onClick={() => onTabChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
