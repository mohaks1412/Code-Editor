import React from 'react';

const Output = ({ value }) => {
  return (
    <div>
      <textarea
        value={value || ''}
        readOnly
        style={{
          width: "100%",
          height: "150px",
          resize: "none",
          backgroundColor: "#f5f5f5",
          border: "1px solid #ccc",
          padding: "8px",
          fontFamily: "monospace"
        }}
      />
    </div>
  );
};

export default Output;
