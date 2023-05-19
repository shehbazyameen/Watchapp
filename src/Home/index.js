import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import Colors from '../../common/Colors';
import Profile from './components/Profile';
import CameraView from './components/CameraView';

const HomeScreen = (props) => {

  const Tab = createBottomTabNavigator();
  
  function Chat() {
    return (
      <View >
        
      </View>
    );
  }

  return (
    <Tab.Navigator
     screenOptions={({ route }) => ({
       tabBarIcon: ({ color, size }) => {
         let iconName;
         if (route.name === 'Chat') {
           iconName = 'comments-o';
         } else if (route.name === 'Mirror') {
           iconName = 'camera';
         } else if (route.name === 'About The App') {
           iconName = 'user';
         }
         return <Icon name={iconName} size={size} color={color} />;
       },
       tabBarActiveTintColor: Colors.activeTintColor,
       tabBarInactiveTintColor: Colors.whiteColor,
       tabBarStyle: {
         display: 'flex',
         backgroundColor: Colors.backgroundColor,
         borderTopLeftRadius: 40,
         height: 70,
         borderTopRightRadius: 40,
       },
         tabBarLabel: () => null, // hide tab bar labels
         headerShown: false, // hide header
     })}>
     
     <Tab.Screen name="Chat" {...props} component={Chat} options={{ title: '' }} />
     <Tab.Screen name="Mirror" {...props} component={CameraView} options={{ title: '' }} />
     <Tab.Screen name="About The App" component={Profile}  options={{ title: '' }} />

   </Tab.Navigator>
 );

}

export default HomeScreen

const styles = StyleSheet.create({})