import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectProgress } from "../../store/progressSlice";
import StorageManager from "../../utils/StorageManager";
import NoteEditor from "../NoteEditor/NoteEditor";
import { selectRouteData } from "../../store/routeSlice";

const PointNotesDisplay: React.FC = () => {
  const { pointIndex, branchIndex } = useSelector(selectProgress);
  const route = useSelector(selectRouteData);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!route) return;
    const savedNotes = StorageManager.getItem(`${route.game}_${route.name}_${branchIndex}_${pointIndex}`);
    if (savedNotes) {
      setNotes(savedNotes);
    } else {
      setNotes(route.branches[branchIndex].points[pointIndex].htmlNote);
    }
  }, [pointIndex, branchIndex, route?.branches, route?.game, route?.name, route]);

  if (!route) return null;

  const handleNotesChange = (content: string) => {
    if (content === "<p><br></p>" || content === "<p></p>") {
      StorageManager.removeItem(`${route.game}_${route.name}_${branchIndex}_${pointIndex}`);
      return;
    }
    setNotes(content);
    StorageManager.setItem(`${route.game}_${route.name}_${branchIndex}_${pointIndex}`, content);
  };

  return <NoteEditor notes={notes} onNotesChange={handleNotesChange} />;
};

export default PointNotesDisplay;
