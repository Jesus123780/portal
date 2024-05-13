import { Box, Card, Modal } from '@mui/material';
import React from 'react';

const style = {
    position: 'absolute' as 'absolute',
    height: '600px',
    width: '1250px',
    transform: 'translate(-50%, -50%)',
    top: '50%',
    left: '50%'
};

const ImageDialog = ({ open, handleClose, images }) => {
  console.log(images)
  return (
    <Modal open={open} onClose={handleClose}>
      <Card
        style={style}
      >
        <Box>
        </Box>
      </Card>
    </Modal>
  );
};

export default ImageDialog;
