// components/signup.js
import React, { Component } from 'react';
import { StyleSheet, ToastAndroid, Text,TextInput, Button, View, ActivityIndicator, Switch } from 'react-native';
import firebase from '../database/firebase';

export default class Signup extends Component {
  
  constructor() {
    super();
    this.state = { 
      displayName: '',
      email: '', 
      password: '',
      isLoading: false,
      isEmail: false,
      phone: '',
      verificationCode: '',
      confirmResult: null
    };
  }

  toggleSwitch = () => {
    this.setState({
      isEmail: !this.state.isEmail
    });
  };

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  registerUser = () => {
    
    if (this.state.isEmail && this.state.email === '' && this.state.password === '') {
      ToastAndroid.show('Enter details to signup!', ToastAndroid.SHORT);
    } else if (!this.state.isEmail && this.state.phone === '' && this.state.password === '') {
      ToastAndroid.show('Enter details to signup!', ToastAndroid.SHORT);
    } else if (this.state.password.length < 6) {
      ToastAndroid.show('Password should be at least 6 characters long', ToastAndroid.SHORT);
    } else {
      this.setState({
        isLoading: true,
      })
      if (this.state.isEmail) {
        firebase
          .auth()
          .createUserWithEmailAndPassword(this.state.email, this.state.password)
          .then((res) => {
            res.user.updateProfile({
              displayName: this.state.displayName
            })
            ToastAndroid.show('User registered successfully!', ToastAndroid.SHORT);
            this.setState({
              isLoading: false,
              displayName: '',
              email: '',
              password: ''
            })
            this.props.navigation.navigate('Login')
          })
          .catch(error => this.setState({ errorMessage: error.message }))
      } else {
        // Register with phone number
        // Add your phone registration code here
        // Register with phone number

      firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((userCredential) => {
        var user = userCredential.user;
        console.log('user', user); // check if user object is defined and contains expected properties
        user.updateProfile({
          displayName: this.state.name
        }).then(() => {
          // Update successful
          console.log('updateProfile successful'); // log successful update
        }).catch((error) => {
          // An error occurred while updating the user profile
          console.log('updateProfile error', error); // log error
        });
        user.updatePhoneNumber(this.state.phone)
          .then(() => {
            this.setState({ isLoading: false });
            ToastAndroid.show('User registered successfully!', ToastAndroid.SHORT);
            this.props.navigation.navigate('Login');
            console.log('updatePhoneNumber successful'); // log successful update
          })
          .catch((error) => {
            console.log('updatePhoneNumber error', error); // log error
            this.setState({ isLoading: false });
            ToastAndroid.show('User registered successfully!', ToastAndroid.SHORT);
          });
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        // Handle error
        console.log('createUserWithEmailAndPassword error', error); // log error
      });


      }
    }
  }


  render() {

    if(this.state.isLoading){
      return(
        <View style={styles.preloader}>
          <ActivityIndicator size="large" color="#9E9E9E"/>
        </View>
      )
    }    

    return (
      <View>
        <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center', borderWidth: 1, borderColor: '#F6AE2D', borderRadius: 50, marginTop: 50 }}>
          <Text style={{ color: 'black', marginHorizontal: 50, }}>Phone</Text>
          <Switch
            value={this.state.isEmail}
            onValueChange={this.toggleSwitch}
            trackColor={{ false: "#1B1B1B", true: "#5E239D" }}
            thumbColor={this.state.isEmail ? "#F6AE2D" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            style={{
              transform: [{ scaleX: 2 }, { scaleY: 2 }],
              borderRadius: 25,
              paddingLeft: 10,
              paddingRight: 10,
              paddingBottom: 50,
            }} />

          <Text style={{ color: 'black', marginHorizontal: 50, }}>Email</Text>
        </View>


      {this.state.isEmail ? (
        <View>
          <TextInput
            style={{
              width: '85%',
              marginBottom: 20,
              paddingBottom: 15,
              top: 100,
              alignSelf: "center",
              borderColor: "#ccc",
              borderBottomWidth: 1,
              color: "#3740FE",
              }}
            placeholder="Name"
            placeholderTextColor="#aaa"
            value={this.state.displayName}
            onChangeText={(val) => this.updateInputVal(val, 'displayName')}
          />
          <TextInput

            style={{
              width: '85%',
              marginBottom: 20,
              paddingBottom: 15,
              top: 100,
              alignSelf: "center",
              borderColor: "#ccc",
              borderBottomWidth: 1,
              color: "#3740FE",
              }}

            placeholder="Email"
            placeholderTextColor="#aaa"
            value={this.state.email}
            onChangeText={(val) => this.updateInputVal(val, 'email')}
          />
          <TextInput

            style={{
              width: '85%',
              marginBottom: 20,
              paddingBottom: 15,
              top: 100,
              alignSelf: "center",
              borderColor: "#ccc",
              borderBottomWidth: 1,
              color: "#3740FE",
               marginBottom: 150,
              }}

            placeholder="Password"
            placeholderTextColor="#aaa"
            value={this.state.password}
            onChangeText={(val) => this.updateInputVal(val, 'password')}
            maxLength={15}
            secureTextEntry={true}
          />
        </View>
        ) : ( 

          <View>

            <TextInput

             style={{
              width: '85%',
              marginBottom: 20,
              paddingBottom: 15,
              top: 100,
              alignSelf: "center",
              borderColor: "#ccc",
              borderBottomWidth: 1,
              color: "#3740FE",
              }}

              placeholder="Name"
              placeholderTextColor="#aaa"
              value={this.state.name}
              onChangeText={(val) => this.updateInputVal(val, 'name')}
            />

            <TextInput
              style={{
                width: '85%',
                marginBottom: 20,
                paddingBottom: 15,
                top: 100,
                alignSelf: "center",
                borderColor: "#ccc",
                borderBottomWidth: 1,
                color: "#3740FE",
              }}
              placeholder="Email"
              placeholderTextColor="#aaa"
              value={this.state.email}
              onChangeText={(val) => this.updateInputVal(val, 'email')}
              keyboardType="email-address"
            />

            <TextInput
              style={{

                width: '85%',
                marginBottom: 20,
                paddingBottom: 15,
                top: 100,
                alignSelf: "center",
                borderColor: "#ccc",
                borderBottomWidth: 1,
                color: "#3740FE",
              }}
              placeholder="Phone Number"
              placeholderTextColor="#aaa"
              value={this.state.phone}
              onChangeText={(val) => this.updateInputVal(val, 'phone')}
              keyboardType="numeric" // add this line to show numeric keyboard only
            />

            <TextInput
              style={{
              width: '85%',
              marginBottom: 20,
              paddingBottom: 15,
              top: 100,
              alignSelf: "center",
              borderColor: "#ccc",
              borderBottomWidth: 1,
              color: "#3740FE",
              marginBottom: 150}}

              placeholder="Password"
              placeholderTextColor="#aaa"
              value={this.state.password}
              onChangeText={(val) => this.updateInputVal(val, 'password')}
              maxLength={15}
              secureTextEntry={true}
            />
          </View> 
        )}

        <View >
          <Button
            color="#5E239D"
            title="Sign Up"
            onPress={() => this.registerUser()}
            style={{ width: 200 }}
            />
        </View>
          <Text 
            style={styles.loginText}
            onPress={() => this.props.navigation.navigate('Login')}>Already Registered? Click here to login
          </Text>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: 35,
    backgroundColor: '#fff'
  },

  loginText: {
    color: '#F6AE2D',
    marginTop: 25,
    textAlign: 'center',
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
  
  containerB: {
    
  },

  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },

  switch: {
    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }]
  }
  
});


/**
 * Resources
 * 
 * <TextInput
          style={styles.inputStyle}
          placeholder="Name"
          placeholderTextColor="#aaa"
          value={this.state.displayName}
          onChangeText={(val) => this.updateInputVal(val, 'displayName')}
        />      
        <TextInput
          style={styles.inputStyle}
          placeholder="Email"
          placeholderTextColor="#aaa"
          value={this.state.email}
          onChangeText={(val) => this.updateInputVal(val, 'email')}
        />
        <TextInput
          style={styles.inputStyle}
          placeholder="Password"
          placeholderTextColor="#aaa"
          value={this.state.password}
          onChangeText={(val) => this.updateInputVal(val, 'password')}
          maxLength={15}
          secureTextEntry={true}
        />   
        <Button
          color="#5E239D"
          title="Signup"
          onPress={() => this.registerUser()}
        />
        <Text 
          style={styles.loginText}
          onPress={() => this.props.navigation.navigate('Login')}>
          Already Registered? Click here to login
        </Text>          
 */