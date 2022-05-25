import { FC } from 'react';
import { ISize } from '../../interfaces';
import { Box, Button } from '@mui/material';

interface Props {
  selectedSize?: ISize;
  sizes: ISize[];
  onClickSize: (e: ISize) => void;
}

export const SizeSlector: FC<Props> = ({ selectedSize, sizes, onClickSize }) => {
  return (
    <Box>
      {
        sizes.map( size => (
          <Button
            key={ size }
            size="small"
            color={ selectedSize === size ? 'primary' : 'info' }
            onClick={() => onClickSize(size)}
          >
            { size }
          </Button>
        ) )
      }
    </Box>
  )
};
