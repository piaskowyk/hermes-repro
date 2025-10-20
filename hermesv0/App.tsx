/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { useEffect, useState } from 'react';
import { Button, StatusBar, StyleSheet, Text, useColorScheme, View, ScrollView } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { runSimulation } from './nbody';
import { sum } from './longFile'


function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}
const a = sum();
function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();
  const [output, setOutput] = useState('');

  const test = () => {
    const start = Date.now();
    for (let i = 0; i < 10; i++) {
      runSimulation();
    }
    const end = Date.now();
    setOutput(`N-Body simulation completed in ${end - start} ms`);
  };

  useEffect(() => {
    console.log('time_checkpoint2: ' + Date.now());
    console.log(a);
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text>Sum: {a}</Text>
      <Text>Hermes version: {HermesInternal.getRuntimeProperties()['OSS Release Version']}</Text>
      <Button title="Run N-Body Simulation" onPress={test} />
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
