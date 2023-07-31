import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectProgress } from "../../store/progressSlice";
import StorageManager from "../../utils/StorageManager";
import NoteEditor from "../NoteEditor/NoteEditor";
import { RootState } from "../../store";
import { selectRouteById } from "../../store/routesSlice";

const PointNotesDisplay: React.FC = () => {
  const { gameId, routeId, pointIndex, branchIndex } =
    useSelector(selectProgress);
  const [notes, setNotes] = useState("");
  
  const route = useSelector((state: RootState) => selectRouteById(state, gameId, routeId));

  useEffect(() => {
    const savedNotes = StorageManager.getItem(
      `${gameId}_${routeId}_${branchIndex}_${pointIndex}`
    );
    if (savedNotes) {
      setNotes(savedNotes);
    } else {
      setNotes(route.branches[branchIndex].points[pointIndex].htmlNote);
    }
  }, [gameId, routeId, pointIndex, branchIndex, route.branches]);

  const handleNotesChange = (content: string) => {
    if (content === "<p><br></p>" || content === "<p></p>") {
      StorageManager.removeItem(
        `${gameId}_${routeId}_${branchIndex}_${pointIndex}`
      );
      return;
    }
    setNotes(content);
    StorageManager.setItem(
      `${gameId}_${routeId}_${branchIndex}_${pointIndex}`,
      content
    );
  };

  return <NoteEditor notes={notes} onNotesChange={handleNotesChange} />;
};

export default PointNotesDisplay;
