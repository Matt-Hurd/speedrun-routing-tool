import React from "react";

import "./Toolbar.css";
import Dropdown from "./Dropdown";

interface ToolbarProps {
  onButtonClick: (action: string) => void;
  onAddDisplay: (display: string) => void;
  missingDisplays: string[];
}

const Toolbar: React.FC<ToolbarProps> = ({ onAddDisplay, missingDisplays }) => {
  return (
    <div className="toolbar">
      {/* <button className="bp5-button" onClick={() => onButtonClick("action1")}>
        Button 1
      </button>
      <button className="bp5-button" onClick={() => onButtonClick("action2")}>
        Button 2
      </button> */}

      <div className="dropdown">
        {missingDisplays.length !== 0 && <Dropdown options={missingDisplays} onSelect={onAddDisplay} />}
      </div>
    </div>
  );
};

export default Toolbar;
