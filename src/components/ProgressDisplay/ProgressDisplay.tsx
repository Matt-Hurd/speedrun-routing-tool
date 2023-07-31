import React from 'react';
import { selectProgress } from '../../store/progress/progressSlice';
import { useSelector } from 'react-redux';

const ProgressDisplay: React.FC = () => {
  const progress = useSelector(selectProgress);

  return (
    <div>
      <h2>Progress</h2>
      <p>Current branch index: {progress.branchIndex}</p>
      <p>Current point index: {progress.pointIndex}</p>
    </div>
  );
};

export default ProgressDisplay;
