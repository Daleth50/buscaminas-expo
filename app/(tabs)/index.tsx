import React, { useMemo, useState } from 'react';
import {
  Box,
  Button,
  ButtonText,
  HStack,
  Input,
  InputField,
  Pressable,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import { router } from 'expo-router';
import { LEVELS } from '../../src/domain/entities/Game';
import type { Level } from '../../src/domain/entities/Game';
import { ValidateCustomConfigUseCase } from '../../src/application/usecases/ValidateCustomConfigUseCase';

const validateCustomConfigUseCase = new ValidateCustomConfigUseCase();

export default function GameConfigScreen(): React.JSX.Element {
  const [selectedLevel, setSelectedLevel] = useState<Level>('easy');
  const [customRows, setCustomRows] = useState<string>('10');
  const [customCols, setCustomCols] = useState<string>('10');
  const [customMines, setCustomMines] = useState<string>('15');

  const preview = useMemo(() => {
    if (selectedLevel === 'custom') {
      return validateCustomConfigUseCase.execute(customRows, customCols, customMines);
    }

    return LEVELS[selectedLevel];
  }, [selectedLevel, customRows, customCols, customMines]);

  const onApplyAndPlay = () => {
    router.push({
      pathname: '/(tabs)/play',
      params: {
        level: selectedLevel,
        rows: String(preview.rows),
        cols: String(preview.cols),
        mines: String(preview.mines),
      },
    });
  };

  return (
    <Box flex={1} bg="$blueGray900" pt="$12" px="$3">
      <VStack space="md" flex={1}>
        <Box bg="$cyan500" px="$4" py="$3" borderRadius="$xl">
          <Text color="$white" size="2xl" bold>
            Configuracion
          </Text>
          <Text color="$white" size="sm">
            Elige el tablero y luego presiona aplicar para iniciar la partida.
          </Text>
        </Box>

        <Box bg="$blueGray100" p="$3" borderRadius="$xl">
          <Text bold mb="$2" color="$blueGray900">
            Dificultad
          </Text>
          <HStack space="sm" flexWrap="wrap">
            <Button size="sm" bg={selectedLevel === 'easy' ? '$emerald600' : '$coolGray200'} onPress={() => setSelectedLevel('easy')}>
              <ButtonText color={selectedLevel === 'easy' ? '$white' : '$blueGray800'}>Facil</ButtonText>
            </Button>
            <Button size="sm" bg={selectedLevel === 'medium' ? '$amber600' : '$coolGray200'} onPress={() => setSelectedLevel('medium')}>
              <ButtonText color={selectedLevel === 'medium' ? '$white' : '$blueGray800'}>Medio</ButtonText>
            </Button>
            <Button size="sm" bg={selectedLevel === 'hard' ? '$rose600' : '$coolGray200'} onPress={() => setSelectedLevel('hard')}>
              <ButtonText color={selectedLevel === 'hard' ? '$white' : '$blueGray800'}>Dificil</ButtonText>
            </Button>
            <Pressable onPress={() => setSelectedLevel('custom')}>
              <Box px="$3" py="$2" borderRadius="$md" bg={selectedLevel === 'custom' ? '$violet600' : '$coolGray200'}>
                <Text color={selectedLevel === 'custom' ? '$white' : '$blueGray800'} bold size="sm">
                  Custom
                </Text>
              </Box>
            </Pressable>
          </HStack>

          {selectedLevel === 'custom' && (
            <VStack space="sm" mt="$3">
              <HStack space="sm">
                <Input flex={1} size="sm" bg="$white">
                  <InputField value={customRows} onChangeText={setCustomRows} keyboardType="number-pad" placeholder="Filas" />
                </Input>
                <Input flex={1} size="sm" bg="$white">
                  <InputField value={customCols} onChangeText={setCustomCols} keyboardType="number-pad" placeholder="Columnas" />
                </Input>
                <Input flex={1} size="sm" bg="$white">
                  <InputField value={customMines} onChangeText={setCustomMines} keyboardType="number-pad" placeholder="Minas" />
                </Input>
              </HStack>
            </VStack>
          )}
        </Box>

        <HStack bg="$coolGray100" p="$3" borderRadius="$xl" justifyContent="space-between" alignItems="center">
          <VStack>
            <Text size="xs" color="$coolGray600">
              Filas
            </Text>
            <Text bold size="lg" color="$coolGray900">
              {preview.rows}
            </Text>
          </VStack>

          <VStack alignItems="flex-end">
            <Text size="xs" color="$coolGray600">
              Columnas / Minas
            </Text>
            <Text bold size="lg" color="$coolGray900">
              {preview.cols} / {preview.mines}
            </Text>
          </VStack>
        </HStack>

        <Box flex={1} justifyContent="flex-end" pb="$6">
          <Button bg="$cyan700" onPress={onApplyAndPlay}>
            <ButtonText>Aplicar y jugar</ButtonText>
          </Button>
        </Box>
      </VStack>
    </Box>
  );
}
