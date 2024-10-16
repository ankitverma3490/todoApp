import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TodoScreen from './src/screen/TodoScreen';
import SubTodoScreen from './src/screen/SubTodoScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="TodoScreen">
        <Stack.Screen name="TodoScreen" component={TodoScreen} options={{ title: 'Todo App' }} />
        <Stack.Screen name="SubTodoScreen" component={SubTodoScreen} options={{ title: 'Sub-todo' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
