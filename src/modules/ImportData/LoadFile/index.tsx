import React from 'react';
import Block1 from './Block1';
import Block2 from './Block2';
import Block3 from './Block3';

const LoadFile = ({ setRefreshData, refreshData }) => {
  return (
    <div style={{display: 'flex', gap: '16px', flexWrap: 'wrap', padding: '36px 0 0 36px', width: '100%'}}>
      <Block1 refreshData={refreshData} />
      <Block2 refreshData={refreshData} />
      <Block3 setRefreshData={setRefreshData} />
    </div>
  );
};

export default LoadFile;
