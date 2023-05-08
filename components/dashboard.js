// components/dashboard.js
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Button, Platform, PermissionsAndroid } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Camera } from 'react-native-vision-camera';
import { useState, useEffect } from 'react';
import { IconButton } from 'react-native-paper';

function Profile() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{ fontSize: 24,  color: '#1B1B1B'}}>Welcome to {'\n'} Face Watch</Text>
      <Text style={{ textAlign: 'center',  color: '#1B1B1B' }}> {'\n'} Express yourself and connect with others through  {'\n'} Face Watch, the app  that lets you take {'\n'} a selfie and message other users with fun features {'\n'} like stickers, filters, and emojis. With end-to-end encryption and convenient messaging options, {'\n'} Face Watch makes it easy to stay in touch {'\n'} with your friends and family. 
        {'\n'}{'\n'}{'\n'}Our app is designed to be easy and intuitive, with {'\n'} personalized  messaging options that make it simple to {'\n'} capture  the moment and express yourself.{'\n'} Stay connected  through individual or group {'\n'} conversations,  and keep track of your messages {'\n'} with our status  indicators. Whether you're  {'\n'} sharing a quick snap or having a longer conversation, {'\n'} Face Watch is the perfect app for {'\n'} staying in touch.</Text>
      <Text style={{ color: 'black', fontSize: 20,  color: '#1B1B1B'}}>{'\n'}{'\n'}Support</Text>
      <Text style={{ color: '#1B1B1B'}}>Our friendly team is here to help.</Text>
      <Text style={{ color: '#5E239D'}}>support@facewatch.co.za</Text>
    </View>
  );
}

function Photo() {
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [cameraDevice, setCameraDevice] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const [isTakingPicture, setIsTakingPicture] = useState(false);
  const [pictureUri, setPictureUri] = useState(null);

  useEffect(() => {
    const requestCameraPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setHasCameraPermission(true);
        } else {
          setCameraError('Camera permission denied');
        }
      } else {
        setHasCameraPermission(true);
      }
    };

    requestCameraPermission();

    (async () => {
      try {
        const availableDevices = await Camera.getAvailableCameraDevices();
        console.log('availableDevices:', availableDevices);

        const defaultCamera = isFrontCamera
          ? availableDevices.find((device) => device.position === 'front')
          : availableDevices.find((device) => device.position === 'back');
        if (!defaultCamera) {
          throw new Error(
            `${isFrontCamera ? 'Front' : 'Back'} camera not found on device`
          );
        }

        setCameraDevice(defaultCamera);
        console.log('cameraDevice:', cameraDevice);
         } catch (error) {
        setCameraError(error.message);
        console.log('cameraError:', error.message);
      } finally {
        setCameraReady(true);
        console.log('cameraReady:', cameraReady);
      }
    })();
  }, [isFrontCamera]);

   const handleCameraToggle = () => {
    // toggle isFrontCamera and update the camera device accordingly
    setIsFrontCamera((prev) => !prev);
  };

  const handleTakePicture = async () => {
    if (!isTakingPicture) {
      setIsTakingPicture(true);
      try {
        const data = await Camera.takePictureAsync();
        setPictureUri(data.uri);
      } catch (error) {
        console.log(error);
      } finally {
        setIsTakingPicture(false);
      }
      // introduce bug here
      setPictureUri(null);
    }
  };

  if (!cameraReady) {
    return (
      <View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black'
      }}>
        <Text style={{ color: 'white' }}>Loading...</Text>
      </View>
    );
  }

  if (cameraError) {
    return (
      <View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Text style={{ color: 'white' }}>{cameraError}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Camera style={{ flex: 1 }}
        device={cameraDevice}
        isActive={true} />
        
        <View style={{ position: 'absolute', bottom: 0, left: 0,right: 0, height: 100, backgroundColor: 'transparent',flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity style={{ height: 60, width: 60, borderRadius: 30, backgroundColor: 'white', alignSelf: 'center', marginHorizontal: 20 }}
          onPress={handleTakePicture}>
          </TouchableOpacity>
          
        </View>
          <IconButton
          icon={isFrontCamera ? 'camera-front' : 'camera-rear'}
          color="white"
          size={30}
          onPress={handleCameraToggle}
          style={{
            position: 'absolute', top: 40, right: 10 }} />
    </View>
  );
}

function Chat() {
  return (
    <View >
      
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function DashboardNavigator() {
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
        tabBarActiveTintColor: '#F6AE2D',
        tabBarInactiveTintColor: 'white',
        tabBarStyle: {
          display: 'flex',
          backgroundColor: '#5E239D',
          borderTopLeftRadius: 40,
          height: 70,
          borderTopRightRadius: 40,
        },
          tabBarLabel: () => null, // hide tab bar labels
          headerShown: false, // hide header
      })}>
      
      <Tab.Screen name="Chat" component={Chat} options={{ title: '' }} />
      <Tab.Screen name="Mirror" component={Photo} options={{ title: '' }} />
      <Tab.Screen name="About The App" component={Profile}  options={{ title: '' }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    justifyContent: 'center',
    alignItems: 'center',
    padding: 35,
    backgroundColor: '#fff'
  },
  textStyle: {
    fontSize: 15,
    marginBottom: 20,
    color: "black"
  },

});


/**
 * 
 * 
 * function Dashboard() {
  return (
    <View >
      
    </View>
  );
}

function DashboardScreen() {
  const currentUser = firebase.auth().currentUser;
  const displayName = currentUser ? currentUser.displayName : '';

  return (
    <View style={{ flex: 1 }}>
      <Dashboard />
      <View style={styles.container}>
        <Text style={styles.textStyle}>
          Hello, {displayName}
        </Text>
        <Button
          color="#3740FE"
          title="Logout"
          onPress={() => firebase.auth().signOut()}
        />
      </View>
    </View>
  );
}
 */