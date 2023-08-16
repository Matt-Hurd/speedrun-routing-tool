import { useEffect } from "react";
import { useAppDispatch } from "../../hooks";
import { incrementProgress, decrementProgress, incrementSection, decrementSection } from "../../store/progressSlice";

export const useKeyBindings = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        const action = event.ctrlKey && event.shiftKey ? decrementSection : decrementProgress;
        dispatch(action());
      } else if (event.key === "ArrowRight") {
        const action = event.ctrlKey && event.shiftKey ? incrementSection : incrementProgress;
        dispatch(action());
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch]);
};
