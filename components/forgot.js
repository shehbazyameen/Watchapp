import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import firebase from '../database/firebase';

export default class Forgot extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      errorMessage: null
    }
  }

  handleResetPassword = () => {
    firebase.auth().sendPasswordResetEmail(this.state.email)
      .then(() => {
        Alert.alert('Reset Password Email Sent', 'Please check your email to reset your password.');
      })
      .catch((error) => {
        this.setState({ errorMessage: error.message });
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Reset Password</Text>
        {this.state.errorMessage &&
          <Text style={styles.error}>{this.state.errorMessage}</Text>}
        <TextInput
          style={styles.input}
          placeholder="Enter your email address"
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <TouchableOpacity style={styles.button} onPress={this.handleResetPassword}>
          <Text style={styles.buttonText}>Reset Password</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  error: {
    color: 'red',
    marginBottom: 10
  },
  input: {
    width: '80%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20
  },
  button: {
    backgroundColor: '#5E239D',
    width: '80%',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16
  }
});
