import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {navigateAndReset, navigateAndSimpleReset, navigationRef} from "./Root";
import ScanneScreen from "./ScanneScreen";

function HomeScreen({navigation}) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text onPress={() => navigateAndSimpleReset("ScanneScreen")}>Retourner</Text>
    </View>
  );
}
function SecondScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Second Screen</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{
        headerShown: false
      }}>
        <Stack.Group screenOptions={{
          presentation: 'transparentModal',
        }}>
          <Stack.Screen  name="ScanneScreen" component={ScanneScreen} />
          <Stack.Screen  name="HomeScreen" component={HomeScreen} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
