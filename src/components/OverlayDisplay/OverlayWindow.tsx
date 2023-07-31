import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import OverlayDisplay from "./OverlayDisplay";

const OverlayWindow: React.FC = () => {
  const [externalWindow, setExternalWindow] = useState<Window | null>(null);
  const [containerDiv, setContainerDiv] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const windowFeatures = "width=500,height=500,left=100,top=100";
    const newWindow = window.open("", "", windowFeatures);
    const newContainerDiv = document.createElement("div");

    newWindow?.document.body.appendChild(newContainerDiv);

    setExternalWindow(newWindow);
    setContainerDiv(newContainerDiv);

    return () => {
      newWindow?.close();
    };
  }, []);

  return <>{externalWindow && containerDiv && ReactDOM.createPortal(<OverlayDisplay />, containerDiv)}</>;
};

export default OverlayWindow;
