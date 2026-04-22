import React from 'react';
import { Box, Pressable, Text } from '@gluestack-ui/themed';
import type { Cell } from '../../domain/entities/Game';

type Props = {
  cell: Cell;
  size: number;
  onPress: () => void;
  onLongPress: () => void;
};

const getCellText = (cell: Cell): string => {
  if (cell.flagged && !cell.revealed) {
    return 'F';
  }

  if (!cell.revealed) {
    return '';
  }

  if (cell.mine) {
    return 'M';
  }

  if (cell.count > 0) {
    return String(cell.count);
  }

  return '';
};

const getCellBg = (cell: Cell): string => {
  if (cell.flagged && !cell.revealed) {
    return '$warning200';
  }

  if (!cell.revealed) {
    return '$blueGray300';
  }

  if (cell.mine) {
    return '$error300';
  }

  return '$blueGray50';
};

export function GameCell({ cell, size, onPress, onLongPress }: Props): React.JSX.Element {
  return (
    <Pressable onPress={onPress} onLongPress={onLongPress}>
      <Box
        w={size}
        h={size}
        borderWidth={1}
        borderColor="$blueGray500"
        alignItems="center"
        justifyContent="center"
        bg={getCellBg(cell)}
        borderRadius="$xs"
      >
        <Text size="xs" bold color={cell.mine && cell.revealed ? '$error900' : '$blueGray800'}>
          {getCellText(cell)}
        </Text>
      </Box>
    </Pressable>
  );
}
