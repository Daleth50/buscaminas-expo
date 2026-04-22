import React, { useCallback } from 'react';
import { Box, Button, ButtonText, HStack, ScrollView, Text, VStack } from '@gluestack-ui/themed';
import { useFocusEffect } from 'expo-router';
import { useScores } from '../../src/presentation/hooks/useScores';

export default function ScoresScreen(): React.JSX.Element {
  const { scores, loadScores, clearScores } = useScores();

  useFocusEffect(
    useCallback(() => {
      void loadScores();
    }, [loadScores]),
  );

  return (
    <Box flex={1} bg="$coolGray900" pt="$12" px="$4">
      <VStack space="md" flex={1}>
        <Box bg="$teal500" px="$4" py="$3" borderRadius="$xl">
          <Text color="$white" size="2xl" bold>
            Puntuaciones
          </Text>
          <Text color="$white" size="sm">
            Top 10 mejores tiempos guardados localmente.
          </Text>
        </Box>

        <Box flex={1} bg="$coolGray100" borderRadius="$xl" p="$3">
          {scores.length === 0 ? (
            <VStack flex={1} alignItems="center" justifyContent="center">
              <Text color="$coolGray600">Aun no hay puntuaciones.</Text>
            </VStack>
          ) : (
            <ScrollView>
              <VStack space="sm">
                {scores.map((score, index) => (
                  <HStack
                    key={`${score.label}-${score.time}-${score.date}-${index}`}
                    justifyContent="space-between"
                    alignItems="center"
                    bg="$white"
                    borderRadius="$lg"
                    p="$3"
                    borderWidth={1}
                    borderColor="$coolGray200"
                  >
                    <VStack>
                      <Text bold color="$coolGray900">
                        #{index + 1} {score.label}
                      </Text>
                      <Text size="xs" color="$coolGray600">
                        {score.date}
                      </Text>
                    </VStack>
                    <Text size="xl" bold color="$teal700">
                      {score.time}s
                    </Text>
                  </HStack>
                ))}
              </VStack>
            </ScrollView>
          )}
        </Box>

        <Button bg="$red600" onPress={() => void clearScores()}>
          <ButtonText>Limpiar puntuaciones</ButtonText>
        </Button>
      </VStack>
    </Box>
  );
}
