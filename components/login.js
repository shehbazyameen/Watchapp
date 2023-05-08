// components/login.js
import React, { Component } from 'react';
import { StyleSheet, StatusBar, Image, ToastAndroid, Text, View, TextInput, Button, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import firebase from '../database/firebase';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Login extends Component {
  
  constructor() {
    super();
    this.state = { 
      email: '', 
      password: '',
      isLoading: false,
      showPassword: false, // add a new state to track whether to show the password or not
      isUsingEmail: true, // add a new state to track whether email or phone is being used
      phone: '', // add a new state for the phone number input
      dialingCode: '+27',
      hasLoggedIn: false, // add a new state to track whether the user has logged in before
    }
    
  }

  componentDidMount() {
  // get the flag from AsyncStorage
    AsyncStorage.getItem('hasLoggedIn')
      .then(value => {
        if (value !== null) {
          // user has logged in before
          this.setState({ hasLoggedIn: true });
        }
      })
      .catch(error => {
        // handle the error
        console.error(error);
        Alert.alert(
          'Error',
          'There was an error loading your login status. Please try again later.',
          [{ text: 'OK', onPress: () => {} }],
          { cancelable: false }
        );
      });
  }


  toggleLoginMethod = () => {
    const { isUsingEmail } = this.state;
    this.setState({ isUsingEmail: !isUsingEmail });
  }

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  // new function to handle selecting a different dialing code
  onDialingCodeChange = (itemValue) => {
    this.setState({ dialingCode: itemValue });
  }
  

  userLogin = () => {
    const { email, password, isUsingEmail, phone, dialingCode } = this.state;
    if ((isUsingEmail && (email === '' || password === '')) || (!isUsingEmail && phone === '')) {
      ToastAndroid.show('Enter details to signin!', ToastAndroid.SHORT);
    } else {
      this.setState({
        isLoading: true,
      });
      const appVerifier = null; // add appVerifier if you're using phone authentication
      const loginMethod = isUsingEmail
        ? firebase.auth().signInWithEmailAndPassword(email, password)
        : firebase.auth().signInWithPhoneNumber(`${dialingCode}${phone}`, appVerifier);
      loginMethod
        .then((res) => {
          console.log(res);
          console.log('User logged-in successfully!');
          this.setState({
            isLoading: false,
            email: '',
            password: '',
            phone: '',
          });
          AsyncStorage.setItem('hasLoggedIn', 'true'); // set the flag in AsyncStorage
          ToastAndroid.show('Login success!', ToastAndroid.SHORT);
          if (!this.state.hasLoggedIn) {
            this.props.navigation.navigate('Getstarted'); // navigate to the getstarted screen if the user has not logged in before
          } else {
            this.props.navigation.navigate('Dashboard');
          }
        })
        .catch((error) => {
          this.setState({ isLoading: false, errorMessage: error.message });
          ToastAndroid.show('Login failed! Please check your credentials.', ToastAndroid.SHORT);
        });
    }
  }

  userRegister = () => {
    const { phone, password, dialingCode } = this.state;
    if (phone === '' || password === '') {
      ToastAndroid.show('Enter details to register!', ToastAndroid.SHORT);
    } else {
      this.setState({
        isLoading: true,
      });
      const appVerifier = null; // add appVerifier if you're using phone authentication
      firebase.auth().createUserWithEmailAndPassword(`${phone}@domain.com`, password)
        .then((res) => {
          console.log(res);
          console.log('User registered successfully!');
          this.setState({
            isLoading: false,
            phone: '',
            password: '',
          });
          ToastAndroid.show('Registration success!', ToastAndroid.SHORT);
          this.props.navigation.navigate('Dashboard');
        })
        .catch((error) => {
          this.setState({ isLoading: false, errorMessage: error.message });
          ToastAndroid.show('Registration failed! Please check your details.', ToastAndroid.SHORT);
        });
    }
  }

  resetPassword = () => {
    const { email, phone, dialingCode, isUsingEmail } = this.state;

    if (isUsingEmail && email === '') {
      ToastAndroid.show('Please enter your email.', ToastAndroid.SHORT);
      return;
    } else if (!isUsingEmail && phone === '') {
      ToastAndroid.show('Please enter your phone number.', ToastAndroid.SHORT);
      return;
    }

    const actionCodeSettings = {
      // Change this to your app URL or custom domain if applicable
      url: 'https://chat-app-bc936.firebaseapp.com/__/auth/action?mode=action&oobCode=code',
      handleCodeInApp: true,
    };

    const auth = firebase.auth();

    if (!auth) {
      console.error('firebase object is not defined');
      return;
    }

    if (isUsingEmail) {
      auth.sendPasswordResetEmail(email, actionCodeSettings)
        .then(() => {
          ToastAndroid.show('Password reset email sent. Check your inbox!', ToastAndroid.SHORT);
          this.setState({ email: '' });
        })
        .catch(error => this.setState({ errorMessage: error.message }));
    } else {
      const phoneNumber = `${dialingCode}${phone}`;
      this.verifyPhoneNumber(auth, phoneNumber);
    }
  };

  verifyPhoneNumber = (auth, phoneNumber) => {
    auth.verifyPhoneNumber(phoneNumber, 60)
      .then(verificationId => {
        this.setState({
          verificationId,
          isLoading: false,
          email: '',
          phone: '',
          isVerifying: true,
        });
      })
      .catch(error => this.setState({ errorMessage: error.message }));
  };


  render() {
    if(this.state.isLoading){
      return(
        <View style={styles.preloader}>
          <ActivityIndicator size="large" color="#9E9E9E"/>
        </View>
      )
    }    

    //const { isUsingEmail, email, password, phone } = this.state;
    const { isUsingEmail, email, password, phone, dialingCode } = this.state;

    return (
      <View style={styles.container}>
        <StatusBar translucent={true} backgroundColor="transparent" />
        <Image style={{ width: 250, height: 200 }} source={require('../Faceapp.png')}/>
        <Text style={styles.SigninText}> Sign In </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.buttonPhone, !isUsingEmail && styles.selectedButton]}
            onPress={() => this.setState({ isUsingEmail: false })}>
            <Text style={styles.buttonText1}>Phone</Text>
          </TouchableOpacity>

          <Text style={styles.orText}> Or </Text>
          <TouchableOpacity
            style={[styles.buttonEmail, isUsingEmail && styles.selectedButton]}
            onPress={() => this.setState({ isUsingEmail: true })}>
              <Text style={styles.buttonText1}>Email</Text>
          </TouchableOpacity>
        </View>
        
        {isUsingEmail ? (
          <TextInput
          style={styles.inputStyle}
          placeholder="Email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={(val) => this.updateInputVal(val, 'email')}/>
          ) : (
          
          <View style={styles.phoneInputContainer}>
            <View style={styles.phoneFlagContainer}>
              <Picker
                style={styles.phoneFlagPicker}
                selectedValue={dialingCode}
                onValueChange={(value) => this.updateInputVal(value, 'dialingCode')}>
                  <Picker.Item label="🇿🇦 +27" value="+27" color="#aaa" />
                  <Picker.Item label="🇰🇪 +254" value="+254" color="#aaa" />
                  <Picker.Item label="🇧🇼 +267" value="+267" color="#aaa" />
                  <Picker.Item label="🇸🇿 +268" value="+268" color="#aaa" />
                  <Picker.Item label="🇱🇸 +266" value="+266" color="#aaa" />
                  <Picker.Item label="🇳🇦 +264" value="+264" color="#aaa" />
                  {/* Add more options for other dialing codes */}
              </Picker>
            </View>
            <TextInput
              style={styles.phoneInput}
              placeholder="65 622 1831"
              placeholderTextColor="#aaa"
              value={phone}
              onChangeText={(val) => this.updateInputVal(val, 'phone')}
              keyboardType="numeric" // add this line to show numeric keyboard only
              />
          </View>)}

          <TextInput
            style={styles.inputStyle}
            placeholder="Password"
            placeholderTextColor="#aaa"
            value={this.state.password}
            onChangeText={(val) => this.updateInputVal(val, 'password')}
            maxLength={15}
            secureTextEntry={true}/>
          
            <TouchableOpacity onPress={() => this.resetPassword()}>
              <Text style={styles.forgotPassword}>Forgot password?</Text>
            </TouchableOpacity>
  
            <View style={{
              backgroundColor: '#5E239D',
              width: 320,
              height: 50,
              borderRadius: 25,
              alignSelf: 'center',
              justifyContent: 'center',
            }}>
              
            <TouchableOpacity onPress={() => this.userLogin()}>
              <Text
                style={{ color: '#FFFFFF', textAlign: 'center', fontSize: 16 }}>Sign In
              </Text>
              </TouchableOpacity>
              </View>
                <Text style={styles.textBlackColor}>Don't have an account?</Text>
                  <Text style={styles.textBlackColor1}
                    onPress={() => this.props.navigation.navigate('Signup')}>
                      Create account
                  </Text>
              </View>
              );
      }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: 'center',
    padding: 35,
    backgroundColor: '##171717'
  },

  inputStyle: {
    width: '100%',
    marginBottom: 15,
    paddingBottom: 15,
    alignSelf: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderColor: '#5E5F68',
    borderRadius: 60,
    paddingLeft: 20,
    color: '#000',
  },

  forgotPassword: {
    color: '#F6AE2D',
    fontSize: 16,
    paddingBottom: 20,
    paddingLeft: 180,
  },

  textBlackColor: {
    color: '#5E5F68',
    marginTop: 25,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '400'
  },

  textBlackColor1: {
    color: 'black',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '400',
    color: '#F6AE2D'
  },

  logoText: {
    color: '#5E5F68',
    fontSize: 30,
    fontWeight: 400,
  },

  SigninText: {
    fontSize: 25,
    fontWeight: 400,
    color: '#5E5F68',
    paddingBottom: 50
  },

  preloader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },


  /**Button css */
  buttonContainer: {
    flexDirection: 'row', // set flexDirection to row
    justifyContent: 'center', // align buttons horizontally at center
    paddingBottom: 60
  },

  buttonPhone: {
    backgroundColor: '#5E239D',
    fontSize: 16,
    paddingTop: 10,
    paddingBottom: 10,
    textAlign: 'center',
    paddingRight: 42,
    paddingLeft: 42,
    borderRadius: 60,
    marginHorizontal: 5, // add horizontal margin between buttons
  },

  buttonEmail: {
    textAlign: 'center',
    backgroundColor: '#1B1B1B',
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 42,
    paddingLeft: 42,
    borderRadius: 60,
    marginHorizontal: 5, // add horizontal margin between buttons
  },

  buttonText1: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },

  orText: {
    fontSize: 18,
    color: '#5E5F68',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 8
  },

  /**End of button css */

  /**Login Button */

  loginButton: {
    width: '100%',
    color: 'black'
  },
  /** End  */

  /**Picker Dialing code */
  
  phoneInputContainer: {
    width: '100%',
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#5E5F68',
    borderRadius: 60,
    marginBottom: 15,
    overflow: 'hidden'
  },

  phoneFlagContainer: {
    borderWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0, // set to non-zero value for borderBottom
    borderBottomColor: '#5E5F68', // optional: set desired color
    borderColor: '#5E5F68',
    paddingLeft: 10,
    paddingTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 0,
    marginRight: -20,
    
  },

  phoneFlagPicker: {
    width: 150,
    marginRight: -55,
  },

  phoneInput: {
    flex: 1,
    color: '#5E5F68',
    marginLeft: 5,
  },
  
  /**End */
});

/**
 * 
 * <TextInput
      style={styles.inputStyle}
      placeholder="Phone Number"
      value={phone}
      onChangeText={(val) => this.updateInputVal(val, 'phone')}/>

      <TextInput
            style={styles.inputStyle}
            placeholder="Phone Number"
            value={phone}
            onChangeText={(val) => this.updateInputVal(val, 'phone')}/>
 */