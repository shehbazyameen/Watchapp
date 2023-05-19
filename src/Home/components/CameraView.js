import { StyleSheet, Text, View , TouchableOpacity , Platform, PermissionsAndroid } from 'react-native'
import React , { useState , useRef , useEffect } from 'react'
//import ScanView from '../../../components/ScanView.android';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Camera } from 'react-native-vision-camera';
import { IconButton } from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
const RNFS = require('react-native-fs');
import Share from "react-native-share";

const CameraView = (props) => {

  const navigation = useNavigation();  
  const cameraRef = useRef();

  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [cameraDevice, setCameraDevice] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const [isTakingPicture, setIsTakingPicture] = useState(false);
  const [pictureUri, setPictureUri] = useState(null);
  const [cameraType , setCameraType] = useState('front');

  useEffect(() => {
    requestCameraPermission();
    renderCamera(isFrontCamera);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
        renderCamera(isFrontCamera);
    });
    return unsubscribe;
  }, [navigation]);


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

  const renderCamera = async (isFrontCamera = true) => {
    try {
      const availableDevices = await Camera.getAvailableCameraDevices();
      //console.log('availableDevices:', availableDevices);

      const defaultCamera = isFrontCamera
        ? availableDevices.find((device) => device.position === 'front')
        : availableDevices.find((device) => device.position === 'back');
      if (!defaultCamera) {
        throw new Error(
          `${isFrontCamera ? 'Front' : 'Back'} camera not found on device`
        );
      }
      setCameraDevice(null);
      setCameraDevice(defaultCamera);
      //console.log('cameraDevice:', cameraDevice);
  } catch (error) {
      setCameraError(error.message);
      console.log('cameraError:', error.message);
    } finally {
      setCameraReady(true);
      console.log('cameraReady:', cameraReady);
    }
  }

  const onButtonAction = () => {

  }

  const handleTakePicture = async () => {
    //if (!isTakingPicture) {
      setIsTakingPicture(true);
      try {        
          if(cameraRef.current){            
            const photo = await cameraRef.current.takePhoto({
              qualityPrioritization: 'quality',
              flash: 'on',
              enableAutoRedEyeReduction: true
            });

            // var data = await RNFS.readFile(photo.path, 'base64').then(res => {
            //   console.log("base 63", res);
            //   return res;
            // });

            var filepath = photo.path;
            if (!filepath.includes('file://')) {
                  filepath = 'file://' + filepath;
            } 
            await share({
              title: "Sharing image file from awesome share app",
              message: "Please take a look at this image",
              url:filepath
            });
          }
          
      } catch (error) {
        console.log(error);
      } finally {
        setIsTakingPicture(false);
      }
      // introduce bug here
      setPictureUri(null);
    //}
  };

  const share = async (customOptions) => {
    try {
      await Share.open(customOptions);
    } catch (err) {
      console.log('err' ,err);
    }
  };




  const handleCameraToggle = () => {
    // toggle isFrontCamera and update the camera device accordingly
    //setIsFrontCamera((prev) => !prev);
    var tmp = isFrontCamera;
    renderCamera(tmp);
    setIsFrontCamera(!isFrontCamera);
    if(cameraType == 'front'){
      setCameraType('back')
    }else{
      setCameraType('front')
    }

    
  };

  return (
    <View style={styles.container}>
      {
        cameraDevice != null &&
        <Camera 
          ref={cameraRef}
          style={{ flex: 1 }}
          device={cameraDevice}
          photo={true}
          //aspect={Camera.constants.aspect}
          //captureTarget={Camera.constants.CaptureTarget.disk}
          //type={cameraType}
          //mirrorImage={isFrontCamera}
          isActive={true} />
      }
      
        
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
  )
}

export default CameraView

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
})