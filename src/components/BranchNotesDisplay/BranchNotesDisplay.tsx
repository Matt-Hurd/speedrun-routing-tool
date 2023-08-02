import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectProgress } from "../../store/progressSlice";
import StorageManager from "../../utils/StorageManager";
import NoteEditor from "../NoteEditor/NoteEditor";
import { selectRouteData } from "../../store/routeSlice";

const BranchNotesDisplay: React.FC = () => {
  const { branchIndex } = useSelector(selectProgress);
  const route = useSelector(selectRouteData);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!route) return;
    const savedNotes = StorageManager.getItem(`${route.game}_${route.name}_${branchIndex}`);
    if (savedNotes) {
      setNotes(savedNotes);
    } else {
      setNotes(route.branches[branchIndex].htmlNote);
    }
  }, [branchIndex, route?.branches, route]);

  const handleNotesChange = (content: string) => {
    if (!route) return null;
    if (content === "<p><br></p>" || content === "<p></p>") {
      StorageManager.removeItem(`${route.game}_${route.name}_${branchIndex}`);
      return;
    }
    setNotes(content);
    StorageManager.setItem(`${route.game}_${route.name}_${branchIndex}`, content);
  };

  return <NoteEditor notes={notes} onNotesChange={handleNotesChange} />;
};

export default BranchNotesDisplay;
