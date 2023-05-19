import { View, Text } from 'react-native'
import React from 'react'

export default function Profile() {
    return (
        
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{ fontSize: 24,  color: '#1B1B1B'}}>Welcome to {'\n'} Face Watch</Text>
            <Text style={{ textAlign: 'center',  color: '#1B1B1B' }}> {'\n'} Express yourself and connect with others through  {'\n'} Face Watch, the app  that lets you take {'\n'} a selfie and message other users with fun features {'\n'} like stickers, filters, and emojis. With end-to-end encryption and convenient messaging options, {'\n'} Face Watch makes it easy to stay in touch {'\n'} with your friends and family. 
                {'\n'}{'\n'}{'\n'}Our app is designed to be easy and intuitive, with {'\n'} personalized  messaging options that make it simple to {'\n'} capture  the moment and express yourself.{'\n'} Stay connected  through individual or group {'\n'} conversations,  and keep track of your messages {'\n'} with our status  indicators. Whether you're  {'\n'} sharing a quick snap or having a longer conversation, {'\n'} Face Watch is the perfect app for {'\n'} staying in touch.</Text>
            <Text style={{ color: 'black', fontSize: 20,  color: '#1B1B1B'}}>{'\n'}{'\n'}Support</Text>
            <Text style={{ color: '#1B1B1B'}}>Our friendly team is here to help.</Text>
            <Text style={{ color: '#5E239D'}}>support@facewatch.co.za</Text>
        </View>
        
    )
}