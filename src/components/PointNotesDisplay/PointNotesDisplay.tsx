import React from 'react';
import { selectActivePoint } from '../../store/progress/progressSlice';
import { useSelector } from 'react-redux';

const PointNotesDisplay: React.FC = () => {
  const activePoint = useSelector(selectActivePoint);

  return (
    <div>
      <h3>Point Notes:</h3>
      {activePoint?.notes ? <p>{activePoint.notes}</p> : <p>No notes for this point.</p>}
    </div>
  );
};

export default PointNotesDisplay;
