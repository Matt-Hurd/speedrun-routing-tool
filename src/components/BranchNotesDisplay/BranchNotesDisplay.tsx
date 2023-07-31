import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectProgress } from "../../store/progressSlice";
import StorageManager from "../../utils/StorageManager";
import NoteEditor from "../NoteEditor/NoteEditor";
import { RootState } from "../../store";
import { selectRouteById } from "../../store/routesSlice";

const BranchNotesDisplay: React.FC = () => {
  const { gameId, routeId, branchIndex } = useSelector(selectProgress);
  const [notes, setNotes] = useState("");

  const route = useSelector((state: RootState) => selectRouteById(state, gameId, routeId));

  useEffect(() => {
    const savedNotes = StorageManager.getItem(`${gameId}_${routeId}_${branchIndex}`);
    if (savedNotes) {
      setNotes(savedNotes);
    } else {
      setNotes(route.branches[branchIndex].htmlNote);
    }
  }, [gameId, routeId, branchIndex, route.branches]);

  const handleNotesChange = (content: string) => {
    if (content === "<p><br></p>" || content === "<p></p>") {
      StorageManager.removeItem(`${gameId}_${routeId}_${branchIndex}`);
      return;
    }
    setNotes(content);
    StorageManager.setItem(`${gameId}_${routeId}_${branchIndex}`, content);
  };

  return <NoteEditor notes={notes} onNotesChange={handleNotesChange} />;
};

export default BranchNotesDisplay;
