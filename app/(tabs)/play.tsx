import React, { useEffect } from 'react';
import { Box, Button, ButtonText, HStack, ScrollView, Text, VStack } from '@gluestack-ui/themed';
import { router, useLocalSearchParams } from 'expo-router';
import type { Level } from '../../src/domain/entities/Game';
import { useMinesweeperGame } from '../../src/presentation/hooks/useMinesweeperGame';
import { GameCell } from '../../src/presentation/components/GameCell';

const parseParam = (value: string | string[] | undefined, fallback: number): number => {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number.parseInt(raw ?? '', 10);

  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseLevel = (value: string | string[] | undefined): Level => {
  const raw = Array.isArray(value) ? value[0] : value;

  if (raw === 'easy' || raw === 'medium' || raw === 'hard' || raw === 'custom') {
    return raw;
  }

  return 'easy';
};

export default function PlayScreen(): React.JSX.Element {
  const params = useLocalSearchParams();
  const level = parseLevel(params.level);
  const rows = parseParam(params.rows, 9);
  const cols = parseParam(params.cols, 9);
  const mines = parseParam(params.mines, 10);

  const {
    grid,
    result,
    gameOver,
    seconds,
    minesLeft,
    onPressCell,
    onLongPressCell,
    resetGame,
    dispose,
  } = useMinesweeperGame({
    initialLevel: level,
    initialRows: rows,
    initialCols: cols,
    initialMines: mines,
  });

  useEffect(() => {
    return dispose;
  }, [dispose]);

  return (
    <Box flex={1} bg="$blueGray900" pt="$12" px="$3">
      <VStack space="md" flex={1}>
        <Box bg="$cyan500" px="$4" py="$3" borderRadius="$xl">
          <Text color="$white" size="2xl" bold>
            Partida
          </Text>
          <Text color="$white" size="sm">
            Tablero {rows}x{cols} con {mines} minas.
          </Text>
        </Box>

        <HStack bg="$coolGray100" p="$3" borderRadius="$xl" justifyContent="space-between" alignItems="center">
          <VStack>
            <Text size="xs" color="$coolGray600">
              Minas
            </Text>
            <Text bold size="lg" color="$coolGray900">
              {minesLeft}
            </Text>
          </VStack>

          <Button size="sm" variant="outline" borderColor="$coolGray500" onPress={() => resetGame(rows, cols, mines)}>
            <ButtonText color="$coolGray800">Reiniciar</ButtonText>
          </Button>

          <VStack alignItems="flex-end">
            <Text size="xs" color="$coolGray600">
              Tiempo
            </Text>
            <Text bold size="lg" color="$coolGray900">
              {seconds}s
            </Text>
          </VStack>
        </HStack>

        <Box bg="$coolGray100" borderRadius="$xl" p="$2" flex={1} minHeight={0} alignItems="center" justifyContent="center">
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
            <VStack space="xs">
              {grid.map((row, r) => (
                <HStack key={`row-${r}`} space="xs">
                  {row.map((cell, c) => (
                    <GameCell
                      key={`cell-${r}-${c}`}
                      cell={cell}
                      size={rows > 9 || cols > 9 ? 24 : 30}
                      onPress={() => {
                        void onPressCell(r, c);
                      }}
                      onLongPress={() => onLongPressCell(r, c)}
                    />
                  ))}
                </HStack>
              ))}
            </VStack>
          </ScrollView>
        </Box>

        {gameOver && (
          <Box borderRadius="$xl" p="$3" bg={result === 'win' ? '$emerald200' : '$red200'}>
            <Text bold size="lg" color={result === 'win' ? '$emerald900' : '$red900'}>
              {result === 'win' ? 'Victoria' : 'Derrota'}
            </Text>
            <Text color={result === 'win' ? '$emerald900' : '$red900'}>
              {result === 'win' ? `Completaste el tablero en ${seconds}s.` : 'Encontraste una mina.'}
            </Text>
            <Button mt="$2" size="sm" bg={result === 'win' ? '$emerald700' : '$red700'} onPress={() => resetGame(rows, cols, mines)}>
              <ButtonText>Jugar de nuevo</ButtonText>
            </Button>
          </Box>
        )}

        <Button variant="outline" borderColor="$coolGray300" onPress={() => router.replace('/(tabs)')}>
          <ButtonText color="$coolGray200">Juego nuevo</ButtonText>
        </Button>
      </VStack>
    </Box>
  );
}
