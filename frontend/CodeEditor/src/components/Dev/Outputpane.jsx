import React from 'react';
import './Outputpane.css';

const Outputpane = ({ code = ''}) => {

  return (
    <div className="outputpane-container">
      <iframe
        className="outputpane-iframe"
        srcDoc={code}
        title="Live Preview"
        sandbox="allow-scripts"
      />
    </div>
  );
};

export default Outputpane;
