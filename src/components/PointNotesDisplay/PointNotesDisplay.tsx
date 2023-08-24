import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectProgress } from "../../store/progressSlice";
import StorageManager from "../../utils/StorageManager";
import NoteEditor from "../NoteEditor/NoteEditor";
import { selectRouteData } from "../../store/routeSlice";
import { Korok, Thing, Shrine, Point } from "../../models";

const getDefaultNote = (point: Point, thing: Thing) => {
  const chestShrines = ["Mayasiar Shrine", "Kurakat Shrine", "Mayam Shrine", "Ganos Shrine"];
  if (point.htmlNote) {
    return point.htmlNote;
  } else if (thing.type === "Korok") {
    return (thing as Korok).korokType;
  } else if (thing.type === "Shrine") {
    if ((thing as Shrine).isProvingGrounds && (point.action === "COMPLETE" || !point.action))
      return '<span class="ql-size-huge">ZUGGLE SHIELD</span>';
    if ((point.action === "COMPLETE" || !point.action) && chestShrines.includes(thing.name))
      return '<span class="ql-size-huge">OPEN CHEST</span>';
  }
  return "";
};

const PointNotesDisplay: React.FC = () => {
  const { pointIndex, branchIndex } = useSelector(selectProgress);
  const route = useSelector(selectRouteData);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!route) return;
    const savedNotes = StorageManager.getItem(`${route.game.name}_${route.name}_${branchIndex}_${pointIndex}`);
    const point = route.branches[branchIndex].points[pointIndex];
    const thing = route.things[point.thingId];
    if (savedNotes) {
      setNotes(savedNotes);
    } else {
      setNotes(getDefaultNote(point, thing));
    }
  }, [pointIndex, branchIndex, route?.branches, route?.game, route?.name, route]);

  if (!route) return null;

  const handleNotesChange = (content: string) => {
    const point = route.branches[branchIndex].points[pointIndex];
    const thing = route.things[point.thingId];
    if (content === "<p><br></p>" || content === "<p></p>" || content === `<p>${getDefaultNote(point, thing)}</p>`) {
      StorageManager.removeItem(`${route.game.name}_${route.name}_${branchIndex}_${pointIndex}`);
      return;
    }
    setNotes(content);
    StorageManager.setItem(`${route.game.name}_${route.name}_${branchIndex}_${pointIndex}`, content);
  };

  return <NoteEditor notes={notes} onNotesChange={handleNotesChange} />;
};

export default PointNotesDisplay;
