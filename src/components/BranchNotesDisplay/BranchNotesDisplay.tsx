import React from 'react';
import { selectActiveBranch } from '../../store/progress/progressSlice';
import { useSelector } from 'react-redux';

const BranchNotesDisplay: React.FC = () => {
  const activeBranch = useSelector(selectActiveBranch);

  return (
    <div>
      <h3>Branch Notes:</h3>
      {activeBranch?.notes ? <p>{activeBranch.notes}</p> : <p>No notes for this branch.</p>}
    </div>
  );
};

export default BranchNotesDisplay;
