import React from 'react';

import './ErrorContainer.css';

export default ({ error }) => {
  if (!error) return null;

  return (
    <div className='ErrorContainer'>
      <strong>Error</strong> {error.message}
    </div>
  );
};
