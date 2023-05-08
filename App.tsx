// App.js
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './components/login';
import Signup from './components/signup';
import Dashboard from './components/dashboard';
import Splash from './components/splash';
import Getstarted from './components/getstarted';


const Stack = createStackNavigator();


function MyStack() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#5E239D',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontFamily: 'Poppins-Bold',
        },
      }}
      >
      <Stack.Screen 
        name="Signup" 
        component={Signup} 
        options={{ title: 'Signup' }}
      />       
      <Stack.Screen 
        name="Login" 
        component={Login} 
        options={{title: 'Login', headerShown: false}}
      />
      <Stack.Screen 
       name="Dashboard" 
       component={Dashboard} 
       options={
         { title: 'Dashboard',  headerShown: false }}
      />

      <Stack.Screen 
       name="Getstarted" 
       component={Getstarted} 
       options={
         { title: 'Getstarted', headerShown: false }}
      />
    </Stack.Navigator>
  );
}
export default function App() {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  }, []);

  return (
    <NavigationContainer>
      {isLoading ? <Splash /> : <MyStack />}
    </NavigationContainer>
  );
}