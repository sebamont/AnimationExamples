// In App.js in a new project

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import * as Pages from './src/pages';
import Home from './Home';

const Stack = createNativeStackNavigator();
const pagesNames = Object.keys(Pages);
function App() {
  return (
    <NavigationContainer>
      <GestureHandlerRootView style={{flex: 1}}>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={Home} />
          {pagesNames.map(name => (
            <Stack.Screen
              key={name}
              name={name}
              // @ts-ignore
              component={Pages[name]}
            />
          ))}
        </Stack.Navigator>
      </GestureHandlerRootView>
    </NavigationContainer>
  );
}

export default App;
