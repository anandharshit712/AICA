import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from './Components/LoginPage';
import MainScreen from './Components/MainScreen';
import SummarizerPage from './Components/SummarizerPage.tsx';

const Stack = createNativeStackNavigator();
export default function App(){
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={LoginPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
              name="Main"
              component={MainScreen}
              options={{headerShown: false}}
          />
            <Stack.Screen
                name="Summarizer"
                component={SummarizerPage}
                options={{headerShown: false}}
            />
        </Stack.Navigator>
      </NavigationContainer>
    );
}
