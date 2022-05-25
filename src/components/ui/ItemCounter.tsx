import { FC } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';

interface Props {
  currentValue: number;
  updatedQuantity: (value: number) => void;
  maxValue: number;
}

export const ItemCounter: FC<Props> = ({ currentValue, updatedQuantity, maxValue }) => {
  return (
    <Box display='flex' alignItems='center'>
      <IconButton
        onClick={() => updatedQuantity(Math.max(currentValue - 1, 1))}
      >
        <RemoveCircleOutline />
      </IconButton>

      <Typography sx={{ width: 40, textAlign: 'center' }}>{ currentValue }</Typography>

      <IconButton
        onClick={() => updatedQuantity(Math.min(currentValue + 1, maxValue))}
      >
        <AddCircleOutline />
      </IconButton>
    </Box>
  )
};
