import { NewAppScreen } from '@react-native/new-app-screen';
import { useEffect, useState } from 'react';
import { Button, StatusBar, StyleSheet, Text, useColorScheme, View, ScrollView } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { runSimulation } from './nbody';
import { sum } from './longFile';
const a = sum();

function generateLargeArray() {
  // const largeArray = [];
  // for (let i = 0; i < 5_000_000; i++) {
    // largeArray.push(new Map());
    // largeArray.push(new Set());
    // largeArray.push(() => {});
    // largeArray.push({});
    // largeArray.push(`${i} this is very very very long string`);
  // }
  // return largeArray;
}

function App() {
  const [_, __] = useState(generateLargeArray());
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();
  const [output, setOutput] = useState('');

  const test = () => {
    const start = Date.now();
    for (let i = 0; i < 2000; i++) {
      runSimulation();
    }
    const end = Date.now();
    setOutput(`N-Body simulation completed in ${end - start} ms`);
  };

  useEffect(() => {
    console.log('time_checkpoint2: ' + Date.now());
    console.log(a);
    console.log((HermesInternal as any).getInstrumentedStats());
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text>Sum: {a}</Text>
      <Text>Hermes version: {(HermesInternal as any).getRuntimeProperties()['OSS Release Version']}</Text>
      <Button title="Run N-Body Simulation" onPress={test} />
      <Button title="gc" onPress={() => {(globalThis as any).gc()}} />
      <Text>{output}</Text>
      <NewAppScreen
        templateFileName="App.tsx"
        safeAreaInsets={safeAreaInsets}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
  },
});

export default App;
