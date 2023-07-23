import React, { useEffect, useRef } from 'react';
import { selectProgress, incrementProgress, decrementProgress } from '../../store/progress/progressSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { selectRouteById } from '../../store/routes/routesSlice';
import { selectThingsForGame } from '../../store/things/thingsSlice';
import './RouteListDisplay.css'; // Assuming you have a corresponding CSS file

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
    activePointRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [progress]);
  
  return (
    <div className="routeList">
      {route.branches.map((branch, branchIndex) => (
        <div className="routeList__branch" key={branchIndex}>
          <div className="routeList__branchName">
            <strong>{branch.name}</strong>
          </div>
          {branch.points.map((point, pointIndex) => (
            <div 
              className={`routeList__point ${branchIndex === progress.branchIndex && pointIndex === progress.pointIndex ? 'routeList__point--active' : ''}`} 
              key={branchIndex + "_" + pointIndex}
              ref={branchIndex === progress.branchIndex && pointIndex === progress.pointIndex ? activePointRef : null}
            >
              <div className="routeList__pointId">{pointIndex}</div>
              <div className="routeList__pointName">{things[point.thingId].name}</div>
              <div className="routeList__pointNotes">{point.notes}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};


export default RouteListDisplay;
