import React, { useState, useRef, useEffect } from "react";
import "./DropDown.css";

const DropDown = ({ options, selected, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (value) => {
    onChange(value);
    setIsOpen(false);
  };

  // Find label for the selected value
  const selectedLabel = options.find((opt) => opt.value === selected)?.label || "Select";

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <button
        className="dropdown-toggle"
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {selectedLabel}
        <span className={`dropdown-arrow ${isOpen ? "open" : ""}`} />
      </button>
      {isOpen && (
        <ul className="dropdown-menu" role="listbox" tabIndex={-1}>
          {options.map(({ label, value }) => (
            <li
              key={value}
              className={`dropdown-item ${value === selected ? "selected" : ""}`}
              role="option"
              aria-selected={value === selected}
              onClick={() => handleSelect(value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleSelect(value);
                }
              }}
              tabIndex={0}
            >
              {label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropDown;
