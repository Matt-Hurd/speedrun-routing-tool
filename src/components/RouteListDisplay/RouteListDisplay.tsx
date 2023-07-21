import React, { useEffect, useRef } from 'react';
import { selectProgress, incrementProgress, decrementProgress } from '../../store/progress/progressSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { selectRouteById } from '../../store/routes/routesSlice';
import { selectThingsForGame } from '../../store/things/thingsSlice';

const RouteListDisplay: React.FC = () => {
  const progress = useSelector(selectProgress);
  const dispatch = useDispatch<AppDispatch>();

  const route = useSelector((state: RootState) => selectRouteById(state, progress.gameId, progress.routeId));
  const things = useSelector((state: RootState) => selectThingsForGame(state, progress.gameId));
  
  const decrement = () => {
    dispatch(decrementProgress());
  }
  const increment = () => {
    dispatch(incrementProgress());
  }

  const activePointRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scrollToActivePoint = () => {
    if (activePointRef.current) {
      const parent = activePointRef.current.parentElement;
      if (parent) {
        const parentHeight = parent.clientHeight;
        const activeElemHeight = activePointRef.current.clientHeight;
        const activeElemTop = activePointRef.current.offsetTop;
        const centerPos = activeElemTop - (parentHeight / 2) + (activeElemHeight / 2);
        parent.scrollTop = centerPos;
      }
    }
  };

  scrollToActivePoint();
  }, [progress]);

  return (
    <div style={{ overflowY: 'scroll', whiteSpace: 'nowrap', height: '100%' }}>
      <button onClick={decrement}>Previous</button>
      <button onClick={increment}>Next</button>
      {route.branches.map((branch, branchIndex) => (
        <div style={{ marginLeft: 20 }} key={branchIndex}>
          <strong>{branch.name}</strong>
          {branchIndex === progress.branchIndex && branch.points.map((point, pointIndex) => (
            <div
              style={{ marginLeft: 40 }}
              key={branchIndex + "_" + pointIndex}
              ref={pointIndex === progress.pointIndex ? activePointRef : null}
            >
              {pointIndex === progress.pointIndex && <strong>&gt;</strong>}
              {things[point.thingId].name}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default RouteListDisplay;
