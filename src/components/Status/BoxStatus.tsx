import { FC } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import Text from '../Text';

interface BoxStatusProps {
  color?: string;
  label?: string;
  style?: any;
}

const shapeStyles = {
  bgcolor: 'primary.main',
  width: 24,
  height: 24,
  display: 'flex',
  border: 'solid 1px #ccc'
};
const shapeCircleStyles = { borderRadius: '50%' };

const BoxStatus: FC<BoxStatusProps> = ({
  color = '#f00',
  label = '',
  style = {}
}) => {
  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        flexGrow: 0,
        ...style
      }}
    >
      <Box
        component="span"
        sx={{
          ...shapeStyles,
          ...shapeCircleStyles,
          ...(color ? { bgcolor: color } : {})
        }}
      />
      {label && (
        <Text color="secondary" style={{ flexGrow: 1, textAlign: 'right' }}>
          {label}
        </Text>
      )}
    </div>
  );
};

BoxStatus.propTypes = {
  color: PropTypes.string,
  label: PropTypes.string,
  style: PropTypes.object
};

export default BoxStatus;
